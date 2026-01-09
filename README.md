# Micro-Learning Platform (with Audio / Audiobook Support)

This is a **Next.js micro-learning platform** that allows users to:

- Generate structured courses using AI
- Learn lesson-by-lesson with **progress tracking**
- Take **quizzes** after lessons (read mode)
- Switch to **audio / audiobook mode** powered by **Piper TTS**
- Resume courses from where they left off
- Restart completed courses

---

## Key Features

### Course & Learning

- AI-generated micro-learning courses
- Lessons grouped into topics
- Quizzes per topic (attached to a specific lesson)
- Progress tracking per user
- Resume from last incomplete lesson
- Restart completed courses

### Audio / Audiobook Mode

- Toggle between **Read mode** and **Audio mode**
- Audio generated using **Piper TTS (open-source, offline)**
- Audio auto-plays when:

  - Entering audio mode
  - Navigating Next / Previous lessons

- No quizzes in audio mode (intentional UX choice)
- Supports “Play entire course” style listening flow

### Authentication

- User authentication via **Clerk**
- User progress stored per authenticated user

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Drizzle ORM**
- **PostgreSQL**
- **Clerk Auth**
- **Piper TTS (HTTP server via Docker)**
- **Tailwind CSS**

---

## Getting Started (Local Development)

### Install Dependencies

```bash
npm install
```

---

### Start the Piper TTS Server (Required for Audio)

The app expects a **Piper TTS HTTP server** running locally.

#### Run using Docker:

```bash
docker run --rm -p 5001:5000 piper-tts-http
```

This will start Piper at:

```
http://localhost:5001
```

> ⚠️ Keep this container running while using audio features.

---

### Start the Next.js App

```bash
npm run dev
```

Open the app in your browser:

```
http://localhost:3000
```

---

## How Text-to-Speech Works

- Lesson audio is generated on-demand
- Next.js calls the Piper HTTP server (`localhost:5001`)
- Audio is streamed back as **WAV**
- The frontend auto-plays the audio

### API Used Internally

```http
POST http://localhost:5001
Content-Type: application/json

{
  "text": "Lesson content here"
}
```

---

## Using Audio Mode in the App

1. Open a course
2. Toggle **Audio mode**
3. Audio starts automatically
4. Click **Next / Previous**

   - Audio switches automatically to the new lesson

5. Switch back to **Read mode** anytime to access quizzes

---

## Development Notes

- Audio generation is **not cached yet** (can be added later)
- Piper runs completely offline once voices are downloaded
- No Docker rebuild is needed for frontend changes
- Docker rebuild is only required if:

  - You change Piper voices
  - You change the TTS container setup

---

## Common Commands

```bash
# Start Next.js
npm run dev

# Build Next.js
npm run build

# Run Piper TTS
docker run --rm -p 5001:5000 piper-tts-http

OR

docker run -p 5001:5000 piper-tts-http
```

---

## Deployment Notes

- Next.js can be deployed to **Vercel**
- Piper TTS should be deployed as a **separate service** (VM, Docker host, or container platform)
- Update the TTS endpoint URL in production accordingly
