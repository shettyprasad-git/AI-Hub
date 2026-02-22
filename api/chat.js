import { HfInference } from '@huggingface/inference';

export default async function handler(req, res) {
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

        const hfToken = process.env.HUGGINGFACE_API_KEY;

        if (!hfToken) {
            console.error('HUGGINGFACE_API_KEY is missing');
            return res.status(500).json({
                message: 'Hugging Face Access Token not found. Please add HUGGINGFACE_API_KEY in Vercel Environment Variables.'
            });
        }

        const hf = new HfInference(hfToken);

        // We use a high-quality free model that works well with the Inference API
        const response = await hf.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
                { role: "system", content: "You are a helpful, smart, and friendly AI assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
        });

        const text = response.choices[0].message.content;

        return res.status(200).json({ response: text });
    } catch (error) {
        console.error('Error in Hugging Face generation:', error);
        return res.status(500).json({ message: 'Failed to generate response', error: error.message });
    }
}
