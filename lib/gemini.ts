
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Buffer } from "buffer"; // Required for image processing

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeContent(title: string, content: string | null, imageUrl: string | null) {
    try {
        // Use gemini-1.5-flash-latest which acts as a stable alias
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const promptParts: any[] = [
            `You are an AI Content Moderator. Analyze this post.
            
            Title: "${title}"
            Content: "${content || "No text content"}"
            
            Rules:
            1. REJECT: Hate Speech, Violence, Self-Harm, Sexual/Nudity, Illegal acts.
            2. REJECT: Spam, Scams.
            3. FLAG: Controversial/Inflammatory political content, or Harassment.
            4. APPROVE: Safe, Neutral, Helpful content.

            Respond ONLY with JSON:
            { "status": "APPROVED" | "FLAGGED" | "REJECTED", "reason": "Max 10 words explanation" }`
        ];

        // Handle Image if present
        if (imageUrl) {
            // Check if it's a base64 string (from file upload)
            if (imageUrl.startsWith("data:image")) {
                const base64Data = imageUrl.split(",")[1];
                const mimeType = imageUrl.split(";")[0].split(":")[1];

                promptParts.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                });
            }
            // Handle public URLs (fetch and convert to base64)
            else if (imageUrl.startsWith("http")) {
                try {
                    const imageResp = await fetch(imageUrl);
                    const arrayBuffer = await imageResp.arrayBuffer();
                    const base64Data = Buffer.from(arrayBuffer).toString("base64");
                    const mimeType = imageResp.headers.get("content-type") || "image/jpeg";

                    promptParts.push({
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType
                        }
                    });
                } catch (e) {
                    console.error("Failed to fetch image for analysis:", e);
                    // Continue with text analysis only if image fails
                }
            }
        }

        const result = await model.generateContent(promptParts);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const analysis = JSON.parse(jsonStr);

        return {
            status: analysis.status as "APPROVED" | "FLAGGED" | "REJECTED",
            reason: analysis.reason as string
        };

    } catch (error: any) {
        console.error("Gemini Analysis FAILED:", error);
        // RETURN THE ACTUAL ERROR for debugging
        return {
            status: "FLAGGED",
            reason: `AI Error: ${error.message || "Unknown error"}`
        };
    }
}
