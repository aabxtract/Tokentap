'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  TOKEN_CLAIM_AMOUNT,
  TOKEN_SYMBOL,
  APP_NAME,
} from '@/lib/constants';
import { GlowingCheckmark } from './icons';
import Confetti from './confetti';
import { Check, Copy, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

type SuccessModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  txHash: string;
};

export function SuccessModal({
  isOpen,
  onOpenChange,
  txHash,
}: SuccessModalProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    setIsCopied(true);
    toast({
      title: 'Copied!',
      description: 'Transaction hash copied to clipboard.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `I just claimed ${TOKEN_CLAIM_AMOUNT} ${TOKEN_SYMBOL} on ${APP_NAME}! Come get yours!`;
    const hashtags = 'TokenTap,Crypto,Airdrop';
    const url = 'https://tokentap.com'; // Replace with actual app URL if available
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${hashtags}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphism sm:max-w-md rounded-2xl">
        {isOpen && <Confetti />}
        <DialogHeader className="items-center text-center">
          <GlowingCheckmark className="h-16 w-16 my-4" />
          <DialogTitle className="text-2xl font-bold">
            Claim Successful!
          </DialogTitle>
          <DialogDescription className="text-lg text-foreground/80">
            You received {TOKEN_CLAIM_AMOUNT} {TOKEN_SYMBOL} tokens.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          <div className="text-sm text-foreground/70">Transaction Hash:</div>
          <div className="relative">
            <p className="font-mono text-xs p-3 pr-10 border border-white/10 rounded-lg bg-black/20 break-all">
              {txHash}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
              onClick={handleCopy}
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button
            onClick={handleShare}
            className="w-full font-bold bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Share on X
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full font-bold"
          >
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
