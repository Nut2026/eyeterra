import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface MotilityProps {
  onResult: (label: string, value: string, concern: boolean, rawKey?: string) => void;
  initialValue?: string; // JSON array of reported issues
}

const DIRECTIONS = [
  { id: 'up', label: 'Up', x: 50, y: 10 },
  { id: 'up-right', label: 'Up-Right', x: 85, y: 10 },
  { id: 'right', label: 'Right', x: 90, y: 50 },
  { id: 'down-right', label: 'Down-Right', x: 85, y: 90 },
  { id: 'down', label: 'Down', x: 50, y: 90 },
  { id: 'down-left', label: 'Down-Left', x: 15, y: 90 },
  { id: 'left', label: 'Left', x: 10, y: 50 },
  { id: 'up-left', label: 'Up-Left', x: 15, y: 10 },
  { id: 'center', label: 'Center', x: 50, y: 50 },
];

const sequence = ['center', 'up', 'up-right', 'right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'center'];

const MotilityStop: React.FC<MotilityProps> = ({ onResult, initialValue }) => {
  const [activeDir, setActiveDir] = useState<string>('center');
  const [visited, setVisited] = useState<Set<string>>(new Set(['center']));
  const [reportedIssues, setReportedIssues] = useState<string[]>(() => {
    try { return initialValue ? JSON.parse(initialValue) : []; } catch { return []; }
  });
  const [phase, setPhase] = useState<'tracking' | 'assess' | 'done'>(initialValue !== undefined ? 'assess' : 'tracking');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const seqRef = useRef(0);

  useEffect(() => {
    if (!autoPlay) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    seqRef.current = 0;
    intervalRef.current = setInterval(() => {
      const dir = sequence[seqRef.current % sequence.length];
      setActiveDir(dir);
      setVisited(prev => new Set([...prev, dir]));
      seqRef.current++;
      if (seqRef.current >= sequence.length) { setAutoPlay(false); setPhase('assess'); }
    }, 700);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoPlay]);

  const toggleIssue = (dir: string) =>
    setReportedIssues(prev => prev.includes(dir) ? prev.filter(d => d !== dir) : [...prev, dir]);

  const handleSubmit = (issues = reportedIssues) => {
    const concern = issues.length > 0;
    const value = concern ? `Difficulty in: ${issues.join(', ')}` : 'Full range of motion — no restrictions noted';
    onResult('Eye Motility', value, concern, JSON.stringify(issues));
  };

  const dot = DIRECTIONS.find(d => d.id === activeDir)!;

  return (
    <div className="space-y-5">
      <div className="border-2 border-primary bg-primary/5 px-4 py-3">
        <p className="text-sm font-semibold text-foreground mb-1">Instructions</p>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Keep your head still — move only your eyes.</li>
          <li>Press <strong>Auto-Play</strong> to watch the dot move through all 9 directions.</li>
          <li>Follow the dot with your eyes as smoothly as possible.</li>
          <li>Note any pain, double vision, or difficulty tracking in a direction.</li>
        </ol>
      </div>

      <div className="relative border-2 border-border bg-background w-full" style={{ paddingBottom: '60%' }} role="region" aria-label="Eye motility tracking area">
        <div className="absolute inset-0">
          {DIRECTIONS.filter(d => d.id !== 'center').map(d => (
            <button key={d.id} onClick={() => { setActiveDir(d.id); setVisited(prev => new Set([...prev, d.id])); }}
              className={`absolute w-8 h-8 border-2 transition-colors text-xs font-bold ${visited.has(d.id) ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted text-muted-foreground'}`}
              style={{ left: `calc(${d.x}% - 16px)`, top: `calc(${d.y}% - 16px)` }}
              aria-label={`Look ${d.label}`}
            >{visited.has(d.id) ? '✓' : '·'}</button>
          ))}
          <div className="absolute w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground transition-all duration-600 pointer-events-none"
            style={{ left: `calc(${dot.x}% - 10px)`, top: `calc(${dot.y}% - 10px)`, boxShadow: '0 0 10px hsl(var(--primary))' }}
            aria-hidden="true"
          />
          <button onClick={() => setActiveDir('center')} className="absolute w-5 h-5 border-2 border-foreground" style={{ left: 'calc(50% - 10px)', top: 'calc(50% - 10px)' }} aria-label="Center" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => { setAutoPlay(true); setVisited(new Set()); seqRef.current = 0; }} disabled={autoPlay} className="border-2 border-primary">
          {autoPlay ? 'Playing…' : 'Auto-Play'}
        </Button>
        <Button variant="outline" className="border-2 border-border" onClick={() => { setPhase('assess'); setAutoPlay(false); }}>
          Skip to Assessment
        </Button>
      </div>

      {phase === 'assess' && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Did you experience any of the following? (Select all that apply)</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'pain', label: 'Pain or discomfort when moving eyes' },
              { id: 'double', label: 'Double vision in any direction' },
              { id: 'blur', label: 'Blurring when looking to extremes' },
              { id: 'jump', label: "Eyes jumped or couldn't track smoothly" },
              { id: 'up-restricted', label: "Couldn't look upward fully" },
              { id: 'side-restricted', label: "Couldn't look to one side fully" },
            ].map(opt => (
              <button key={opt.id} onClick={() => toggleIssue(opt.id)}
                className={`text-left px-3 py-2 border-2 text-xs transition-colors ${reportedIssues.includes(opt.id) ? 'border-primary bg-primary/10 text-foreground font-semibold' : 'border-border text-muted-foreground hover:border-primary'}`}
              >{reportedIssues.includes(opt.id) ? '✓ ' : ''}{opt.label}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => handleSubmit()} className="border-2 border-primary mt-2">Save &amp; Continue</Button>
            {reportedIssues.length === 0 && (                <Button variant="outline" className="border-2 border-border mt-2 ml-2" onClick={() => { setReportedIssues([]); handleSubmit([]); }}>
                Nothing — Continue
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MotilityStop;
