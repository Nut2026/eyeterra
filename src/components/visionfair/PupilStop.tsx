import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PupilProps {
  onResult: (label: string, value: string, concern: boolean, rawKey?: string) => void;
  initialValue?: string;
}

const PupilStop: React.FC<PupilProps> = ({ onResult, initialValue }) => {
  const [leftSize, setLeftSize] = useState(() => {
    const parts = initialValue?.split('|');
    return parts ? parseFloat(parts[0]) || 5 : 5;
  });
  const [rightSize, setRightSize] = useState(() => {
    const parts = initialValue?.split('|');
    return parts ? parseFloat(parts[1]) || 5 : 5;
  });
  const [selfReport, setSelfReport] = useState<'equal' | 'left-larger' | 'right-larger' | null>(() => {
    const parts = initialValue?.split('|');
    const v = parts?.[2];
    return (v === 'equal' || v === 'left-larger' || v === 'right-larger') ? v : null;
  });

  const diff = Math.abs(leftSize - rightSize);
  const concern = diff > 1;

  const handleSubmit = () => {
    const sliderConcern = diff > 1;
    const mcqConcern    = selfReport === 'left-larger' || selfReport === 'right-larger';
    const finalConcern  = sliderConcern || mcqConcern;

    let value: string;
    if (sliderConcern) {
      value = `Left: ${leftSize}mm, Right: ${rightSize}mm — Difference: ${diff.toFixed(1)}mm`;
    } else if (mcqConcern) {
      value = `Left: ${leftSize}mm, Right: ${rightSize}mm — Reported unequal by self-assessment`;
    } else {
      value = `Left: ${leftSize}mm, Right: ${rightSize}mm — Equal (≤1mm difference)`;
    }

    const rawKey = `${leftSize}|${rightSize}|${selfReport ?? 'equal'}`;
    onResult('Pupil Symmetry', value, finalConcern, rawKey);
  };

  return (
    <div className="space-y-5">
      <div className="border-2 border-primary bg-primary/5 px-4 py-3">
        <p className="text-sm font-semibold text-foreground mb-1">Instructions</p>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Stand in a moderately lit room — not too bright or dark.</li>
          <li>Look in a mirror. Observe both pupils side by side.</li>
          <li>Optionally: use a ruler held close to your eyes in the mirror to estimate pupil size in mm.</li>
          <li>Adjust the sliders below to match, or select how they appear.</li>
        </ol>
      </div>

      <div className="flex items-center justify-center gap-8 py-4 bg-foreground border-2 border-border">
        {[{ label: 'Left', size: leftSize }, { label: 'Right', size: rightSize }].map(({ label, size }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <p className="text-background text-xs font-semibold">{label}</p>
            <div className="rounded-full bg-background/20 flex items-center justify-center border-2 border-background/50" style={{ width: 64, height: 64 }} aria-hidden="true">
              <div className="rounded-full" style={{ width: size * 8, height: size * 8, background: '#1a1208', border: '2px solid rgba(255,255,255,0.3)', transition: 'all 0.2s' }} />
            </div>
            <p className="text-background text-xs">{size}mm</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Left Pupil Size: {leftSize}mm</label>
          <Slider min={2} max={9} step={0.5} value={[leftSize]} onValueChange={([v]) => setLeftSize(v)} aria-label="Left pupil size" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Right Pupil Size: {rightSize}mm</label>
          <Slider min={2} max={9} step={0.5} value={[rightSize]} onValueChange={([v]) => setRightSize(v)} aria-label="Right pupil size" />
        </div>
      </div>

      <div className="border-2 px-4 py-3 border-border bg-muted/30">
        <p className="text-sm font-semibold">
          Difference: {diff.toFixed(1)}mm —{' '}
          {diff === 0 ? 'Perfectly equal' : diff <= 0.5 ? 'Normal variation' : diff <= 1 ? 'Acceptable range' : 'May warrant evaluation'}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">How do your pupils look to you?</p>
        <div className="flex flex-col gap-2">
          {[
            { val: 'equal', label: 'Both pupils look the same size' },
            { val: 'left-larger', label: 'Left pupil appears noticeably larger' },
            { val: 'right-larger', label: 'Right pupil appears noticeably larger' },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setSelfReport(opt.val as typeof selfReport)}
              className={`text-left px-4 py-2 border-2 text-sm transition-colors ${
                selfReport === opt.val ? 'border-primary bg-primary/5 font-semibold text-foreground' : 'border-border text-muted-foreground hover:border-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={!selfReport} className="border-2 border-primary">
          Save &amp; Continue
        </Button>
      </div>
    </div>
  );
};

export default PupilStop;
