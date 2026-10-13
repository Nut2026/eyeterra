import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { stops } from '@/lib/visionFair';
import type { VFResult } from '@/lib/visionFair';
import SnellenStop from '@/components/visionfair/SnellenStop';
import AmslerStop from '@/components/visionfair/AmslerStop';
import PupilStop from '@/components/visionfair/PupilStop';
import MotilityStop from '@/components/visionfair/MotilityStop';
import SymptomStop from '@/components/visionfair/SymptomStop';
import FinalReport from '@/components/visionfair/FinalReport';

const TEST_STOPS = stops.filter(s => s.id <= 5);
const TOTAL_TEST_STOPS = TEST_STOPS.length; // 5
const REPORT_STOP = TOTAL_TEST_STOPS + 1;   // 6 — sentinel for the report screen
const STORAGE_KEY = 'eyeterra_vision_tour_progress';

interface PersistedProgress {
  lastStop: number;
  results: VFResult[];
  rawAnswers: Record<number, string>;
}

function loadProgress(): PersistedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedProgress;
    if (typeof parsed.lastStop !== 'number' || parsed.lastStop < 1 || parsed.lastStop > TOTAL_TEST_STOPS) return null;
    if (!Array.isArray(parsed.results)) return null;
    return parsed;
  } catch { return null; }
}

function saveProgress(lastStop: number, results: VFResult[], rawAnswers: Record<number, string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastStop, results, rawAnswers })); } catch { /* ignore */ }
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

