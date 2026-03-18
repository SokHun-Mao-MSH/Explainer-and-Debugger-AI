import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Endpoint (Backend)
  app.post("/api/explain", async (req, res) => {
    try {
      const { code, language, targetLanguage, task = 'explain' } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";

      let prompt = "";

      if (task === 'debug') {
        prompt = `
          You are "Code Debugger AI".
          Analyze the following ${language} code for bugs, errors, or logical flaws.
          
          IMPORTANT: You MUST provide the entire response in ${targetLanguage}.
          
          Your response MUST follow this structure:
          1. **Bug Report**: List any syntax errors or logical bugs found.
          2. **Fixed Code**: Provide the corrected version of the code.
          3. **Explanation of Fix**: Explain why the changes were made.
          
          Code to debug:
          \`\`\`${language}
          ${code}
          \`\`\`
        `;
      } else if (task === 'refactor') {
        prompt = `
          You are "Code Refactorer AI".
          Analyze the following ${language} code and suggest improvements for readability, performance, and best practices.
          
          IMPORTANT: You MUST provide the entire response in ${targetLanguage}.
          
          Your response MUST follow this structure:
          1. **Refactoring Suggestions**: List specific improvements.
          2. **Refactored Code**: Provide the improved version of the code.
          3. **Benefits**: Explain how these changes help (e.g., faster, cleaner).
          
          Code to refactor:
          \`\`\`${language}
          ${code}
          \`\`\`
        `;
      } else {
        prompt = `
          You are "Code Clarity AI", a beginner-friendly programming assistant.
          Analyze the following ${language} code and provide a clear, step-by-step explanation.
          
          IMPORTANT: You MUST provide the entire explanation in ${targetLanguage}.
          
          Your response MUST follow this structure:
          1. **Summary**: A brief overview of what the code does.
          2. **Line-by-Line Explanation**: Explain each line or block of code simply. Use code snippets if helpful.
          3. **Key Concepts**: Explain the main programming concepts used (e.g., loops, conditionals, data structures).
          
          Code to explain:
          \`\`\`${language}
          ${code}
          \`\`\`
          
          Keep the language simple and avoid overly technical jargon unless you explain it first.
        `;
      }

      const result = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = result.text;
      if (text) {
        res.json({ text });
      } else {
        throw new Error("Failed to generate explanation from Gemini.");
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      const errorStr = error.message || String(error);
      let message = "An error occurred on the server.";
      
      if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED")) {
        message = "Rate limit reached. Please try again in a minute.";
      } else if (errorStr.includes("API key not valid")) {
        message = "Invalid API key configured on server.";
      }
      
      res.status(500).json({ error: message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
