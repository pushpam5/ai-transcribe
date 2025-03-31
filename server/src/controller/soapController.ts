import OpenAI from 'openai';
import dotenv from 'dotenv';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateSOAPSummary(transcription: string): Promise<string> {
  try {
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
      tools: [
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
        ],
      tool_choice: "auto",
      temperature: 0.1,
      max_tokens: 8000
    });

    const toolCalls = response.choices[0]?.message?.tool_calls;
    const functionArguments = toolCalls && toolCalls[0]?.function?.arguments;
    return functionArguments || '';
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Failed to generate SOAP summary');
  }
} 