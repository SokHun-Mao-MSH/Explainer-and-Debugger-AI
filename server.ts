import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  // Use the PORT environment variable for cloud hosting, default to 3000 for local
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json());

  // Gemini API Endpoint (Backend)
  app.post("/api/explain", async (req, res) => {
    try {
      const { code, language, targetLanguage, task = 'explain' } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      let prompt = "";

      switch (task) {
        case 'refactor':
          prompt = `
            You are "Code Refactorer AI", a Senior Software Architect.
            Analyze the following ${language} code for performance, security, readability, and maintainability.
            
            IMPORTANT: You MUST provide the entire response in ${targetLanguage}.
            
            Your response MUST follow this structure:
            1. **Architectural Analysis**: Critique the original code's approach, mentioning Time/Space complexity if relevant.
            2. **Refactored Code**: Provide the highly optimized, clean, and modern version of the code. Use defensive programming practices.
            3. **Key Improvements**: 
               - **Performance**: How is it faster or lighter?
               - **Security**: Any vulnerabilities fixed?
               - **Readability**: Why is it easier to maintain?
            
            Code to refactor:
            \`\`\`${language}
            ${code}
            \`\`\`
          `;
          break;

        case 'debug':
        default:
          prompt = `
            You are "Code Rescue & Debug AI", an expert troubleshooting specialist.
            Analyze the provided input for syntax errors, logical bugs, edge cases, race conditions, and potential runtime exceptions.
            
            IMPORTANT: You MUST provide the entire response in ${targetLanguage}.
            
            Your response MUST follow this structure:
            1. **Root Cause Analysis**: Explain exactly *why* the error occurs and the logic flaw behind it (beyond just the error message).
            2. **Fixed Code**: Provide the fully corrected, robust, and working version of the code.
            3. **Technical Explanation**: Step-by-step breakdown of how the logic was corrected.
            4. **Pro Tip**: A quick tip or best practice to prevent this specific type of bug in the future.
            
            User's code (and optional error) to fix:
            \`\`\`${language}
            ${code}
            \`\`\`
          `;
          break;
      }

      // Use streaming to reply faster
      const result = await model.generateContentStream(prompt);

      if (!result.stream) {
        throw new Error("No stream was returned from the API. Check model name and API key validity.");
      }

      res.setHeader('Content-Type', 'text/plain');
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        res.write(chunkText);
      }
      res.end();
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      // If headers are already sent, we can't send a new JSON error response.
      if (res.headersSent) {
        res.end(); // End the stream abruptly.
      } else {
        const errorStr = error.message || String(error);
        // Default to sending the specific error from the API for better debugging.
        let message = `An error occurred on the server: ${errorStr}`;
        if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED")) {
          message = "Rate limit reached. Please try again in a minute.";
        } else if (errorStr.includes("API key not valid")) {
          message = "Invalid API key configured on server.";
        }
        res.status(500).json({ error: message });
      }
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
