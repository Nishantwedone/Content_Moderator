
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Hardcoding key for testing to rule out env var issues first
const API_KEY = "AIzaSyBwuFhByXFi7X4GO9MERMeOW4f1D-6oOFQ";


async function test() {
    console.log("Testing Gemini API...");
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // List models to see what is available
        console.log("Listing models...");
        // Note: listModels is not directly on genAI instance in some versions,
        // but typically we can use a model to check or just try 'gemini-pro' again.

        console.log("Trying gemini-flash-latest...");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello");
        console.log("gemini-flash-latest Success:", await result.response.text());

    } catch (error) {
        console.error("gemini-pro Failed:", error.message);
    }
}

test();
