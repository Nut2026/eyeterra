import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLocalToday, setLocalToday } from '@/lib/storage';
import { beepComplete } from '@/lib/audio';

interface Exercise {
  id: string;
  name: string;
  durationSecs: number;
  icon: string;
  steps: string[];
  benefit: string;
}

const exercises: Exercise[] = [
  {
    id: 'palming',
    name: 'Palming',
    durationSecs: 120,
    icon: '🤲',
    steps: [
      'Rub palms vigorously until warm',
      'Cup them gently over closed eyes',
      'Breathe deeply for 2 minutes',
      'Open eyes slowly when done',
    ],
    benefit: 'Releases tension around eyes, reduces digital eye strain',
  },
  {
    id: 'figure8',
    name: 'Figure-8 Tracing',
    durationSecs: 60,
    icon: '∞',
    steps: [
      'Hold arm at eye level, 2 m away',
      'Trace a large figure-8 with your thumb',
      'Follow your thumb without moving your head',
      'Repeat slowly for 1 minute',
    ],
    benefit: 'Strengthens eye tracking muscles, improves coordination',
  },
  {
    id: 'near-far',
    name: 'Near-Far Focusing',
    durationSecs: 60,
    icon: '🔭',
    steps: [
      'Hold finger 15 cm from face',
      'Focus on finger for 3 seconds',
      'Shift focus to object 6 m away',
      'Hold for 3 seconds — alternate 10 times',
    ],
    benefit: 'Trains accommodative flexibility, reduces focusing fatigue',
  },
  {
    id: 'blink',
    name: 'Conscious Blinking',
    durationSecs: 60,
    icon: '👁',
    steps: [
      'Close eyes gently — do not squeeze',
      'Hold for 2 seconds',
      'Open wide for 2 seconds',
      'Repeat 10 times slowly',
    ],
    benefit: 'Refreshes tear film, prevents dry eye',
  },
  {
    id: 'rolling',
    name: 'Eye Rolling',
    durationSecs: 60,
    icon: '🌀',
    steps: [
      'Sit upright, head still',
      'Roll eyes clockwise in a full circle — 10 times',
      'Pause 10 seconds',
      'Repeat counter-clockwise — 10 times',
    ],
    benefit: 'Stretches extraocular muscles, relieves stiffness',
  },
  {
    id: 'zoom',
    name: 'Convergence Zoom',
    durationSecs: 60,
    icon: '🎯',
    steps: [
      "Hold a pencil at arm's length, look at tip",
      'Slowly bring it toward nose, maintaining focus',
      'Stop when image doubles',
      'Slowly move back — repeat 10 times',
    ],
    benefit: 'Strengthens convergence, helps with screen-related eyestrain',
  },
  {
    id: 'clockface',
    name: 'Clock Face',
    durationSecs: 60,
    icon: '🕐',
    steps: [
      'Imagine a large clock on the wall',
      "Fix gaze on 12 o'clock for 2 seconds",
      'Move to 3, then 6, then 9 — hold each 2 sec',
      'Complete the circuit 5 times each direction',
    ],
    benefit: 'Increases range of motion in all gaze directions',
  },
];

type ExState = 'idle' | 'running';

