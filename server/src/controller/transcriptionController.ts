import { createClient } from '@deepgram/sdk';
import dotenv from 'dotenv';

dotenv.config();

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY || '');

export async function transcribeAudio(recordingUrl: string): Promise<string> {
  try {
    const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl(
        {
          url: recordingUrl
        },
        { smart_format: true, model: 'nova-2-medical', paragraphs:true, language: 'en-US' },
      );

    if (error) throw error;
    
    const paragraphs = result?.results?.channels[0]?.alternatives[0]?.paragraphs?.transcript;
    if(paragraphs){
        return paragraphs;
    }
    
    return result?.results?.channels[0]?.alternatives[0]?.transcript || '';
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
} 