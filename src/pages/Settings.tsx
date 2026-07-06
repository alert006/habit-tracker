import { useRef, useState, type ReactNode, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { Download, Upload, Trash2, Moon, Sun, Leaf } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useTheme } from '@/contexts/ThemeContext';
import { useHabits } from '@/contexts/HabitContext';
import { buildExportPayload, downloadExportFile, parseImportFile, readFileAsText } from '@/utils/exportImport';

function SettingsCard({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-xl2 border border-ink/10 dark:border-paper/10 bg-white dark:bg-charcoal-soft p-5 shadow-soft">
      {children}
    </section>
  );
}

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { habits, unlockedAchievements, replaceAllData } = useHabits();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetOpen, setResetOpen] = useState(false);

  const handleExport = () => {
    const payload = buildExportPayload(habits, unlockedAchievements);
    downloadExportFile(payload);
    toast.success('Backup downloaded');
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const raw = await readFileAsText(file);
      const result = parseImportFile(raw);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      replaceAllData(result.data);
    } catch {
      toast.error('Something went wrong reading that file.');
    }
  };

  const handleReset = () => {
    replaceAllData({ version: 1, exportedAt: new Date().toISOString(), habits: [], unlockedAchievements: [] });
    setResetOpen(false);
    toast.success('All data cleared');
  };

  return (
    <>
      <Header title="Settings" subtitle="Manage your data and preferences." />
      <main className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <SettingsCard>
            <h2 className="mb-3 font-display text-base font-semibold text-ink dark:text-paper">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink dark:text-paper">Dark mode</p>
                <p className="text-sm text-ink/50 dark:text-paper/50">
                  Switch between light and dark themes.
                </p>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </Button>
            </div>
          </SettingsCard>

          <SettingsCard>
            <h2 className="mb-3 font-display text-base font-semibold text-ink dark:text-paper">Your data</h2>
            <p className="mb-4 text-sm text-ink/50 dark:text-paper/50">
              Everything is stored locally on this device. Export a backup to keep it safe, or move it to
              another browser.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export JSON
              </Button>
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="h-4 w-4" /> Import JSON
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleFileSelected}
                aria-label="Import backup file"
              />
            </div>
          </SettingsCard>

          <SettingsCard>
            <h2 className="mb-3 font-display text-base font-semibold text-ink dark:text-paper">Danger zone</h2>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-ink/50 dark:text-paper/50">
                Permanently delete every habit, completion and achievement on this device.
              </p>
              <Button variant="danger" onClick={() => setResetOpen(true)}>
                <Trash2 className="h-4 w-4" /> Reset
              </Button>
            </div>
          </SettingsCard>

          <SettingsCard>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-600 text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-paper">Sprout v1.0.0</p>
                <p className="text-sm text-ink/50 dark:text-paper/50">
                  Built with React, TypeScript and Tailwind CSS. Works fully offline.
                </p>
              </div>
            </div>
          </SettingsCard>
        </div>
      </main>

      <ConfirmDialog
        isOpen={isResetOpen}
        title="Reset all data?"
        description="This deletes every habit, completion and achievement on this device. This cannot be undone."
        confirmLabel="Delete everything"
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </>
  );
}
