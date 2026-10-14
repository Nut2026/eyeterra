import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const A11yIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 30 30"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="15" cy="15" r="12.215" style={{ fill: '#8ba3bc', stroke: 'none' }} />
    <circle cx="15" cy="8.609" r="2.391" style={{ fill: '#fff', stroke: 'none' }} />
    <path
      d="M15 13 8 9l-2 3 7 3-4 8 3 2 3-6 3 6 3-2-4-8 7-3-2-3z"
      style={{ fill: '#fff', stroke: 'none' }}
    />
  </svg>
);

const AccessibilityDropdown: React.FC = () => {
  const {
    darkMode, highContrast,
    dyslexiaFont, readingGuide, readingMask, neonmap,
    toggle,
  } = useAccessibility();
  const [open, setOpen] = useState(false);

  const row = (label: string, checked: boolean, onToggle: () => void, id: string) => (
    <div className="flex items-center justify-between py-1.5 px-1 gap-4">
      <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onToggle} aria-label={label} />
    </div>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="no-hc-invert text-foreground border-2 border-transparent hover:border-border"
          aria-label="Accessibility options"
        >
          <A11yIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 border-2 border-border bg-background p-3">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
          Accessibility
        </DropdownMenuLabel>

        {row('Dark Mode', darkMode, () => toggle('darkMode'), 'a11y-dark')}
        {row('High Contrast', highContrast, () => toggle('highContrast'), 'a11y-hc')}
        {row('Dyslexia-Friendly Font', dyslexiaFont, () => toggle('dyslexiaFont'), 'a11y-dyslexia')}
        {row('Reading Guide', readingGuide, () => toggle('readingGuide'), 'a11y-guide')}
        {row('Reading Mask', readingMask, () => toggle('readingMask'), 'a11y-mask')}

        <DropdownMenuSeparator className="my-2 hc-separator" />

        <div className="px-1">
          <div className="flex items-center justify-between py-1.5 gap-4">
            <Label htmlFor="a11y-neonmap" className="text-sm cursor-pointer font-medium">Click Neonmap</Label>
            <Switch
              id="a11y-neonmap"
              checked={neonmap}
              onCheckedChange={() => toggle('neonmap')}
              aria-label="Toggle Click Neonmap"
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccessibilityDropdown;
