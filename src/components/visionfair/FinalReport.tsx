import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import eyeterraIcon from '@/assets/eyeterra-icon.png';
import type { VFResult } from '@/lib/visionFair';

interface ReportProps {
  results: VFResult[];
  onRestart: () => void;
}

const URGENCY_MAP: Record<string, string> = {
  'Visual Acuity (Snellen)': 'Acuity',
  'Amsler Grid': 'Macula',
  'Pupil Symmetry': 'Pupils',
  'Eye Motility': 'Motility',
  'Symptom Assessment': 'Symptoms',
};

const FinalReport: React.FC<ReportProps> = ({ results, onRestart }) => {
  const concerns = results.filter(r => r.concern);
  const hasConcerns = concerns.length > 0;
  const urgentConcerns = concerns.filter(r =>
    ['Amsler Grid', 'Pupil Symmetry', 'Symptom Assessment'].includes(r.label) ||
    r.value.toLowerCase().includes('urgent') ||
    r.value.toLowerCase().includes('20/100') ||
    r.value.toLowerCase().includes('20/200')
  );

  const [copyState, setCopyState] = useState<boolean | null>(null);

  const handlePrint = () => window.print();

  const handleCopy = useCallback(async () => {
    const text = `Eyeterra Vision Tour Results:\n${results.map(r => `• ${r.label}: ${r.value}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(true);
    } catch {
      setCopyState(false);
    }
    setTimeout(() => setCopyState(null), 2000);
  }, [results]);

  return (
    <div className="space-y-6">
      <div className="hidden print:flex print:items-center print:gap-3 print-logo">
        <img
          src={eyeterraIcon}
          alt="Eyeterra"
          style={{ width: 36, height: 36 }}
        />
        <span style={{ fontWeight: 700, fontSize: 18 }}>Eyeterra — Vision Tour Report</span>
      </div>

      <div className={`border-2 px-5 py-4 ${urgentConcerns.length > 0 ? 'border-destructive bg-destructive/5' : hasConcerns ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}`}>
        <h3 className="font-bold text-lg text-foreground mb-1 text-balance">
          {urgentConcerns.length > 0
            ? '🚨 Urgent — Please seek professional eye care'
            : hasConcerns
            ? '⚠ Some concerns found — schedule an eye exam'
            : '✅ Good overall results — keep up your eye health habits'}
        </h3>
        <p className="text-sm text-muted-foreground text-pretty">
          {urgentConcerns.length > 0
            ? 'One or more of your results suggest an issue that warrants prompt professional evaluation.'
            : hasConcerns
            ? `${concerns.length} area(s) with potential concerns. A routine eye examination is recommended.`
            : 'No significant concerns detected across your stops. Continue annual check-ups.'}
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-3">Your Results by Stop</h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-2 border-border">
            <thead>
              <tr className="bg-muted border-b-2 border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">Stop</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">Category</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">Finding</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r.stopId} className={`border-b border-border ${r.concern ? 'bg-destructive/4' : ''}`}>
                  <td className="px-4 py-2 text-sm font-semibold text-foreground whitespace-nowrap">{i + 1}</td>
                  <td className="px-4 py-2 text-sm text-foreground whitespace-nowrap">
                    {URGENCY_MAP[r.label] || r.label}
                  </td>
                  <td className="px-4 py-2 text-sm text-muted-foreground max-w-xs">{r.value}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Badge variant={r.concern ? 'destructive' : 'secondary'} className="border border-border text-xs">
                      {r.concern ? '⚠ Concern' : '✓ OK'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-2 border-border p-5 bg-card">
        <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
        <ul className="space-y-2">
          {urgentConcerns.length > 0 && (
            <li className="flex gap-2 text-sm text-destructive">
              <span className="shrink-0 font-bold">1.</span>
              <span>Seek urgent eye care within 24–48 hours for the flagged concerns.</span>
            </li>
          )}
          {hasConcerns && urgentConcerns.length === 0 && (
            <li className="flex gap-2 text-sm text-primary">
              <span className="shrink-0 font-bold">1.</span>
              <span>Schedule a routine comprehensive eye exam within the next 1–3 months.</span>
            </li>
          )}
          <li className="flex gap-2 text-sm text-muted-foreground">
            <span className="shrink-0 font-bold">{hasConcerns ? '2.' : '1.'}</span>
            <span>Practice daily habits: 20-20-20 rule, eye exercises, proper nutrition, and workstation ergonomics.</span>
          </li>
          <li className="flex gap-2 text-sm text-muted-foreground">
            <span className="shrink-0 font-bold">{hasConcerns ? '3.' : '2.'}</span>
            <span>Annual eye exams are recommended for adults 18–64; every 1–2 years for those over 65 or with risk factors.</span>
          </li>
        </ul>
      </div>

      <div className="border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground italic text-pretty">
          These results are for educational and informational purposes only. This is not a clinical examination or medical diagnosis. Vision Tour cannot detect all eye conditions. Always consult a licensed optometrist or ophthalmologist for professional evaluation.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="border-2 border-border">
          🖨 Download/Print Results
        </Button>
        <Button onClick={handleCopy} variant="outline" className="border-2 border-border min-w-[140px]">
          {copyState === true ? '✅ Copied!' : copyState === false ? '❌ Failed' : '📋 Copy Results'}
        </Button>
        <Button onClick={onRestart} className="border-2 border-primary">
          ↺ Retake Vision Tour
        </Button>
      </div>
    </div>
  );
};

export default FinalReport;
