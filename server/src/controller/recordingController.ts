import { generateSOAPSummary } from "./soapController";
import { transcribeAudio } from "./transcriptionController";

export async function processRecording(recordingUrl: string): Promise<{
  transcription: string;
  soapSummary: string;
}> {
  try {
    const transcription = await transcribeAudio(recordingUrl);
    const soapSummary = await generateSOAPSummary(transcription);
    
    return {
      transcription,
      soapSummary,
    };
  } catch (error) {
    console.error('Error in processRecording:', error);
    throw error;
  }
}