
const API_KEY = "AIzaSyBwuFhByXFi7X4GO9MERMeOW4f1D-6oOFQ";

async function listModels() {
    console.log("Fetching models via REST...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
