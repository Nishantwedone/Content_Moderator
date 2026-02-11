
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const candidateModels = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.0-pro",
    "gemini-pro",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash-lite-preview-02-05", // from earlier list
    "gemini-2.5-flash" // from earlier list
];

async function checkModel(modelName) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        await model.generateContent("Hello");
        console.log(`✅ SUCCESS: ${modelName}`);
        return true;
    } catch (error) {
        console.log(`❌ FAILED: ${modelName} - ${error.message.split('\n')[0]}`);
        return false;
    }
}

async function main() {
    console.log("Checking models...");
    for (const m of candidateModels) {
        await checkModel(m);
    }
}

main();