// currentStop: 0 = intro, 1–6 = active stops, 7 = final report
const VisionFairPage: React.FC = () => {
  const saved = loadProgress();

  const [currentStop, setCurrentStop] = useState<number>(0);
  const [results, setResults] = useState<VFResult[]>(saved?.results ?? []);
  const [rawAnswers, setRawAnswers] = useState<Record<number, string>>(saved?.rawAnswers ?? {});

  const savedLastStop = saved?.lastStop ?? null;
  const hasSavedProgress = savedLastStop !== null;

  // Persist whenever the active stop or answers change
  useEffect(() => {
    if (currentStop >= 1 && currentStop <= TOTAL_TEST_STOPS) {
      saveProgress(currentStop, results, rawAnswers);
    }
  }, [currentStop, results, rawAnswers]);

  const goToStop = useCallback((n: number) => {
    setCurrentStop(Math.max(0, Math.min(n, REPORT_STOP)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResult = useCallback((sid: number) => (
    label: string, value: string, concern: boolean, rawKey?: string
  ) => {
    setResults(prev => [...prev.filter(r => r.stopId !== sid), { stopId: sid, label, value, concern }]);
    if (rawKey !== undefined) setRawAnswers(prev => ({ ...prev, [sid]: rawKey }));
    setCurrentStop(Math.min(sid + 1, REPORT_STOP));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRestart = useCallback(() => {
    clearProgress();
    setResults([]);
    setRawAnswers({});
    setCurrentStop(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentStopInfo = stops.find(s => s.id === currentStop) ?? null;

  // ── Stop content renderer ────────────────────────────────────────────────
  const renderStop = () => {
    const raw = (id: number) => rawAnswers[id];
    switch (currentStop) {
      case 1: return <SnellenStop  key="stop-1" onResult={handleResult(1)} initialValue={raw(1)} />;
      case 2: return <AmslerStop   key="stop-2" onResult={handleResult(2)} initialValue={raw(2)} />;
      case 3: return <PupilStop    key="stop-3" onResult={handleResult(3)} initialValue={raw(3)} />;
      case 4: return <MotilityStop key="stop-4" onResult={handleResult(4)} initialValue={raw(4)} />;
      case 5: return <SymptomStop  key="stop-5" onResult={handleResult(5)} initialValue={raw(5)} />;
      case REPORT_STOP: return <FinalReport results={results} onRestart={handleRestart} />;
      default: return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">

        {/* ── Page header ─────────────────────────────────────── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 border-2 border-border px-3 py-1 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vision Tour</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance mb-2">
            Your Personal Vision Tour
          </h1>
          <p className="text-muted-foreground max-w-prose text-pretty">
            Five interactive stops covering key aspects of eye health. Not a clinical exam — but a meaningful first look.
          </p>
        </div>

        {/* ── Progress bar (active stops only) ────────────────── */}
        {currentStop >= 1 && currentStop <= TOTAL_TEST_STOPS && currentStopInfo && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                Stop {currentStop} of {TOTAL_TEST_STOPS}: {currentStopInfo.name}
              </span>
              <span className="text-sm text-muted-foreground">{results.length} completed</span>
            </div>
            <div className="w-full h-2 bg-muted border border-border"
              role="progressbar" aria-valuenow={results.length}
              aria-valuemax={TOTAL_TEST_STOPS} aria-valuemin={0}>
              <div className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(results.length / TOTAL_TEST_STOPS) * 100}%` }} />
            </div>
          </div>
        )}

        {/* ── Stop nav chips ───────────────────────────────────── */}
        <div className="flex gap-2 mb-6 flex-wrap" role="navigation" aria-label="Vision Tour stops">
          {TEST_STOPS.map(stop => {
            const hasResult = results.some(r => r.stopId === stop.id);
            const isCurrent = currentStop === stop.id;
            const isDone = hasResult || (currentStop > stop.id && currentStop >= 1);
            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => goToStop(stop.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 border-2 text-xs font-semibold transition-colors ${
                  isCurrent  ? 'border-primary bg-primary text-primary-foreground'
                  : isDone   ? 'border-primary/50 bg-primary/10 text-primary'
                  :            'border-border text-muted-foreground hover:border-primary/50'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Stop ${stop.id}: ${stop.name}`}
              >
                <span aria-hidden="true">{isDone && !isCurrent ? '✓' : stop.icon}</span>
                <span className="hidden sm:inline">{stop.name}</span>
                <span className="sm:hidden">{stop.id}</span>
              </button>
            );
          })}
          {currentStop === REPORT_STOP && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-primary bg-primary text-primary-foreground text-xs font-semibold">
              📊 Report
            </span>
          )}
        </div>

        {/* ── INTRO screen (currentStop === 0) ─────────────────── */}
        {currentStop === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEST_STOPS.map(stop => (
                <div key={stop.id} className="border-2 border-border p-4 bg-card flex items-start gap-3">
                  <span className="text-2xl shrink-0" aria-hidden="true">{stop.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm text-balance">Stop {stop.id}: {stop.name}</p>
                    <p className="text-xs text-muted-foreground">{stop.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-2 border-border bg-muted/30 px-4 py-3">
              <p className="text-sm text-muted-foreground text-pretty">Takes ~5–10 minutes. Your progress is saved automatically — you can pick up where you left off.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {hasSavedProgress ? (
                <>
                  <button
                    type="button"
                    onClick={() => goToStop(savedLastStop!)}
                    className="bg-primary text-primary-foreground border-2 border-primary px-8 py-3 font-bold text-base hover:bg-primary/90 transition-colors"
                  >
                    Continue Vision Tour → (Stop {savedLastStop})
                  </button>
                  <button
                    type="button"
                    onClick={() => { clearProgress(); setResults([]); setRawAnswers({}); goToStop(1); }}
                    className="bg-background text-foreground border-2 border-border px-6 py-3 font-semibold text-sm hover:border-primary transition-colors"
                  >
                    Start Over
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => goToStop(1)}
                  className="bg-primary text-primary-foreground border-2 border-primary px-8 py-3 font-bold text-base hover:bg-primary/90 transition-colors"
                >
                  Begin Vision Tour →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Active stop content (stops 1–7) ──────────────────── */}
        {currentStop >= 1 && (
          <div className="border-2 border-border bg-background p-5 md:p-8">
            {currentStop <= TOTAL_TEST_STOPS && currentStopInfo && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl" aria-hidden="true">{currentStopInfo.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-foreground text-balance">
                    Stop {currentStop}: {currentStopInfo.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{currentStopInfo.subtitle}</p>
                </div>
              </div>
            )}
            {renderStop()}
          </div>
        )}

        {/* ── Prev / Skip / Finish nav ─────────────────────────── */}
        {currentStop >= 1 && currentStop <= TOTAL_TEST_STOPS && (
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => goToStop(currentStop - 1)}
              className="text-sm text-muted-foreground hover:text-foreground border-2 border-border px-3 py-1.5 transition-colors"
            >
              ← {currentStop === 1 ? 'Back to Intro' : 'Previous Stop'}
            </button>
            {currentStop < TOTAL_TEST_STOPS ? (
              <button
                type="button"
                onClick={() => goToStop(currentStop + 1)}
                className="text-sm text-muted-foreground hover:text-foreground border-2 border-border px-3 py-1.5 ml-auto transition-colors"
              >
                Skip →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToStop(REPORT_STOP)}
                className="text-sm text-primary-foreground bg-primary hover:bg-primary/90 border-2 border-primary px-4 py-1.5 ml-auto font-semibold transition-colors"
              >
                Skip &amp; See Report →
              </button>
            )}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default VisionFairPage;
