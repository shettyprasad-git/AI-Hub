import { Client } from "@gradio/client";

export default async function handler(req, res) {
    // CORS configuration if needed
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        // Connect to the popular Qwen 2.5 72B Instruct Space
        // This space is public and doesn't explicitly require an API key for basic usage via Gradio
        const client = await Client.connect("Qwen/Qwen2.5-72B-Instruct");

        // The exact api_name depends on the Space's Gradio configuration. 
        // We'll use the predict function. Usually it takes the query, history, and system prompt.
        const result = await client.predict("/model_chat", {
            query: prompt,
            history: [],
            system: "You are a helpful, smart, and friendly AI assistant.",
        });

        // Gradio usually returns the full conversation history. The last item is the AI's response.
        // result.data handles the returned tuple depending on the space structure.
        let text = "Response could not be parsed.";
        if (result && result.data && result.data.length > 0) {
            // Look at the returned data payload
            const payload = result.data[1]; // Typically history is at index 1
            if (Array.isArray(payload) && payload.length > 0) {
                const lastMessage = payload[payload.length - 1];
                text = lastMessage[1]; // The assistant's response is the second item in the tuple [user, assistant]
            }
        }

        return res.status(200).json({ response: text });
    } catch (error) {
        console.error('Error in chat generation via Gradio:', error);
        return res.status(500).json({ message: 'Failed to generate response via Space', error: error.message });
    }
}
