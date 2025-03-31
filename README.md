# Transcription and SOAP Generations using LLMs for medical consultations

A web application that facilitates virtual consultations between doctors and patients, featuring post call transcription and SOAP note generation using LLMs

## Features

- Real-time video consultations
- Automatic recording of consultations
- Speech-to-text transcription of recordings
- AI-powered SOAP note generation

## Tech Stack

- Frontend:
  - React
  - 100ms SDK for video calls

- Backend:
  - Node.js
  - Deepgram and OpenAI for transcription and SOAP note generation respectively

## Setup

1.  Clone the repository:
```bash
  git clone git@github.com:pushpam5/ai-transcribe.git
  cd ai-transcribe
```

2. Set the environment variables in `client/src/lib/constants` and copy `.env.example` keys to `.env`

3. Execute run script:
```bash
  sh ./run-script.sh
```
