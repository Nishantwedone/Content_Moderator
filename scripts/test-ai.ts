
// scripts/test-ai.ts
import { analyzePost } from "../lib/ai/analyze";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

async function main() {
    console.log("Testing AI Analysis with Toxic Content...");

    const toxicPost = {
        title: "I hate everyone",
        content: "This is a test promoting hate speech and violence. I want to kill them all."
    };

    try {
        const result = await analyzePost(toxicPost);
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
