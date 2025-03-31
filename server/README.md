# AI Medical Scribe Server

Backend server for an AI-powered medical transcription and SOAP note generation application.

## Description

This project provides a backend service that receives a URL to a medical recording, transcribes the audio using Deepgram, and then generates a structured SOAP (Subjective, Objective, Assessment, Plan) note from the transcription using OpenAI's GPT-4o model.

## Setup

1.  Clone the repository:
    ```bash
    git clone git@github.com:pushpam5/ai-transcribe.git
    cd ai-transcribe/server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Copy `.env.example` to `.env` and add your API keys:
    ```bash
    cp .env.example .env
    ```
    Then edit `.env` with your credentials:
    ```
    PORT=5000 # Or any port you prefer
    DEEPGRAM_API_KEY=your_deepgram_api_key
    OPENAI_API_KEY=your_openai_api_key
    ```

4.  Build the project (optional, for production):
    ```bash
    npm run build
    ```

5.  Start the server:
    ```bash
    # For development (with nodemon)
    npm run dev

    # For production (after building)
    npm run start
    ```

## Implementation

The server listens for incoming webhook requests containing a URL to an audio recording.

### Transcription
-   Uses the Deepgram Node.js SDK (`@deepgram/sdk`).
-   Calls the Deepgram API to transcribe the audio file specified by the URL.
-   Configured to use the `nova-2-medical` model.

### SOAP Note Generation
-   Uses the OpenAI GPT-4o to generate the SOAP summary
-   Sends the generated transcription to the OpenAI API
-   Utilizes OpenAI's function calling feature (`tools`) to request the SOAP note in a specific JSON structure, including Subjective, Objective, Assessment, and Plan sections, each with content and references to the transcript.

### API Endpoints

- POST `/webhook/recordings` - Store and process recording to generate transcription and SOAP summary
- POST `/webhook/session-start` - Store session details in the database
- GET `/sessions` - Get all the sessions
- Get `/sessions/:sessionId` - Get details for given sessionId 

### Scope of Improvement

- Run a separate job for transcription and SOAP report to handle the cases where because of some failure they were not generated (Use kafka topics to run these jobs)
- Implement a real-time model to generate paragraph-structured transcriptions as the meeting progresses.
