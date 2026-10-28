export type ModelConfig = {
  apiKey: string;
  httpReferer: string;
  xTitle: string;

  provider: {
    sort: {
      by: string;
      partition: string;
    };
  };

  models: string[];
  temperature: number;
  maxTokens: number;
};

console.assert(process.env.OPENROUTER_API_KEY, 'OPENROUTER_API_KEY is not set in environment variables');

export const config: ModelConfig = {
  apiKey: process.env.OPENROUTER_API_KEY!,
  httpReferer: '',
  xTitle: 'IA Devs - Transforming Services into Tools',
  models: [
    // 'google/gemma-4-26b-a4b-it:free',
    // 'google/gemma-4-31b-it:free',
    // 'nvidia/nemotron-3-super-120b-a12b:free',
    'deepseek/deepseek-v4.1-flash-1017'
  ],
  provider: {
    sort: {
      by: 'throughput', // Route to model with highest throughput (fastest response)
      partition: 'none',
    },
  },
  temperature: 0.7,
  maxTokens: 2048,
};
