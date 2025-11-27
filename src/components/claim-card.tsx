'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TOKEN_CLAIM_AMOUNT, TOKEN_SYMBOL, COOLDOWN_HOURS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Loader2, Wallet, Clock, Droplet } from 'lucide-react';
import { GasEstimator } from './gas-estimator';
import { formatDistanceToNowStrict } from 'date-fns';

type ClaimCardProps = {
  isConnected: boolean;
  isClaiming: boolean;
  cooldownEndTime: number | null;
  walletAddress: string;
  tokenBalance: number;
  lastClaimTime: string | null;
  onConnectWallet: () => void;
  onClaim: () => void;
};

const CooldownTimer = ({ endTime }: { endTime: number }) => {
    const [remaining, setRemaining] = useState(endTime - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const newRemaining = endTime - Date.now();
            if (newRemaining <= 0) {
                clearInterval(interval);
                setRemaining(0);
            } else {
                setRemaining(newRemaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    const total = COOLDOWN_HOURS * 3600 * 1000;
    const progress = Math.max(0, (remaining / total) * 100);
    
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="stroke-current text-primary/10"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="42"
                        fill="transparent"
                    />
                    <circle
                        className="stroke-current text-primary transition-all duration-1000 ease-linear"
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="42"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={(2 * Math.PI * 42) * (1 - progress / 100)}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold font-mono">
                        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                </div>
            </div>
            <p className="text-center text-foreground/70">You can claim again soon.</p>
        </div>
    );
};


export const ClaimCard = ({
  isConnected,
  isClaiming,
  cooldownEndTime,
  walletAddress,
  tokenBalance,
  lastClaimTime,
  onConnectWallet,
  onClaim,
}: ClaimCardProps) => {

  const canClaim = cooldownEndTime ? Date.now() > cooldownEndTime : true;

  return (
    <Card className="glassmorphism w-full max-w-md rounded-2xl">
      <CardContent className="p-6 md:p-8">
        {!isConnected ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold">Get Started</h2>
            <p className="text-foreground/70">Connect your wallet to claim your free tokens.</p>
            <Button onClick={onConnectWallet} size="lg" className="w-full mt-4 rounded-full font-bold text-lg shadow-glow-primary hover:shadow-glow-accent transition-all duration-300">
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 border border-white/10 rounded-lg p-4 bg-black/20">
              <div className="flex justify-between items-center text-sm text-foreground/70">
                <span>Wallet Connected</span>
                <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_theme(colors.green.400)]"></div>
              </div>
              <p className="font-mono text-base truncate">{walletAddress}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border border-white/10 rounded-lg p-3 bg-black/20">
                    <p className="text-sm text-foreground/70">Your Balance</p>
                    <p className="text-lg font-bold">{tokenBalance.toLocaleString()} {TOKEN_SYMBOL}</p>
                </div>
                <div className="border border-white/10 rounded-lg p-3 bg-black/20">
                    <p className="text-sm text-foreground/70">Last Claim</p>
                    <p className="text-lg font-bold">
                        {lastClaimTime ? formatDistanceToNowStrict(new Date(lastClaimTime), { addSuffix: true }) : 'Never'}
                    </p>
                </div>
            </div>

            {canClaim ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="text-center">
                        <p className="text-foreground/80">You will receive</p>
                        <p className="text-3xl font-bold text-primary drop-shadow-[0_0_4px_hsl(var(--primary))]">
                            {TOKEN_CLAIM_AMOUNT} {TOKEN_SYMBOL}
                        </p>
                    </div>
                    <GasEstimator walletAddress={walletAddress} tokenSymbol={TOKEN_SYMBOL} />
                    <Button onClick={onClaim} disabled={isClaiming} size="lg" className={cn(
                        "w-full mt-4 rounded-full font-bold text-xl py-8 transition-all duration-300",
                        !isClaiming && 'animate-pulse-glow'
                    )}>
                        {isClaiming ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <>
                            <Droplet className="mr-3 h-6 w-6" />
                            Claim Now
                            </>
                        )}
                    </Button>
                </div>
            ) : (
                <CooldownTimer endTime={cooldownEndTime!} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
