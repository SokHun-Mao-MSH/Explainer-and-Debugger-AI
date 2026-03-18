# Project Requirement Document: Code Clarity AI

## 1. Project Overview
**Code Clarity AI** is a full-stack web application designed as a "Learning Assistant" and "Code Optimizer" for developers. It leverages the power of Google's Gemini AI to provide instant code explanations, debugging assistance, and refactoring suggestions.

## 2. Target Audience
- **Beginner Developers**: To understand logic and syntax of unfamiliar code.
- **Students**: To learn programming concepts through real-world examples.
- **Experienced Developers**: To quickly debug errors or refactor code for better performance and readability.

## 3. Functional Requirements
### 3.1 Source Code Editor
- **Multi-language Support**: Users can select the programming language (e.g., JavaScript, Python, etc.).
- **Syntax Highlighting**: A professional-grade editor interface for writing or pasting code.
- **Input Validation**: Ensure code is provided before attempting analysis.

### 3.2 AI Analysis Engine
- **Task Selection**: Users can choose between three modes:
  - **Explain**: Step-by-step breakdown of code logic.
  - **Debug**: Identification of bugs and provision of fixed code.
  - **Refactor**: Suggestions for improving code quality and best practices.
- **Gemini Integration**: Integration with `gemini-3-flash-preview` for high-speed, accurate code processing.
- **Contextual Insights**: The AI provides structured responses based on the selected task.
- **Language Localization**: Ability to receive responses in different languages (e.g., English, Khmer).

### 3.3 User Interface
- **Responsive Design**: Optimized for both desktop and mobile viewing.
- **Real-time Feedback**: Loading states and error handling (e.g., "Analysis Interrupted") to inform the user of system status.
- **Modern Aesthetic**: A clean, "Technical Dashboard" feel using Tailwind CSS.

## 4. Technical Stack
### 4.1 Frontend
- **Framework**: React (TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

### 4.2 Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI SDK**: `@google/genai`
- **Environment Management**: `dotenv`

### 4.3 Infrastructure
- **Hosting**: Render (Web Service)
- **Version Control**: GitHub
- **API Provider**: Google AI Studio (Gemini API)

## 5. Security Requirements
- **API Key Protection**: The Gemini API key must **never** be exposed to the client-side. All AI calls must be proxied through the Express.js backend.
- **Environment Variables**: Secrets must be managed via Render's Environment settings and local `.env` files (excluded from Git).
- **Leak Prevention**: `.gitignore` must strictly exclude `.env` files to prevent credential exposure.

## 6. Deployment Configuration
- **Build Command**: `npm install && node node_modules/vite/bin/vite.js build`
- **Start Command**: `node node_modules/tsx/dist/cli.mjs server.ts`
- **Port**: 3000 (standard for Render/Cloud Run environments)

## 7. Future Roadmap
- **History Tracking**: Allow users to save previous explanations.
- **Code Refactoring**: Add a feature where the AI suggests improvements to the pasted code.
- **Unit Test Generation**: Automatically generate test cases for the analyzed code.
