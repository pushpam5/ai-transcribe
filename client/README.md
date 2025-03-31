# AI Medical Scribe - Client Application

Frontend Application for an AI-powered medical transcription and SOAP note generation application.

## Description

This is the frontend React application for the AI Medical Scribe Application. It provides an interface for conducting doctor-patient calls and viewing the generated transcription and SOAP notes after the call concludes.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:pushpam5/ai-transcribe.git
    cd ai-transcribe/client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    In `src/lib/constants.ts`file add the env variables

4.  **Start the development server:**
    ```bash
    npm start
    ```
    The application should now be running on `http://localhost:3000` (or the next available port).

## How it Works

1.  The user enters the patient's name on the initial screen.
2.  Clicking "Start Call" joins the 100ms room specified. Call recording starts automatically.
3.  As the call ends the backend server receives a webhook event 
4.  The backend processes the recording (transcription, SOAP note generation).
5.  Once the backend provides the results (transcription and SOAP summary), the frontend displays them in the past conversations.
6.  The user can then start a new appointment.
