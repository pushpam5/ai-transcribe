import { createClient } from '@deepgram/sdk';
import dotenv from 'dotenv';
import retry from 'async-retry';

dotenv.config();

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY || '');

export async function transcribeAudio(recordingUrl: string): Promise<string | undefined> {
  try {
    const transcript = await retry(
      async (bail) => {
        try {
          const { result, error } = await deepgramClient.listen.prerecorded.transcribeUrl(
            {
              url: recordingUrl
            },
            { smart_format: true, model: 'nova-2-medical', paragraphs: true, language: 'en-US' },
          );
    
          if (error) {
            bail(new Error(error.message || 'Deepgram API error'));
            return '';
          }
        
          const paragraphs = result?.results?.channels[0]?.alternatives[0]?.paragraphs?.transcript;
          if (paragraphs) {
            return paragraphs;
          }
        
          return result?.results?.channels[0]?.alternatives[0]?.transcript || '';
        } catch (err: any) {
          if (err.status && [400, 401, 403].includes(err.status)) {
            bail(err);
            return;
          }
          throw err;
        }
      },
      {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (error) => {
          console.log(`Retrying transcription after error:`, error);
        }
      }
    );
    
    return transcript;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
} 