import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { getLocalToday, setLocalToday } from '@/lib/storage';

interface CheckItem {
  id: string;
  label: string;
  tip: string;
  icon: string;
}

const checklist: CheckItem[] = [
  {
    id: 'distance',
    label: 'Screen 50–70 cm away',
    tip: "Your screen should be at arm's length — further reduces strain without losing clarity.",
    icon: '📏',
  },
  {
    id: 'height',
    label: 'Top of screen at or below eye level',
    tip: 'Looking slightly downward reduces dry eye: your upper eyelid covers more cornea.',
    icon: '📐',
  },
  {
    id: 'glare',
    label: 'No glare or reflections on screen',
    tip: 'Position screen perpendicular to windows. Use a matte screen protector if needed.',
    icon: '🪟',
  },
  {
    id: 'brightness',
    label: 'Screen brightness matched to surroundings',
    tip: 'Your screen should not be brighter than the room around it.',
    icon: '☀️',
  },
  {
    id: 'bluelight',
    label: 'Blue light filter enabled after 6 PM',
    tip: 'Blue light inhibits melatonin. Use Night Shift (Mac/iOS), Night Light (Windows/Android).',
    icon: '🌙',
  },
  {
    id: 'chair',
    label: 'Chair supports lower back, feet flat on floor',
    tip: 'Neck strain leads to tension headaches that worsen eye fatigue.',
    icon: '🪑',
  },
  {
    id: 'lighting',
    label: 'Ambient lighting even — no dark contrast zones',
    tip: 'Dark room + bright screen creates stark contrast, increasing strain.',
    icon: '💡',
  },
  {
    id: 'doc',
    label: 'Document/source material near screen height',
    tip: 'Frequent up-down eye movement between screen and paper accelerates fatigue.',
    icon: '📄',
  },
];

const WorkstationSetup: React.FC = () => {
  const [checked, setChecked] = useState<string[]>(
    () => getLocalToday('workstation-checks', [])
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      setLocalToday('workstation-checks', next);
      window.dispatchEvent(new CustomEvent('eyeterra-score-update'));
      return next;
    });
  };

  const score = Math.round((checked.length / checklist.length) * 100);

  return (
    <div className="bg-background border-2 border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-foreground">Workstation Setup</h3>
        <Badge
          className="border border-border"
          variant={score >= 80 ? 'default' : 'secondary'}
        >
          {checked.length}/{checklist.length} ✓
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {checklist.map(item => (
          <div key={item.id} className={`border-2 transition-colors ${checked.includes(item.id) ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <div className="flex items-center gap-3 p-3">
              <button
                className={`w-5 h-5 border-2 shrink-0 flex items-center justify-center transition-colors ${
                  checked.includes(item.id) ? 'bg-primary border-primary' : 'border-border bg-background'
                }`}
                onClick={() => toggle(item.id)}
                aria-checked={checked.includes(item.id)}
                role="checkbox"
                aria-label={item.label}
              >
                {checked.includes(item.id) && (
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="2" fill="none" />
                  </svg>
                )}
              </button>
              <span className="text-lg shrink-0" aria-hidden="true">{item.icon}</span>
              <span
                className={`flex-1 min-w-0 text-sm ${checked.includes(item.id) ? 'line-through text-muted-foreground' : 'text-foreground'}`}
              >
                {item.label}
              </span>
              <button
                className="shrink-0 text-xs text-secondary underline-offset-2 hover:underline"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                aria-label={`Tip for ${item.label}`}
              >
                tip
              </button>
            </div>
            {expanded === item.id && (
              <div className="border-t-2 border-border px-4 py-2 bg-muted/30">
                <p className="text-sm text-muted-foreground text-pretty">{item.tip}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkstationSetup;
