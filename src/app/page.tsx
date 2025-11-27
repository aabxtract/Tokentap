'use client';

import { useState, useEffect } from 'react';
import { ClaimCard } from '@/components/claim-card';
import { TokenTapLogo } from '@/components/icons';
import { SuccessModal } from '@/components/success-modal';
import ParticleBackground from '@/components/particle-background';
import { TOKEN_CLAIM_AMOUNT, TOKEN_SYMBOL, COOLDOWN_SECONDS, APP_NAME } from '@/lib/constants';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);
  const [lastClaimTime, setLastClaimTime] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState('0x...1234');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [txHash, setTxHash] = useState('');

  const handleConnectWallet = () => {
    setIsConnected(true);
    // In a real app, you'd use a library like ethers.js or viem
    // to connect and get wallet details.
    setWalletAddress('0xBEEF...dEAD');
    setTokenBalance(120);
  };

  const handleClaim = () => {
    if (cooldownEndTime && Date.now() < cooldownEndTime) return;

    setIsClaiming(true);
    // Simulate API call for claiming tokens
    setTimeout(() => {
      const newBalance = tokenBalance + TOKEN_CLAIM_AMOUNT;
      setTokenBalance(newBalance);
      
      const now = new Date();
      setLastClaimTime(now.toISOString());

      const endTime = Date.now() + COOLDOWN_SECONDS * 1000;
      setCooldownEndTime(endTime);
      
      setTxHash(`0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`);

      setIsClaiming(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  useEffect(() => {
    // Persist cooldown in localStorage to survive page reloads
    const storedCooldownEnd = localStorage.getItem('cooldownEndTime');
    if (storedCooldownEnd) {
      const endTime = parseInt(storedCooldownEnd, 10);
      if (Date.now() < endTime) {
        setCooldownEndTime(endTime);
      } else {
        localStorage.removeItem('cooldownEndTime');
      }
    }
  }, []);

  useEffect(() => {
    if (cooldownEndTime) {
      localStorage.setItem('cooldownEndTime', cooldownEndTime.toString());
    }
  }, [cooldownEndTime]);


  return (
    <>
      <ParticleBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <TokenTapLogo className="h-16 w-16 mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-primary/80">
            {APP_NAME}
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mt-2 max-w-md">
            Claim Your Free {TOKEN_SYMBOL} Tokens
          </p>
        </div>

        <ClaimCard
          isConnected={isConnected}
          isClaiming={isClaiming}
          cooldownEndTime={cooldownEndTime}
          walletAddress={walletAddress}
          tokenBalance={tokenBalance}
          lastClaimTime={lastClaimTime}
          onConnectWallet={handleConnectWallet}
          onClaim={handleClaim}
        />

        <SuccessModal
          isOpen={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          txHash={txHash}
        />
        
        <footer className="absolute bottom-4 text-center text-sm text-foreground/50">
          <p>A futuristic, frictionless portal where you collect digital energy with a single tap.</p>
        </footer>
      </main>
    </>
  );
}
