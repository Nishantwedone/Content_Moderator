
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("GEMINI_API_KEY is missing!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
    console.log("Checking API key access...");
    try {
        // There isn't a direct listModels on the client instance in some versions.
        // The library usually exposes it differently or relies on getting a model first.
        // But let's try to just use "gemini-pro" which is standard.
        console.log("Testing with 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello!");
        console.log("Success with gemini-pro:", await result.response.text());
    } catch (e) {
        console.error("Failed with gemini-pro:", e.message);
    }

    try {
        console.log("Testing with 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello!");
        console.log("Success with gemini-1.5-flash:", await result.response.text());
    } catch (e) {
        console.error("Failed with gemini-1.5-flash:", e.message);
    }
}

main();
