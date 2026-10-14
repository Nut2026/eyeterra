import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getLocalToday, setLocalToday } from '@/lib/storage';
import { beepComplete } from '@/lib/audio';

export type TimerPhase = 'idle' | 'work' | 'rest';

const WORK_SECS = 20 * 60;
const REST_SECS = 20;
const DEFAULT_TITLE = 'Eyeterra';

interface TimerContextType {
  phase: TimerPhase;
  secondsLeft: number;
  running: boolean;
  cycles: number;
  handleStartStop: () => void;
  handleReset: () => void;
}

const TimerContext = createContext<TimerContextType>({
  phase: 'idle',
  secondsLeft: WORK_SECS,
  running: false,
  cycles: 0,
  handleStartStop: () => {},
  handleReset: () => {},
});

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cycles, setCycles]       = useState(() => getLocalToday('timer-cycles', 0) as number);
  const [phase, setPhase]         = useState<TimerPhase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECS);
  const [running, setRunning]     = useState(false);

  const phaseStartTimeRef = useRef<number>(0);
  const pausedAtRef       = useRef<number | null>(null);
  const phaseRef          = useRef<TimerPhase>(phase);
  const cyclesRef         = useRef<number>(cycles);
  const runningRef        = useRef<boolean>(false);
  const intervalRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  phaseRef.current  = phase;
  cyclesRef.current = cycles;
  runningRef.current = running;

  const persistCycles = useCallback((n: number) => {
    setCycles(n);
    setLocalToday('timer-cycles', n);
    window.dispatchEvent(new CustomEvent('eyeterra-score-update'));
  }, []);

  const updateTitle = useCallback((p: TimerPhase, secs: number) => {
    if (p === 'idle') {
      document.title = DEFAULT_TITLE;
    } else {
      const m = Math.floor(secs / 60);
      const s = (secs % 60).toString().padStart(2, '0');
      const suffix = p === 'work' ? 'time to focus!' : 'break time!';
      document.title = `${DEFAULT_TITLE} — ${m}:${s}, ${suffix}`;
    }
  }, []);

  useEffect(() => () => { document.title = DEFAULT_TITLE; }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || !runningRef.current) return;
      const phaseSecs = phaseRef.current === 'rest' ? REST_SECS : WORK_SECS;
      const elapsed   = (Date.now() - phaseStartTimeRef.current) / 1000;
      const remaining = Math.max(0, phaseSecs - elapsed);
      updateTitle(phaseRef.current, Math.ceil(remaining));
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [updateTitle]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const phaseSecs = phaseRef.current === 'rest' ? REST_SECS : WORK_SECS;
      const elapsed   = (Date.now() - phaseStartTimeRef.current) / 1000;
      const remaining = Math.max(0, phaseSecs - elapsed);
      const rounded   = Math.ceil(remaining);

      setSecondsLeft(rounded);
      updateTitle(phaseRef.current, rounded);

      if (remaining <= 0) {
        beepComplete();
        if (phaseRef.current === 'work') {
          setPhase('rest');
          phaseStartTimeRef.current = Date.now();
          setSecondsLeft(REST_SECS);
          updateTitle('rest', REST_SECS);
        } else {
          const next = cyclesRef.current + 1;
          persistCycles(next);
          setPhase('work');
          phaseStartTimeRef.current = Date.now();
          setSecondsLeft(WORK_SECS);
          updateTitle('work', WORK_SECS);
        }
      }
    }, 250); // 250 ms for smooth display without hammering

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, persistCycles, updateTitle]);

  const handleStartStop = useCallback(() => {
    setRunning(r => {
      const nowRunning = !r;
      if (nowRunning) {
        if (phaseRef.current === 'idle') {
          setPhase('work');
          setSecondsLeft(WORK_SECS);
          phaseStartTimeRef.current = Date.now();
        } else if (pausedAtRef.current !== null) {
          phaseStartTimeRef.current += Date.now() - pausedAtRef.current;
          pausedAtRef.current = null;
        }
      } else {
        pausedAtRef.current = Date.now();
      }
      return nowRunning;
    });
  }, []);

  const handleReset = useCallback(() => {
    setRunning(false);
    setPhase('idle');
    setSecondsLeft(WORK_SECS);
    pausedAtRef.current = null;
    document.title = DEFAULT_TITLE;
  }, []);

  return (
    <TimerContext.Provider value={{ phase, secondsLeft, running, cycles, handleStartStop, handleReset }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
