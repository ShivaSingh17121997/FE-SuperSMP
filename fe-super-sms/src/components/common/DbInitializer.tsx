'use client';

import { useEffect } from 'react';
import { seedDatabase } from '@/services/db';

/**
 * Client component that seeds the localStorage database on first load.
 * Must be placed inside root layout.
 */
export default function DbInitializer() {
  useEffect(() => {
    seedDatabase();
  }, []);

  return null;
}
