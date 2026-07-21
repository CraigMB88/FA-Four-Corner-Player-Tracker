# BLYPAN Player Tracker ⚽🤖

An AI-powered web application and Progressive Web App (PWA) designed to track grassroots youth football progression across four holistic pillars: **Technical**, **Physical**, **Psychological**, and **Social**. 

The app processes coach evaluation inputs through an LLM evaluation engine to generate structured, actionable, and personalized player development plans.

---

## 🌟 Key Features

- **4-Pillar Evaluation Framework:** Log player performance across Technical, Physical, Psychological, and Social metrics.
- **AI Evaluation Engine:** Generates tailored post-match training recommendations using Google's Gemini API.
- **Progressive Web App (PWA):** Mobile-optimized layout with full offline/home-screen support for pitch-side use.
- **Seamless Deployments:** Continuous integration setup connecting GitHub commits directly to production builds on Vercel.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **AI Integration:** `@google/genai` (Google Gemini API)
- **Deployment:** Vercel (PWA)
- **Repository:** GitHub

---

## 🚀 Environment Variables Setup

To run this project locally or on production deployments (e.g., Vercel), you must configure your Gemini API Key. 

Because this project is built with **Vite**, client-side environment variables must be prefixed with `VITE_`.

### 1. Local Development (`.env.local`)
Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here