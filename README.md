# Kindify 🎙️

<img src="./public/hero.webp" height="350" alt="Kindify Hero">

Kindify is a playful web app that transforms any spoken input into a kind, polite version—displayed as text and played
back as voice. It demonstrates that **anything can be said kindly**.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![AI/ML](https://img.shields.io/badge/category-AI%2FML-orange.svg)

## 🚀 Features

- **Real-time Voice Capture**: Microphone input with automatic permission handling
- **AI-Powered Politeness**: VAPI.ai assistant transforms rude speech into kind responses
- **Dual Output**: Polite text display + TTS voice playback
- **Animated UI**: Abstract background animations and reactive microphone button
- **State Management**: Smooth transitions between listening, speaking, and processing states
- **Responsive Design**: Works on desktop and mobile browsers

---

## 🧩 Tech Stack

- **Next.js 15 (App Router)** - React framework with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **VAPI.ai SDK** - Real-time voice AI integration
- **Web Audio API** - Audio amplitude visualization

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **VAPI.ai Account** - Get your API key from [dashboard.vapi.ai](https://dashboard.vapi.ai)

### Installation

1. **Install dependencies**

```bash
bun install
```

2. **Set up environment variables**

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
```

Get your API key from [VAPI Dashboard](https://dashboard.vapi.ai) → API Keys.

3. **Run the development server**

 ```bash
 bun run dev
  ```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

*Made with ❤️ in a hurry*
