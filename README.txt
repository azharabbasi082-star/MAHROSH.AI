MAHROSH AI — Exhibition Chatbot
===============================

1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Open Terminal in the project folder.
4. Run: npm install
5. Rename .env.example to .env
6. Put your OpenAI and Gemini API keys in .env.
7. Run: npm start
8. Open: http://localhost:3000

Security:
- Never put API keys inside public/index.html.
- Never publish/share your .env file.
- .env is ignored by Git.

Notes:
- OpenAI is attempted first.
- If OpenAI fails, Gemini is attempted.
- Gemini is configured with Google Search capability.
- Model names can change; if your API account uses different model IDs,
  update OPENAI_MODEL and GEMINI_MODEL in .env.
