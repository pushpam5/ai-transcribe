import CallDetails from "../models/callDetails";
import { generateSOAPSummary } from "./soapController";
import { transcribeAudio } from "./transcriptionController";

export async function processRecording(recordingUrl: string, sessionId: string): Promise<{
  transcription: string;
  soapSummary: string;
}> {
  try {
    const transcription = await transcribeAudio(recordingUrl);

    const callDetails = await CallDetails.findOne({sessionId: sessionId});
    if(callDetails){
      callDetails.transcription = transcription;
      await callDetails.save();
    }

    const soapSummary = await generateSOAPSummary(transcription);
    if(callDetails){
      callDetails.soapNote = soapSummary;
      await callDetails.save();
    }
    
    return {
      transcription,
      soapSummary,
    };
  } catch (error) {
    console.error('Error in processRecording:', error);
    throw error;
  }
}