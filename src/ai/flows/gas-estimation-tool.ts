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
    .describe('The estimated gas fee in ETH for claiming the tokens.'),
  optimalClaimTimeSuggestion: z
    .string()
    .describe(
      'A suggestion for the optimal time to claim the tokens to avoid high gas costs.'
    ),
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
  prompt: `You are a helpful assistant that estimates gas fees for claiming tokens on a blockchain and suggests optimal claim times.

  Given the current gas price of {{currentGasPrice}} Gwei and the user's wallet address {{userWalletAddress}}, and the token symbol {{tokenSymbol}}, estimate the gas fee in ETH for claiming the tokens and suggest an optimal time to claim to avoid high costs.

  Provide a concise and user-friendly suggestion.
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
