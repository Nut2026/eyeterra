import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface AmslerProps {
  onResult: (label: string, value: string, concern: boolean, rawKey?: string) => void;
  initialValue?: string;
}

const GRID_SIZE = 300;
const CELL = 15;

const AmslerStop: React.FC<AmslerProps> = ({ onResult, initialValue }) => {
  const [drawing, setDrawing] = useState(false);
  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  // initialValue: 'true' | 'false' | undefined
  const [hasDistortions, setHasDistortions] = useState<boolean | null>(
    initialValue === 'true' ? true : initialValue === 'false' ? false : null
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const getPos = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDrawing(true);
    setCurrentPath([getPos(e)]);
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing) return;
    setCurrentPath(prev => [...prev, getPos(e)]);
  };

  const onPointerUp = () => {
    if (drawing && currentPath.length > 1) setPaths(prev => [...prev, currentPath]);
    setDrawing(false);
    setCurrentPath([]);
  };

  const pathToD = (pts: { x: number; y: number }[]) =>
    pts.length < 2 ? '' : `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  const handleSubmit = () => {
    // Ink overrides MCQ: if user drew on the grid, flag distortions regardless of button selection
    const inkPresent = paths.length > 0;
    const hasDist = inkPresent ? true : (hasDistortions ?? false);
    onResult('Amsler Grid', hasDist ? 'Distortions/wavy lines noted' : 'Grid appeared straight', hasDist, String(hasDist));
  };

  return (
    <div className="space-y-5">
      <div className="border-2 border-primary bg-primary/5 px-4 py-3">
        <p className="text-sm font-semibold text-foreground mb-1">Instructions</p>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Wear reading glasses if you normally use them for screens.</li>
          <li>{"Cover one eye. Keep your screen ~30 cm from your face."}</li>
          <li>Stare at the <strong>central dot</strong> — do not move your eye.</li>
          <li>If any lines look wavy, distorted, or missing, <strong>draw on the grid</strong> where you see the problem.</li>
          <li>Repeat with the other eye.</li>
        </ol>
      </div>

      <div className="flex flex-col items-center gap-2">
        <svg
          ref={svgRef}
          width={GRID_SIZE} height={GRID_SIZE}
          className="border-2 border-foreground bg-foreground cursor-crosshair touch-none"
          style={{ maxWidth: '100%' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="img"
          aria-label="Amsler grid — draw where distortions appear"
        >
          {Array.from({ length: 21 }, (_, i) => i * CELL).map(pos => (
            <React.Fragment key={pos}>
              <line x1={pos} y1={0} x2={pos} y2={GRID_SIZE} stroke="white" strokeWidth="0.5" />
              <line x1={0} y1={pos} x2={GRID_SIZE} y2={pos} stroke="white" strokeWidth="0.5" />
            </React.Fragment>
          ))}
          <circle cx={GRID_SIZE / 2} cy={GRID_SIZE / 2} r={4} fill="white" />
          {paths.map((pts, i) => (
            <path key={i} d={pathToD(pts)} stroke="#D97A5C" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {currentPath.length > 1 && (
            <path d={pathToD(currentPath)} stroke="#D97A5C" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" onClick={() => setPaths([])} className="border-2 border-border text-xs">
            Clear Drawing
          </Button>
          <p className="text-xs text-muted-foreground">Draw on grid to mark distortions</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">When looking at the centre dot, did the grid appear:</p>
        <div className="flex flex-col gap-2">
          {[
            { val: false, label: '✅ Completely straight and regular — no distortions' },
            { val: true, label: '⚠ Wavy, bent, blurred, or missing areas present' },
          ].map(opt => (
            <button
              key={String(opt.val)}
              onClick={() => setHasDistortions(opt.val)}
              className={`text-left px-4 py-2 border-2 text-sm transition-colors ${
                hasDistortions === opt.val
                  ? 'border-primary bg-primary/5 font-semibold text-foreground'
                  : 'border-border text-muted-foreground hover:border-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={hasDistortions === null} className="border-2 border-primary">
          Save &amp; Continue
        </Button>
      </div>
    </div>
  );
};

export default AmslerStop;
