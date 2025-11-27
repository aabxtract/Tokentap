'use server';

import { estimateGasFeesAndSuggestTime } from '@/ai/flows/gas-estimation-tool';
import type { GasEstimationInput } from '@/ai/flows/gas-estimation-tool';

export async function getGasEstimation(input: GasEstimationInput) {
  try {
    // In a real app, you might add extra validation or logging here
    const result = await estimateGasFeesAndSuggestTime(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Gas estimation failed:', error);
    return { success: false, error: 'Failed to get gas estimation from AI service.' };
  }
}
