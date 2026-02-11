
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

interface AnalysisResult {
    flagged: boolean
    categories: string[]
    reason: string
    score: number
}

export async function analyzePost(post: {
    title: string
    content: string
    imageUrl?: string | null
}): Promise<AnalysisResult> {
    if (!genAI) {
        console.warn("GEMINI_API_KEY not set. Skipping AI analysis.")
        // If no API key, we might want to flag or just allow. 
        // Usually for dev we allow, but let's be strict if the user wants strictness.
        return { flagged: false, categories: [], reason: "AI Analysis Disabled", score: 0 }
    }

    // Using Gemini 2.0 Flash 
    // Note: This model may be rate-limited on the free tier. 
    // We handle errors below to ensure safety.
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `
    You are an expert content moderator for a community platform. 
    Analyze the following content for these policy violations:
    1. Toxicity (Abusive, disrespectful, or unreasonable language)
    2. Hate Speech (Attacks based on race, religion, gender, etc.)
    3. Harassment (Targeting individuals, bullying)
    4. Spam (Promotional, repetitive, or irrelevant content)
    5. NSFW (Nudity, sexual content, extreme violence)
    
    Content Title: ${post.title}
    Content Body: ${post.content}
    
    Return a JSON object strictly in this format:
    {
        "flagged": boolean,
        "categories": string[],
        "reason": "Short explanation...",
        "score": number (0-1)
    }
  `

    try {
        const parts: any[] = [prompt]

        if (post.imageUrl) {
            try {
                const imageResp = await fetch(post.imageUrl)
                const arrayBuffer = await imageResp.arrayBuffer()
                const base64Image = Buffer.from(arrayBuffer).toString("base64")
                const mimeType = imageResp.headers.get("content-type") || "image/jpeg"

                parts.push({
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType
                    }
                })
            } catch (imgError) {
                console.error("Failed to fetch image for analysis:", imgError)
            }
        }

        const output = await model.generateContent(parts)
        const response = output.response
        let text = response.text()

        // Clean up potential markdown filtering
        text = text.replace(/```json\n?|\n?```/g, "").trim()
        const jsonStart = text.indexOf('{')
        const jsonEnd = text.lastIndexOf('}')
        if (jsonStart !== -1 && jsonEnd !== -1) {
            text = text.substring(jsonStart, jsonEnd + 1)
        }

        const result = JSON.parse(text)

        const safeResult: AnalysisResult = {
            flagged: !!result.flagged,
            categories: Array.isArray(result.categories) ? result.categories : [],
            reason: result.reason || "No reason provided",
            score: typeof result.score === 'number' ? result.score : 0
        }

        console.log("Gemini Analysis Result:", safeResult)
        return safeResult

    } catch (error: any) {
        console.error("Gemini Analysis failed:", error)

        // FAIL-SAFE: If the AI errors out (Rate Limit, Network Error, etc.), 
        // automatically FLAG the post so it doesn't slip through.
        return {
            flagged: true,
            categories: ["System Error"],
            reason: "AI Analysis Failed (Rate Limit or Error) - Manual Review Required",
            score: 0
        }
    }
}
