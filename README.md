# Lilt 🗣️🇩🇪

An offline-ready, privacy-focused German language learning application designed to facilitate active speech production through an AI-powered conversational interface. Built with a modern modular architecture, Lilt helps learners transition from passive comprehension to confident oral output.

---

## ✨ Key Features

* **Interactive Conversational UI:** Engage in dynamic, task-oriented dialogues designed to build active German speech production.
* **Privacy-First & Offline-Ready:** Employs the browser's native `SpeechSynthesis` API and robust local fallback mechanisms to ensure a seamless experience with minimal external dependencies.
* **14-Screen Workflow Framework:** Comprehensive learning architecture guiding users through syntax training, phonetic word stress drills, and structural exercises.
* **Active Recall Systems:** Built-in integration patterns for spaced repetition and custom vocabulary expansion.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express, Multer, CORS
* **Speech Integration:** Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
* **AI Engine:** OpenAI Integration via secure backend middleware

---

## 📂 Project Structure

```text
├── src/                  # React/Vite Frontend Application
│   ├── components/       # UI components & workflow screens
│   └── ...
├── lilt-backend/         # Node.js/Express Backend Server
│   ├── server.js         # Main server entry point
│   └── ...
├── package.json          # Root workspace configuration
└── vercel.json           # Vercel deployment configuration

```

---

## 🚀 Getting Started Locally

### Prerequisites

* Node.js (v18 or higher recommended)
* npm

### Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/snajmieh/Instruktionsdesign-und-Sprachlernproduktentwicklung.git
cd Instruktionsdesign-und-Sprachlernproduktentwicklung

```


2. **Install dependencies for both frontend and backend:**
```bash
npm install
npm install --prefix lilt-backend

```


3. **Configure Environment Variables:**
Create a `.env` file inside the `lilt-backend` directory and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here

```


4. **Run the Development Environment:**
Using concurrently, you can launch both the frontend and backend servers with a single command from the root directory:
```bash
npm run dev

```



---

## 🚢 Deployment

* **Frontend:** Configured for seamless deployment on **Vercel** using Vite (`npm run build`, output directory: `dist`).
* **Backend:** Can be hosted on persistent Node.js platforms such as **Railway** or **Render** by pointing the service root to `lilt-backend` and supplying the `OPENAI_API_KEY` environment variable.

---

## 📄 License

This project is developed as part of instructional design and language learning product development research.
