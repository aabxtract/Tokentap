'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGasEstimation } from '@/app/actions';
import type { GasEstimationOutput } from '@/ai/flows/gas-estimation-tool';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, TrendingUp, Clock, BrainCircuit } from 'lucide-react';
import { LightningBolt } from './icons';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  currentGasPrice: z.coerce.number().min(1, 'Gas price must be at least 1 Gwei.'),
  networkLoad: z.enum(['Low', 'Medium', 'High']),
});

type GasEstimatorProps = {
  walletAddress: string;
  tokenSymbol: string;
};

export function GasEstimator({ walletAddress, tokenSymbol }: GasEstimatorProps) {
  const [estimation, setEstimation] = useState<GasEstimationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentGasPrice: 20,
      networkLoad: 'Medium',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setEstimation(null);
    try {
      const result = await getGasEstimation({
        ...values,
        userWalletAddress: walletAddress,
        tokenSymbol: tokenSymbol,
      });

      if (result.success && result.data) {
        setEstimation(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Estimation Error',
          description: result.error || 'Could not fetch gas estimation.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="text-sm text-foreground/70 hover:no-underline hover:text-primary transition-colors justify-center">
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            AI Gas Fee Estimator
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <Card className="bg-transparent border-white/10 shadow-inner">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2"><LightningBolt className="w-4 h-4 text-accent" />Smart Gas Insights</CardTitle>
                    <CardDescription className="text-xs">Get a 24-hour gas fee forecast.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="currentGasPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Current Gas (Gwei)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} className="bg-background/50 h-9" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="networkLoad"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Network Load</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background/50 h-9">
                                            <SelectValue placeholder="Select load" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full h-9 bg-accent/80 hover:bg-accent text-accent-foreground">
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Forecast'}
                        </Button>
                      </form>
                    </Form>
                    {estimation && (
                      <div className="mt-4 text-sm border-t border-white/10 pt-4 space-y-3">
                        <div className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-foreground/70 mt-0.5" />
                            <div><span className="font-semibold text-foreground/70">Est. Fee Now:</span> {estimation.estimatedGasFee.toFixed(6)} ETH</div>
                        </div>
                        <div className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-foreground/70 mt-0.5" />
                            <div><span className="font-semibold text-foreground/70">24h Forecast:</span> {estimation.prediction}</div>
                        </div>
                        <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-primary mt-0.5" />
                            <div className="text-primary"><span className="font-semibold">Optimal Window:</span> {estimation.optimalClaimWindow}</div>
                        </div>
                         <div className="flex items-start gap-2">
                            <BrainCircuit className="h-4 w-4 text-foreground/70 mt-0.5" />
                            <div><span className="font-semibold text-foreground/70">Reasoning:</span> {estimation.reasoning}</div>
                        </div>
                      </div>
                    )}
                </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
