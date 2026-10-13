import React, { useEffect, useState } from 'react';
import { getLocalToday } from '@/lib/storage';

interface ScoreFactor {
  label: string;
  score: number;
  max: number;
  color: string;
  remaining: number;
  remainingUnit: string;
}

function computeScore(): { factors: ScoreFactor[]; total: number; maxTotal: number } {
  const cycles = getLocalToday('timer-cycles', 0) as number;
  const exercises = (getLocalToday('eye-exercises', []) as string[]).length;
  const nutrition = (getLocalToday('nutrition-eaten', []) as string[]).length;
  const workstation = (getLocalToday('workstation-checks', []) as string[]).length;

  // Scoring: 20-20-20=25pts, Exercises=25pts, Nutrition=20pts, Workstation=30pts → 100 total
  const cycleScore = Math.min(cycles * 8, 24);          // max 3 cycles = 24pts (≈25)
  const exerciseScore = Math.min(exercises * 3, 21);    // max 7 ex = 21pts
  const nutritionScore = Math.min(nutrition * 7, 21);   // max 3 foods = 21pts
  const workstationScore = Math.round((workstation / 8) * 34); // max 8 = 34pts
  // Total max = 24+21+21+34 = 100

  const factors: ScoreFactor[] = [
    {
      label: '20-20-20 Breaks',
      score: cycleScore,
      max: 24,
      color: 'bg-primary',
      remaining: Math.max(0, 3 - cycles),
      remainingUnit: 'cycles left',
    },
    {
      label: 'Eye Exercises',
      score: exerciseScore,
      max: 21,
      color: 'bg-secondary',
      remaining: Math.max(0, 7 - exercises),
      remainingUnit: 'exercises left',
    },
    {
      label: 'Eye Nutrition',
      score: nutritionScore,
      max: 21,
      color: 'bg-chart-3',
      remaining: Math.max(0, 3 - nutrition),
      remainingUnit: 'foods left',
    },
    {
      label: 'Workstation Setup',
      score: workstationScore,
      max: 34,
      color: 'bg-chart-4',
      remaining: Math.max(0, 8 - workstation),
      remainingUnit: 'items left',
    },
  ];

  const total = factors.reduce((s, f) => s + f.score, 0);
  const maxTotal = factors.reduce((s, f) => s + f.max, 0);
  return { factors, total, maxTotal };
}

function getGrade(score: number, max: number): { label: string; desc: string } {
  const pct = score / max;
  if (pct >= 0.9) return { label: 'Excellent 🌟', desc: 'Your eyes thank you! Keep this up daily.' };
  if (pct >= 0.75) return { label: 'Great 👍', desc: "Strong habits — a bit more exercise and you're perfect." };
  if (pct >= 0.5) return { label: 'Good 🙂', desc: 'Solid start. Try completing your workstation checklist.' };
  if (pct >= 0.25) return { label: 'Fair ⚠️', desc: "Don't forget your 20-20-20 breaks today." };
  return { label: 'Needs Work 🔴', desc: 'Start with 3 timer cycles — small steps matter.' };
}

const EyeIntegrityScore: React.FC = () => {
  const [scoreData, setScoreData] = useState(computeScore);

  // Live-update whenever any habit fires 'eyeterra-score-update'
  useEffect(() => {
    const handler = () => setScoreData(computeScore());
    window.addEventListener('eyeterra-score-update', handler);
    return () => window.removeEventListener('eyeterra-score-update', handler);
  }, []);

  const { factors, total, maxTotal } = scoreData;
  const grade = getGrade(total, maxTotal);
  const pct = Math.round((total / maxTotal) * 100);

  return (
    <div className="bg-background border-2 border-border p-5">
      <h3 className="font-bold text-lg text-foreground mb-1">{"Today's Eye Integrity Score"}</h3>
      <p className="text-sm text-muted-foreground mb-4 text-pretty">
        Updates live as you complete habits. Based on breaks, exercises, nutrition, and workstation setup.
      </p>

      {/* Score ring */}
      <div className="flex items-center gap-6 mb-5">
        <div className="relative shrink-0" aria-label={`Score: ${pct} out of 100`}>
          <svg width="96" height="96" viewBox="0 0 96 96" role="img" aria-hidden="true">
            <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
              strokeLinecap="butt" transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <text x="48" y="44" textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: 'hsl(var(--foreground))' }}>
              {pct}
            </text>
            <text x="48" y="60" textAnchor="middle" style={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}>
              / 100
            </text>
          </svg>
        </div>
        <div>
          <p className="font-bold text-xl text-foreground text-balance">{grade.label}</p>
          <p className="text-sm text-muted-foreground text-pretty">{grade.desc}</p>
        </div>
      </div>

      {/* Factor bars */}
      <div className="space-y-3">
        {factors.map(f => (
          <div key={f.label}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{f.label}</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {f.remaining > 0 ? `${f.remaining} ${f.remainingUnit}` : '✓ Complete'}
              </span>
            </div>
            <div className="h-2.5 w-full bg-muted border border-border">
              <div
                className={`h-full ${f.color} transition-all duration-500`}
                style={{ width: `${(f.score / f.max) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 italic">{"Score resets every midnight — you did great!"}</p>
    </div>
  );
};

export default EyeIntegrityScore;
