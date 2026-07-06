import type { AchievementProgress } from '@/types/achievement';
import { AchievementBadge } from './AchievementBadge';

export function AchievementGrid({ achievements }: { achievements: AchievementProgress[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {achievements.map((achievement) => (
        <AchievementBadge key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}
