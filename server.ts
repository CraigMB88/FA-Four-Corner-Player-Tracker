import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Report
  app.post("/api/generate-report", async (req: express.Request, res: express.Response) => {
    try {
      const { player, evaluation } = req.body;
      if (!player || !evaluation) {
        res.status(400).json({ error: "Missing player or evaluation details" });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing on server" });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
You are an expert FA UEFA A License Youth Football Coach.
Create an inspiring, highly professional, structured player development report based on the FA Four Corner Model.
Use a constructive, positive, growth-mindset, and encouraging tone suitable for a youth football player (and their parents).

Player Information:
- Name: ${player.name}
- Age Group: ${player.ageGroup}
- Position: ${player.position}
- Preferred Foot: ${player.preferredFoot}
- Squad Number: ${player.squadNumber || 'None'}
- Coach Notes: ${evaluation.coachNotes || 'None'}

Corner Ratings (Scale of 1 to 5):
1. TECHNICAL/TACTICAL:
   - Dribbling & Ball Control: ${evaluation.ratings.technical.dribbling}/5
   - Passing & Receiving: ${evaluation.ratings.technical.passing}/5
   - Shooting & Finishing: ${evaluation.ratings.technical.shooting}/5
   - Tackling & Intercepting: ${evaluation.ratings.technical.defending}/5
   - Tactical Awareness: ${evaluation.ratings.technical.tactical}/5
   
2. PHYSICAL:
   - Agility & Balance: ${evaluation.ratings.physical.agility}/5
   - Speed & Acceleration: ${evaluation.ratings.physical.speed}/5
   - Stamina & Endurance: ${evaluation.ratings.physical.stamina}/5
   - Strength & Shielding: ${evaluation.ratings.physical.strength}/5

3. PSYCHOLOGICAL:
   - Confidence & Belief: ${evaluation.ratings.psychological.confidence}/5
   - Focus & Concentration: ${evaluation.ratings.psychological.focus}/5
   - Decision Making: ${evaluation.ratings.psychological.decisionMaking}/5
   - Resilience & Determination: ${evaluation.ratings.psychological.resilience}/5

4. SOCIAL:
   - Communication: ${evaluation.ratings.social.communication}/5
   - Teamwork: ${evaluation.ratings.social.teamwork}/5
   - Discipline & Respect: ${evaluation.ratings.social.discipline}/5
   - Leadership: ${evaluation.ratings.social.leadership}/5

The report should have the following sections in clean Markdown format:
1. **Executive Summary**: A warm, encouraging paragraph summarizing the player's current developmental phase, highlighting their core strengths.
2. **Analysis by FA Four Corner Model**:
   - Provide a brief description of their highlights and areas to focus on for each of the 4 Corners:
     - *Technical/Tactical*
     - *Physical*
     - *Psychological*
     - *Social*
3. **Actionable Training Tips (Action Plan)**: Give 2-3 specific, actionable training drills or exercises the player can practice at home or during team training to improve their scores.
4. **Motivational Closing**: A short, encouraging statement to keep the player inspired and working hard.

Format instructions: Use clean markdown, professional section titles, and keep it structured, warm, and highly personalized.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const reportText = response.text;
      res.json({ report: reportText });
    } catch (error: any) {
      console.error("Error generating report via Gemini:", error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
