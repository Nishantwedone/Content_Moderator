
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeContent(title: string, content: string | null) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        You are an AI Content Moderator for a social platform.
        Analyze the following post for safety.
        
        Title: "${title}"
        Content: "${content || "No content"}"
        
        Rules:
        1. Hate Speech, Harassment, Violence, Self-Harm, and Sexual Content are STRICTLY PROHIBITED.
        2. Spam or Scams are PROHIBITED.
        3. Political or controversial topics are ALLOWED but should be flagged if inflammatory.
        4. If the content is safe, typically helpful, or neutral, status should be "APPROVED".
        5. If the content violates rules or is ambiguous, status should be "FLAGGED".
        6. If the content is clearly illegal or severe (e.g. child exploitation, terrorism), status should be "REJECTED".

        Respond ONLY with a valid JSON object in this format:
        {
            "status": "APPROVED" | "FLAGGED" | "REJECTED",
            "reason": "Short explanation of the decision (max 20 words)"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const analysis = JSON.parse(jsonStr);
        return {
            status: analysis.status as "APPROVED" | "FLAGGED" | "REJECTED",
            reason: analysis.reason as string
        };

    } catch (error: any) {
        console.error("Gemini Analysis FAILED:", error);
        if (error.response) {
            console.error("Gemini API Error details:", JSON.stringify(error.response, null, 2));
        }
        // Fallback to FLAGGED if AI fails, so a human can review
        return {
            status: "FLAGGED",
            reason: `AI Error: ${error.message || "Unknown error"}`
        };
    }
}
