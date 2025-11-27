'use server';

/**
 * @fileOverview This file defines a Genkit flow for estimating gas fees and suggesting optimal times for claiming tokens.
 *
 * It includes:
 * - `estimateGasFeesAndSuggestTime`: A function to estimate gas fees and suggest optimal times.
 * - `GasEstimationInput`: The input type for the gas estimation function.
 * - `GasEstimationOutput`: The output type for the gas estimation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GasEstimationInputSchema = z.object({
  currentGasPrice: z
    .number()
    .describe('The current gas price in Gwei.'),
  networkLoad: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The current perceived network load.'),
  tokenSymbol: z
    .string()
    .describe('The symbol of the token to be claimed (e.g., $FLOW).'),
  userWalletAddress: z
    .string()
    .describe('The wallet address of the user claiming the tokens.'),
});
export type GasEstimationInput = z.infer<typeof GasEstimationInputSchema>;

const GasEstimationOutputSchema = z.object({
  estimatedGasFee: z
    .number()
    .describe('The estimated gas fee in ETH for claiming the tokens based on the current price.'),
  prediction: z.string().describe('A 24-hour gas price trend forecast (e.g., "Prices are expected to decrease in the next 4-6 hours...").'),
  optimalClaimWindow: z.string().describe('The specific recommended time window for the user to claim (e.g., "Between 2:00 AM and 5:00 AM UTC").'),
  reasoning: z.string().describe('A brief explanation for the recommendation, citing network load and typical usage patterns.')
});
export type GasEstimationOutput = z.infer<typeof GasEstimationOutputSchema>;

export async function estimateGasFeesAndSuggestTime(
  input: GasEstimationInput
): Promise<GasEstimationOutput> {
  return gasEstimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gasEstimationPrompt',
  input: {schema: GasEstimationInputSchema},
  output: {schema: GasEstimationOutputSchema},
  prompt: `You are a Gas Fee Analyst AI. Your task is to provide a smart gas fee estimation and a 24-hour prediction to help a user claim their {{tokenSymbol}} tokens cost-effectively.

Current Conditions:
- Current Gas Price: {{currentGasPrice}} Gwei
- Network Load: {{networkLoad}}
- User Wallet: {{userWalletAddress}}

Based on your knowledge of typical blockchain network congestion patterns (e.g., lower activity during UTC night, higher during US business hours), provide the following:
1.  **estimatedGasFee**: Calculate a simple estimated gas fee in ETH. Assume a standard claim transaction uses 21,000 gas units. Formula: (21000 * currentGasPrice) / 1,000,000,000.
2.  **prediction**: A 24-hour forecast for gas price trends.
3.  **optimalClaimWindow**: The absolute best time window (e.g., "Between 3:00 AM and 6:00 AM UTC") to claim in the next 24 hours.
4.  **reasoning**: A brief explanation for your recommendation, considering the current network load and typical weekly/daily patterns.

Be concise and provide actionable advice.
`,
});

const gasEstimationFlow = ai.defineFlow(
  {
    name: 'gasEstimationFlow',
    inputSchema: GasEstimationInputSchema,
    outputSchema: GasEstimationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
