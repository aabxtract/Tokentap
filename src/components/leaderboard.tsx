'use client';

import { useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOKEN_SYMBOL } from '@/lib/constants';

interface UserProfile {
  id: string;
  displayName: string;
  photoURL: string;
  totalTokens: number;
}

const getTrophyColor = (rank: number) => {
    if (rank === 0) return "text-yellow-400";
    if (rank === 1) return "text-gray-400";
    if (rank === 2) return "text-yellow-600";
    return "text-foreground/30";
}

export function Leaderboard() {
  const firestore = useFirestore();
  const leaderboardQuery = firestore ? query(collection(firestore, 'users'), orderBy('totalTokens', 'desc'), limit(10)) : null;
  const { data: users, loading } = useCollection<UserProfile>(leaderboardQuery);

  if (loading) {
    return <div className="text-center">Loading Leaderboard...</div>;
  }

  if (!users || users.length === 0) {
    return <div className="text-center">No users on the leaderboard yet.</div>;
  }

  return (
    <Card className="glassmorphism w-full rounded-2xl p-2 md:p-4">
        <div className="space-y-4">
            {users.map((user, index) => (
                <Card key={user.id} className="flex items-center p-4 bg-card/20 border-white/5">
                    <div className="flex items-center gap-4 w-1/3">
                        <div className={cn("w-8 text-center text-xl font-bold", getTrophyColor(index))}>
                            {index < 3 ? <Trophy className="w-6 h-6 mx-auto" /> : `#${index + 1}`}
                        </div>
                        <Avatar>
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                            <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold truncate">{user.displayName}</p>
                    </div>
                    <div className="flex-1 text-center">
                        {/* Placeholder for future use like badges */}
                    </div>
                    <div className="flex items-center justify-end gap-2 w-1/3 text-lg font-bold text-primary">
                        <span>{user.totalTokens.toLocaleString()}</span>
                        <span>{TOKEN_SYMBOL}</span>
                    </div>
                </Card>
            ))}
        </div>
    </Card>
  );
}
