import { Quote } from 'lucide-react';
import { getQuoteOfTheDay } from '@/data/quotes';

export function MotivationCard() {
  const quote = getQuoteOfTheDay();

  return (
    <div className="relative overflow-hidden rounded-xl2 bg-moss-600 p-5 text-white shadow-soft">
      <Quote className="absolute -right-2 -top-2 h-20 w-20 text-white/10" aria-hidden="true" />
      <p className="relative text-sm font-medium uppercase tracking-wide text-moss-100">
        Today's motivation
      </p>
      <p className="relative mt-2 max-w-xl font-display text-lg leading-snug">{quote}</p>
    </div>
  );
}
