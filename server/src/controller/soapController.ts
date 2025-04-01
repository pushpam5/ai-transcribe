import OpenAI from 'openai';
import retry from 'async-retry';
import { ChatCompletionTool } from 'openai/resources/chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const tools: ChatCompletionTool[] = [
  {
      type: "function",
      function: {
        name: "SOAP_SUMMARY",
        description: "Contains the SOAP summary of the medical call transcription",
        parameters: {
          type: "object",
          properties: {
            subjective: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "The subjective findings and patient history"
                },
                references: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      transcriptIndex: { type: "number" }
                    }
                  },
                  description: "References to specific parts of the transcription that support these findings"
                }
              }
            },
            objective: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "The objective examination findings"
                },
                references: {
                  type: "array",
                  items: {
                    type: "object", 
                    properties: {
                      text: { type: "string" },
                      transcriptIndex: { type: "number" }
                    }
                  },
                  description: "References to specific parts of the transcription that support these findings"
                }
              }
            },
            assessment: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "The assessment and diagnosis"
                },
                references: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      transcriptIndex: { type: "number" }
                    }
                  },
                  description: "References to specific parts of the transcription that support this assessment"
                }
              }
            },
            plan: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "The treatment plan and next steps"
                },
                references: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      transcriptIndex: { type: "number" }
                    }
                  },
                  description: "References to specific parts of the transcription that support this plan"
                }
              }
            }
          },
          required: ["subjective", "objective", "assessment", "plan"]
        },
      },
    },
  ];

export async function generateSOAPSummary(transcription: string): Promise<string | undefined> {
  try {
    return await retry(
      async (bail) => {
        try{
            const response = await openai.chat.completions.create({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'system',
                  content: `You are an expert medical scribe assistant. Create a SOAP note from the following medical encounter transcription. 
                  Format your response with clear Subjective, Objective, Assessment, and Plan sections.`
                },
                {
                  role: 'user',
                  content: transcription
                }
              ],
              tools,
              tool_choice: "auto",
              temperature: 0.1,
              max_tokens: 8000
            });


          const toolCalls = response.choices[0]?.message?.tool_calls;
          if (!toolCalls?.[0]?.function?.arguments) {
            throw new Error('No valid response from OpenAI');
          }
          return toolCalls?.[0]?.function?.arguments;
        } catch(err){
            if (
              err instanceof OpenAI.APIError &&
              err.status &&
              [400, 401, 403].includes(err.status)
            ) {
              bail(err);
              return;
            } else {
              throw err;
            }
        }
      },
      {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 8000,
        onRetry: (error, attempt: number) => {
          console.log(`Attempt ${attempt}: Retrying due to error: `, error);
        }
      }
    );    
  } catch (error) {
    console.error('OpenAI error:', error);
    throw error;
  }
} 