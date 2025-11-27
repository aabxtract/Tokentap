'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { useAuth } from '../';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged(
      (authedUser: User | null) => {
        setUser(authedUser);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return user;
}
