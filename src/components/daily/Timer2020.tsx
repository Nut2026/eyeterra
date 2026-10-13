import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTimer } from '@/contexts/TimerContext';

const WORK_SECS = 20 * 60;
const REST_SECS = 20;

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 30 30"
    preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <g transform="matrix(1.4974 0 0 1.4974 -7.46 -7.46)">
      <circle cx="15" cy="15" r="6.177" style={{ fill: 'none', fillOpacity: 0, stroke: '#000', strokeWidth: 1, strokeOpacity: 1 }} />
      <g transform="translate(0 .713)">
        <path d="M15 14.997v2.801" style={{ fill: 'none', stroke: '#000', strokeWidth: 1.33565, strokeOpacity: 1 }} />
        <circle cx="15" cy="11.669" r=".535" style={{ fill: '#000', stroke: '#000', strokeWidth: 1 }} />
      </g>
    </g>
  </svg>
);
const PlayIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>);
const PauseIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>);
const ResetIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>);

const Timer2020: React.FC = () => {
  const { phase, secondsLeft, running, cycles, handleStartStop, handleReset } = useTimer();
  const [infoOpen, setInfoOpen] = useState(false);

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');
  const total = phase === 'rest' ? REST_SECS : WORK_SECS;
  const progress = ((total - secondsLeft) / total) * 100;

  return (
    <div className="bg-background border-2 border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-foreground">20-20-20 Timer</h3>
        <Button variant="ghost" size="icon" onClick={() => setInfoOpen(true)} aria-label="Info about 20-20-20 rule">
          <InfoIcon />
        </Button>
      </div>

      <div className="w-full h-2 bg-muted mb-4 border border-border">
        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} aria-hidden="true" />
      </div>

      <p className="text-sm text-muted-foreground mb-1 font-medium">
        {phase === 'idle' ? 'Ready — press Start' : phase === 'work' ? 'Screen time — look away when timer ends' : 'Look 20 feet away!'}
      </p>

      <div className={`text-5xl font-bold tabular-nums mb-5 ${phase === 'rest' ? 'text-primary' : 'text-foreground'}`}
        aria-live="polite" aria-label={`${mins} minutes ${secs} seconds remaining`}>
        {mins}:{secs}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={handleStartStop} className="gap-2 border-2 border-primary">
          {running ? <PauseIcon /> : <PlayIcon />}
          {running ? 'Pause' : 'Start'}
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2 border-2 border-border">
          <ResetIcon />
          Reset
        </Button>
        <div className="ml-auto text-sm text-muted-foreground font-medium">
          Cycles today: <span className="text-foreground font-bold">{cycles}</span>
        </div>
      </div>

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg border-2 border-border">
          <DialogHeader>
            <DialogTitle>The 20-20-20 Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">Benefit</p>
              <p>Prevents digital eye strain, resets focus, and reminds you to blink.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Fun Fact</p>
              <p>Looking at something 20 feet away fully relaxes the ciliary muscle — the tiny muscle inside your eye that gets locked up during close work.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Did you know?</p>
              <p>{"The 20-20-20 rule was coined by California optometrist Dr. Jeffrey Anshel in the 1990s. It's still the most recommended digital eye strain prevention technique — completely free, and quick!"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timer2020;
