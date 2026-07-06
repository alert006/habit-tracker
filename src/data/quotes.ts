export const MOTIVATIONAL_QUOTES: string[] = [
  "You don't have to be great to start, but you have to start to be great.",
  'Small daily improvements lead to staggering long-term results.',
  "Discipline is choosing between what you want now and what you want most.",
  'Motivation gets you going, but habit is what keeps you going.',
  'Every action you take is a vote for the type of person you wish to become.',
  "Success is the sum of small efforts, repeated day in and day out.",
  "You are what you repeatedly do. Excellence isn't an act, it's a habit.",
  'The chains of habit are too weak to be felt until they are too strong to be broken.',
  'Progress, not perfection.',
  'One day or day one — you decide.',
  'Consistency is what transforms average into excellence.',
  'A year from now, you will wish you had started today.',
];

/** Deterministic "quote of the day" so it stays stable within a single day. */
export const getQuoteOfTheDay = (date: Date = new Date()): string => {
  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
  const index = dayIndex % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
};
