import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SnellenProps {
  onResult: (label: string, value: string, concern: boolean, rawKey?: string) => void;
  initialValue?: string;
}

const lines = [
  { size: 48, letters: 'E', acuity: '20/200', label: 'Line 1 (20/200)' },
  { size: 36, letters: 'FP', acuity: '20/100', label: 'Line 2 (20/100)' },
  { size: 28, letters: 'TOZ', acuity: '20/70', label: 'Line 3 (20/70)' },
  { size: 22, letters: 'LPED', acuity: '20/50', label: 'Line 4 (20/50)' },
  { size: 17, letters: 'PECFD', acuity: '20/40', label: 'Line 5 (20/40)' },
  { size: 13, letters: 'EDFCZP', acuity: '20/30', label: 'Line 6 (20/30)' },
  { size: 10, letters: 'FELOPZD', acuity: '20/25', label: 'Line 7 (20/25)' },
  { size: 8, letters: 'DEFPOTEC', acuity: '20/20', label: "Line 8 (20/20) \u2014 Normal" },
  { size: 6, letters: 'LEFODPCT', acuity: '20/15', label: 'Line 9 (20/15) — Better than average' },
];
const SnellenStop: React.FC<SnellenProps> = ({ onResult, initialValue }) => {
  const [lastClear, setLastClear] = useState<string>(initialValue ?? '');

  const handleSubmit = () => {
    if (lastClear === '') return;
    if (lastClear === 'none') {
      onResult('Visual Acuity (Snellen)', 'Could not read any line clearly', true, 'none');
      return;
    }
    const line = lines.find(l => l.acuity === lastClear);
    const label = line?.label || lastClear;
    const concern = ['20/200', '20/100', '20/70', '20/50', '20/40'].includes(lastClear);
    onResult('Visual Acuity (Snellen)', label, concern, lastClear);
  };

  return (
    <div className="space-y-5">
      <div className="border-2 border-primary bg-primary/5 px-4 py-3">
        <p className="text-sm font-semibold text-foreground mb-1">Instructions</p>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Cover one eye gently with your palm (do not press on the eye).</li>
          <li>{"Hold your screen at arm's length (about 50 cm away)."}</li>
          <li>Read each line from top. Select the <em>smallest line</em> where you can read more than half the letters correctly.</li>
          <li>Repeat with the other eye if you wish.</li>
        </ol>
      </div>

      <div className="bg-foreground text-background p-5 border-2 border-border flex flex-col items-center gap-1 select-none" aria-label="Snellen eye chart">
        {lines.map(line => (
          <p
            key={line.acuity}
            className="font-mono font-bold tracking-[0.25em] leading-none"
            style={{ fontSize: line.size }}
            aria-label={`${line.acuity} line: ${line.letters}`}
          >
            {line.letters}
          </p>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-1">
          {"What's the smallest line you can read clearly?"}
        </p>
        {lastClear === '' && (
          <p className="text-xs text-muted-foreground mb-2">← Select one option below to continue</p>
        )}
        <RadioGroup value={lastClear} onValueChange={setLastClear} className="gap-1">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="none" id="snellen-none" />
            <Label htmlFor="snellen-none" className="text-sm cursor-pointer">{"I couldn't read any line clearly"}</Label>
          </div>
          {lines.map(l => (
            <div key={l.acuity} className="flex items-center gap-2">
              <RadioGroupItem value={l.acuity} id={`snellen-${l.acuity}`} />
              <Label htmlFor={`snellen-${l.acuity}`} className="text-sm cursor-pointer">{l.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={lastClear === ''}
        className="border-2 border-primary"
        type="button"
      >
        {lastClear === '' ? 'Select an option above to continue' : 'Save Result & Continue →'}
      </Button>
    </div>
  );
};

export default SnellenStop;
