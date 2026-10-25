import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { NeonmapProvider } from '@/contexts/NeonmapContext';
import { TimerProvider } from '@/contexts/TimerContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const HomePage = lazy(() => import('@/pages/HomePage'));
const DailyHabitsPage = lazy(() => import('@/pages/DailyHabitsPage'));
const AwarenessPage = lazy(() => import('@/pages/AwarenessPage'));
const VisionTourPage = lazy(() => import('@/pages/VisionFairPage'));
const FindCarePage = lazy(() => import('@/pages/FindCarePage'));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const APP_TOP = 0;

const App: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const doc = document.documentElement;
      doc.scrollTop = APP_TOP;
      doc.scrollLeft = APP_TOP;
      window.scrollTo({ top: APP_TOP, left: APP_TOP, behavior: 'instant' });
      window.scrollTo(APP_TOP, APP_TOP);
    }
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <AccessibilityProvider>
          <NeonmapProvider>
            <TimerProvider>
              <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
                <Route path="/daily-habits" element={<ErrorBoundary><DailyHabitsPage /></ErrorBoundary>} />
                <Route path="/awareness" element={<ErrorBoundary><AwarenessPage /></ErrorBoundary>} />
                <Route path="/vision-tour" element={<ErrorBoundary><VisionTourPage /></ErrorBoundary>} />
                {/* Legacy redirects */}
                <Route path="/vision-fair" element={<Navigate to="/vision-tour" replace />} />
                <Route path="/vision-fair/stop-:stopId" element={<Navigate to="/vision-tour" replace />} />
                <Route path="/vision-fair/report" element={<Navigate to="/vision-tour" replace />} />
                <Route path="/vision-tour/stop-:stopId" element={<Navigate to="/vision-tour" replace />} />
                <Route path="/vision-tour/report" element={<Navigate to="/vision-tour" replace />} />
                <Route path="/find-eye-care" element={<ErrorBoundary><FindCarePage /></ErrorBoundary>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            </TimerProvider>
          </NeonmapProvider>
        </AccessibilityProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
