import { icons, Sparkles, type LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

/** Renders a lucide-react icon by its string name, falling back to Sparkles. */
export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = icons[name as keyof typeof icons] ?? Sparkles;
  return <IconComponent {...props} />;
}
