import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import multer from "multer";
import OpenAI, { toFile } from "openai";
import fs from "fs";
import cors from "cors";
import path from "path"; // Make sure path is imported if not already



const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// 1. Transcription Endpoint
app.post("/transcribe", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded." });
    }

    const audioFile = await toFile(
      fs.createReadStream(req.file.path),
      "recording.webm",
      { type: "audio/webm" }
    );

    const transcript = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      language: "de",
    });

    fs.unlink(req.file.path, () => {});
    return res.json({ text: transcript.text });

  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
    console.error("Transcription Error:", error);
    return res.status(500).json({ error: "Failed to process transcription", details: error.message });
  }
});

// 2. Chat Reply Endpoint (Updated to active GPT-OSS model)
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b", // <--- Updated active model ID
      messages: [
        {
          role: "system",
          content: "You are a helpful German language partner. Respond naturally in German, keep sentences clear, and gently correct any grammar mistakes if necessary."
        },
        ...messages
      ],
      temperature: 0.7,
    });

    const replyText = completion.choices[0]?.message?.content || "Es tut mir leid, ich habe das nicht verstanden.";
    return res.json({ reply: replyText });

  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ error: "Failed to generate AI response", details: error.message });
  }
});

// 3. Text-to-Speech (TTS) Endpoint
app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided for speech synthesis." });
    }

    // Using OpenAI's audio speech API (compatible with Groq or OpenAI API key)
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });

    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    const tempFilePath = path.join("uploads", `speech_${Date.now()}.mp3`);
    
    fs.writeFileSync(tempFilePath, buffer);

    // Send the audio file back to the client
    res.download(tempFilePath, "speech.mp3", (err) => {
      // Clean up file after sending
      if (fs.existsSync(tempFilePath)) {
        fs.unlink(tempFilePath, () => {});
      }
    });

  } catch (error) {
    console.error("❌ TTS Error Details:", error);
    return res.status(500).json({ error: "Failed to generate speech", details: error.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Groq Free Tier`);
});