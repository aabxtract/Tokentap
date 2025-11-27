'use client';

import { Leaderboard } from '@/components/leaderboard';
import { TokenTapLogo } from '@/components/icons';
import ParticleBackground from '@/components/particle-background';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <>
      <ParticleBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Button asChild variant="ghost">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Claim
                </Link>
            </Button>
            <div className="flex flex-col items-center text-center">
              <TokenTapLogo className="h-12 w-12 mb-2" />
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-primary/80">
                Leaderboard
              </h1>
            </div>
            <div className="w-24"></div>
          </div>

          <Leaderboard />
        </div>
      </main>
    </>
  );
}