const EyeExercises: React.FC = () => {
  const [completed, setCompleted] = useState<string[]>(
    () => getLocalToday('eye-exercises', []) as string[]
  );
  const [activeSteps, setActiveSteps] = useState<string | null>(null);
  const [timerState, setTimerState] = useState<Record<string, ExState>>({});
  const [timerLeft, setTimerLeft] = useState<Record<string, number>>({});
  const intervalRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    return () => { Object.values(intervalRefs.current).forEach(clearInterval); };
  }, []);

  const markComplete = (id: string) => {
    beepComplete();
    setCompleted(prev => {
      const next = prev.includes(id) ? prev : [...prev, id];
      setLocalToday('eye-exercises', next);
      window.dispatchEvent(new CustomEvent('eyeterra-score-update'));
      return next;
    });
    setTimerState(s => ({ ...s, [id]: 'idle' }));
    setTimerLeft(l => { const n = { ...l }; delete n[id]; return n; });
    if (intervalRefs.current[id]) {
      clearInterval(intervalRefs.current[id]);
      delete intervalRefs.current[id];
    }
  };

  const startTimer = (id: string, totalSecs: number) => {
    const current = timerLeft[id] ?? totalSecs;
    setTimerState(s => ({ ...s, [id]: 'running' }));
    intervalRefs.current[id] = setInterval(() => {
      setTimerLeft(prev => {
        const remaining = (prev[id] ?? current) - 1;
        if (remaining <= 0) {
          clearInterval(intervalRefs.current[id]);
          delete intervalRefs.current[id];
          markComplete(id);
          return { ...prev, [id]: 0 };
        }
        return { ...prev, [id]: remaining };
      });
    }, 1000);
  };

  const handleStart = (id: string, totalSecs: number) => {
    if (timerLeft[id] === undefined) setTimerLeft(l => ({ ...l, [id]: totalSecs }));
    startTimer(id, totalSecs);
  };

  const handleRestart = (id: string) => {
    clearInterval(intervalRefs.current[id]);
    delete intervalRefs.current[id];
    setTimerState(s => ({ ...s, [id]: 'idle' }));
    setTimerLeft(l => { const n = { ...l }; delete n[id]; return n; });
  };

  const getButton = (ex: Exercise) => {
    if (completed.includes(ex.id)) {
      return (
        <span className="inline-flex items-center h-7 px-2 text-xs border-2 border-primary bg-primary text-primary-foreground opacity-70 select-none cursor-default">
          ✓ Done
        </span>
      );
    }
    const state = timerState[ex.id] ?? 'idle';
    if (state === 'idle') {
      return (
        <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-2 border-primary"
          onClick={() => handleStart(ex.id, ex.durationSecs)}>
          Start
        </Button>
      );
    }
    return (
      <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-2 border-border"
        onClick={() => handleRestart(ex.id)}>
        Restart
      </Button>
    );
  };

  return (
    <div className="bg-background border-2 border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-foreground">7 Eye Exercises</h3>
        <Badge variant="secondary" className="border border-border">
          {completed.length}/7 done
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {exercises.map(ex => {
          const isDone = completed.includes(ex.id);
          const state = timerState[ex.id] ?? 'idle';
          const left = timerLeft[ex.id] ?? ex.durationSecs;
          const progress = ((ex.durationSecs - left) / ex.durationSecs) * 100;
          const mins = Math.floor(left / 60).toString().padStart(2, '0');
          const secs = (left % 60).toString().padStart(2, '0');

          return (
            <div key={ex.id}
              className={`border-2 transition-colors ${isDone ? 'border-primary bg-primary/8 opacity-80' : 'border-border bg-muted/40'}`}>
              <div className="flex items-center gap-3 p-3">
                <span className="text-2xl shrink-0" aria-hidden="true">{ex.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {ex.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{ex.durationSecs >= 120 ? '2 min' : '1 min'}</span>
                  </div>
                  <p className={`text-xs text-pretty mt-0.5 ${isDone ? 'line-through text-muted-foreground/70' : 'text-muted-foreground'}`}>
                    {ex.benefit}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm"
                    className="text-xs text-secondary border border-border h-7 px-2"
                    onClick={() => setActiveSteps(activeSteps === ex.id ? null : ex.id)}
                    aria-expanded={activeSteps === ex.id}>
                    {activeSteps === ex.id ? 'Hide' : 'How'}
                  </Button>
                  {getButton(ex)}
                </div>
              </div>

              {!isDone && state === 'running' && (
                <div className="px-3 pb-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>In progress…</span>
                    <span className="tabular-nums">{mins}:{secs}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted border border-border">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {activeSteps === ex.id && (
                <div id={`exercise-steps-${ex.id}`} className="border-t-2 border-border px-4 py-3 bg-background">
                  <ol className="list-decimal list-inside space-y-1">
                    {ex.steps.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EyeExercises;
