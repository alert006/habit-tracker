import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { AchievementGrid } from '@/components/achievements/AchievementGrid';
import { Confetti } from '@/components/ui/Confetti';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useHabits } from '@/contexts/HabitContext';

export function Achievements() {
  const { achievements, newlyUnlocked, clearNewlyUnlocked } = useHabits();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (newlyUnlocked.length === 0) return;
    setShowConfetti(true);
    newlyUnlocked.forEach((achievement) => {
      toast.success(`Achievement unlocked: ${achievement.title}`, { icon: '🏆' });
    });
    
  }, [newlyUnlocked]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <>
      <Header title="Achievements" subtitle="Milestones you've earned along the way." />
      <main className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
        <section className="mb-6 flex items-center gap-4 rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-4 shadow-soft lg:p-5">
          <ProgressRing progress={progressPercent} size={64} color="#E8A33D" />
          <div>
            <p className="text-base font-semibold text-ink dark:text-paper">
              {unlockedCount} of {achievements.length} unlocked
            </p>
            <p className="text-sm text-ink/50 dark:text-paper/50">
              Keep showing up — every streak adds another badge.
            </p>
          </div>
        </section>

        <AchievementGrid achievements={achievements} />
      </main>

      <Confetti
        active={showConfetti}
        onDone={() => {
          setShowConfetti(false);
          clearNewlyUnlocked();
        }}
      />
    </>
  );
}
