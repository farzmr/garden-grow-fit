export const INSPIRATIONAL_QUOTES = [
  "Every seed you plant today blooms in your strength tomorrow.",
  "Small daily habits grow the deepest, strongest roots.",
  "Show up for yourself — your garden is ready to grow.",
  "Breathe, focus, and let your effort unfold naturally.",
  "Growth isn't always fast, but every session counts.",
  "You are cultivating both body and mind today.",
  "Honor your body, trust the process, and enjoy the bloom.",
];

export function getRandomQuote(): string {
  const index = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
  return INSPIRATIONAL_QUOTES[index] ?? INSPIRATIONAL_QUOTES[0]!;
}
