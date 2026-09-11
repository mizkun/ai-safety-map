'use client';
import { useEffect, useState } from 'react';
import { currentReviewDay } from '@/lib/freshness.mjs';

export function useReviewDay(initialDay: string) {
  const [today, setToday] = useState(initialDay);
  useEffect(() => {
    const update = () => setToday(currentReviewDay());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return today;
}
