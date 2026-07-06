import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { HabitProvider } from '@/contexts/HabitContext';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Habits } from '@/pages/Habits';
import { CalendarPage } from '@/pages/Calendar';
import { Statistics } from '@/pages/Statistics';
import { Achievements } from '@/pages/Achievements';
import { Settings } from '@/pages/Settings';
import { NotFound } from '@/pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <HabitProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#1C1B18',
              color: '#FAF9F5',
              fontSize: '14px',
            },
          }}
        />
      </HabitProvider>
    </ThemeProvider>
  );
}
