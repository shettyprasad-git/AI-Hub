import { HfInference } from "@huggingface/inference";

async function test() {
    const hf = new HfInference(); // No token
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "What is 2+2?" }
            ]
        });
        console.log("Success:", response.choices[0].message.content);
    } catch (err) {
        console.error("HF Inference Error:", err.message);
    }
}

test();
