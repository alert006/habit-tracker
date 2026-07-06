import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import type { AchievementProgress } from '@/types/achievement';
import { cn } from '@/utils/cn';
import { format, parseISO } from 'date-fns';

const tierStyles: Record<AchievementProgress['tier'], { bg: string; text: string; ring: string }> = {
  bronze: { bg: 'bg-[#CD7F4A]/15', text: 'text-[#CD7F4A]', ring: 'ring-[#CD7F4A]/40' },
  silver: { bg: 'bg-[#9CA3AF]/15', text: 'text-[#8B93A1]', ring: 'ring-[#9CA3AF]/40' },
  gold: { bg: 'bg-amber-400/15', text: 'text-amber-500', ring: 'ring-amber-400/40' },
  platinum: { bg: 'bg-moss-500/15', text: 'text-moss-600', ring: 'ring-moss-500/40' },
};

export function AchievementBadge({ achievement }: { achievement: AchievementProgress }) {
  const styles = tierStyles[achievement.tier];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl2 border p-4 text-center transition-colors',
        achievement.unlocked
          ? 'border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft shadow-soft'
          : 'border-dashed border-ink/10 dark:border-paper/10 opacity-60'
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full ring-2',
          achievement.unlocked ? styles.bg : 'bg-ink/5 dark:bg-paper/5',
          achievement.unlocked ? styles.ring : 'ring-ink/10 dark:ring-paper/10'
        )}
      >
        {achievement.unlocked ? (
          <DynamicIcon name={achievement.icon} className={cn('h-6 w-6', styles.text)} />
        ) : (
          <Lock className="h-5 w-5 text-ink/30 dark:text-paper/30" />
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-ink dark:text-paper">{achievement.title}</p>
        <p className="mt-0.5 text-xs text-ink/50 dark:text-paper/50">{achievement.description}</p>
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="mt-1 text-[11px] text-moss-600 dark:text-moss-300">
            Unlocked {format(parseISO(achievement.unlockedAt), 'MMM d, yyyy')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
