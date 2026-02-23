# AI-Hub 🤖✨

AI-Hub is a modern, sleek, and high-performance open-source chatbot application inspired by major AI conversational interfaces like ChatGPT and Gemini. It is built entirely on **React (Vite)**, beautifully styled with pure **Vanilla CSS** (featuring a gorgeous dark-mode glassmorphism aesthetic), and powered by **Hugging Face's cutting-edge AI models**.

**Live Demo:** [https://ai-hub-fawn.vercel.app/](https://ai-hub-fawn.vercel.app/) (*Hosted on Vercel*)

---

## ⚡ Key Features

- **Modern Glassmorphism UI:** Stunning dark-mode aesthetic featuring deep blurs, subtle gradient accents (`#6366f1` to `#ec4899`), micro-animations, and fluid transitions.
- **Serverless API Backend:** Securely routes requests via a Vercel Serverless Function (`api/chat.js`) so that API keys are never exposed to the frontend.
- **Dynamic Chat History:** Conversations are automatically titled based on your prompts and stored directly in your browser's `localStorage` so they survive page reloads!
- **User Profiles:** Customize your chatbot experience by setting a Display Name and picking a fun Emoji Avatar.
- **Supercharged Settings:** Complete control over your AI. Use the settings modal to edit the hidden **System Prompt**, allowing you to instantly change the AI's personality, formatting rules, or behavior. Also features a danger zone to wipe all chat history.
- **Responsive Design:** A fully collapsible sidebar makes the app beautiful and usable on mobile screens, tablets, and wide monitors.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite framework)
- **Styling:** Vanilla CSS (CSS Variables, Flexbox, Keyframe Animations)
- **Backend / Hosting:** Vercel (Serverless Functions)
- **AI Integration:** Hugging Face Inference API (`@huggingface/inference`) running `mistralai/Mistral-7B-Instruct-v0.2`
- **State Management:** React `useState` / `useEffect` with `localStorage` persistence

---

## 🚀 Local Development Setup

To run this project on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/shettyprasad-git/AI-Hub.git
cd AI-Hub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Environment Variables
Create a `.env` file in the root directory and add your free Hugging Face API key:
*(Get one for free at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens))*
```env
HUGGINGFACE_API_KEY="hf_your_generated_token_here"
```

### 4. Start the Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to see the app running locally!

---

## ☁️ Deployment

This project is configured right out of the box for deployment on **Vercel**. 

1. Import the Git repository into Vercel.
2. In the Vercel project **Settings > Environment Variables**, add the `HUGGINGFACE_API_KEY`.
3. Hit Deploy! Vercel will automatically build the React Vite app and deploy the serverless functions located in the `/api` directory.

---

*Built with ❤️ for a seamless, open-source AI chatting experience.*
