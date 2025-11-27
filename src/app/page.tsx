'use client';

import { useState, useEffect } from 'react';
import { ClaimCard } from '@/components/claim-card';
import { TokenTapLogo } from '@/components/icons';
import { SuccessModal } from '@/components/success-modal';
import ParticleBackground from '@/components/particle-background';
import { TOKEN_CLAIM_AMOUNT, TOKEN_SYMBOL, COOLDOWN_SECONDS, APP_NAME } from '@/lib/constants';
import { useAuth, useUser, useDoc, useFirestore, useFirebaseApp } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const auth = useAuth();
  const user = useUser();
  const firestore = useFirestore();
  const app = useFirebaseApp();

  const userDocRef = firestore && user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, loading: userProfileLoading } = useDoc(userDocRef);
  
  const [isClaiming, setIsClaiming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleConnectWallet = async () => {
    if (auth) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const signedInUser = result.user;

        if (firestore && signedInUser) {
            const userDocRef = doc(firestore, 'users', signedInUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    displayName: signedInUser.displayName,
                    email: signedInUser.email,
                    photoURL: signedInUser.photoURL,
                    totalTokens: 0,
                    cooldownEndTime: 0,
                    lastClaimTime: null,
                });
            }
        }
      } catch (error) {
        console.error("Authentication failed", error);
      }
    }
  };
  
  const handleClaim = async () => {
    if (!user || !firestore || !userDocRef) return;
    if (userProfile?.cooldownEndTime && Date.now() < userProfile.cooldownEndTime) return;

    setIsClaiming(true);
    // Simulate API call for claiming tokens
    try {
        const newBalance = (userProfile?.totalTokens || 0) + TOKEN_CLAIM_AMOUNT;
        const now = new Date();
        const endTime = Date.now() + COOLDOWN_SECONDS * 1000;
        const newTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

        await updateDoc(userDocRef, {
            totalTokens: newBalance,
            lastClaimTime: now.toISOString(),
            cooldownEndTime: endTime,
        });

        setTxHash(newTxHash);
        setShowSuccessModal(true);

    } catch (error) {
        console.error("Failed to claim tokens", error);
    } finally {
        setIsClaiming(false);
    }
  };

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
          isConnected={!!user}
          isClaiming={isClaiming}
          cooldownEndTime={userProfile?.cooldownEndTime || null}
          walletAddress={user?.displayName || ''}
          tokenBalance={userProfile?.totalTokens || 0}
          lastClaimTime={userProfile?.lastClaimTime || null}
          onConnectWallet={handleConnectWallet}
          onClaim={handleClaim}
          userProfile={userProfile}
          isProfileLoading={userProfileLoading}
        />

        <SuccessModal
          isOpen={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          txHash={txHash}
        />
        
        <footer className="absolute bottom-4 text-center text-sm text-foreground/50 flex flex-col gap-2">
            <Button asChild variant="link" className="text-foreground/50">
                <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
            <p>A futuristic, frictionless portal where you collect digital energy with a single tap.</p>
        </footer>
      </main>
    </>
  );
}
