import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import sampleImage1 from '@/assets/sample-image-1.png';
import sampleImage2 from '@/assets/sample-image-2.png';

type ColourBlindType = 'deuteranopia' | 'protanopia' | 'tritanopia';

interface ImpairmentDef {
  id: string;
  label: string;
  description: string;
  hasSlider: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderUnit?: string;
  sliderLabels?: string[];
  defaultValue: number;
}

const IMPAIRMENTS: ImpairmentDef[] = [
  {
    id: 'myopia',
    label: 'Myopia',
    description: 'Distant objects appear blurred; close objects remain clear.',
    hasSlider: true, sliderMin: 0, sliderMax: 40, sliderStep: 1, sliderUnit: 'D',
    defaultValue: 1,
  },
  {
    id: 'hyperopia',
    label: 'Hyperopia',
    description: 'Close objects appear blurred; distant objects are clearer.',
    hasSlider: true, sliderMin: 0, sliderMax: 24, sliderStep: 1, sliderUnit: 'D',
    defaultValue: 1,
  },
  {
    id: 'glaucoma',
    label: 'Glaucoma',
    description: 'Progressive peripheral vision loss creating a tunnel effect.',
    hasSlider: true, sliderMin: 0, sliderMax: 100, sliderStep: 5, sliderUnit: '%',
    defaultValue: 5,
  },
  {
    id: 'cataract',
    label: 'Cataract',
    description: 'Cloudy, hazy vision with glare sensitivity.',
    hasSlider: true, sliderMin: 0, sliderMax: 3, sliderStep: 1,
    sliderLabels: ['None', 'Mild', 'Moderate', 'Advanced'],
    defaultValue: 1,
  },
  {
    id: 'diabetic',
    label: 'Diabetic Retinopathy',
    description: 'Dark floating spots and blurred areas across the visual field.',
    hasSlider: true, sliderMin: 0, sliderMax: 3, sliderStep: 1,
    sliderLabels: ['None', 'Mild NPDR', 'Moderate NPDR', 'PDR'],
    defaultValue: 1,
  },
  {
    id: 'colour-blind',
    label: 'Colour Blindness',
    description: 'Difficulty distinguishing certain colour hues.',
    hasSlider: false,
    defaultValue: 0,
  },
];

interface ActiveImpairment {
  id: string;
  value: number;
  cbType?: ColourBlindType;
}

const SCALE_D = 3;
const MAX_BLUR = 30;
const ACCOM_BUF = 3.0;

function depthAt(yFrac: number): number {
  return 0.3 + (1 - yFrac) * 49.7;
}

function myopiaBlurAtY(yFrac: number, absDiopters: number): number {
  const focusD = absDiopters;
  const objectD = 1 / depthAt(yFrac);
  let defocus: number;
  if (objectD > focusD) {
    defocus = Math.max(0, objectD - focusD - ACCOM_BUF);
  } else {
    defocus = focusD - objectD;
  }
  return Math.min(defocus * SCALE_D, MAX_BLUR);
}

interface BlurLayer {
  blur: number;
  mask: string;
}

const BLUR_LEVELS = [1, 3, 6, 12, 22];
const FEATHER = 0.10;

function computeMyopiaLayers(absDiopters: number): BlurLayer[] {
  const layers: BlurLayer[] = [];

  for (const targetBlur of BLUR_LEVELS) {
    if (myopiaBlurAtY(0, absDiopters) < targetBlur) break;

    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (myopiaBlurAtY(mid, absDiopters) > targetBlur) lo = mid;
      else hi = mid;
    }
    const yThreshold = (lo + hi) / 2;

    const coverPct = Math.round(yThreshold * 100);
    const featherPx = Math.round(FEATHER * 100);
    const fadeStart = Math.max(0, coverPct - featherPx);
    const fadeEnd = Math.min(100, coverPct + Math.round(featherPx * 0.5));
    const mask = `linear-gradient(to bottom, black 0%, black ${fadeStart}%, transparent ${fadeEnd}%)`;

    layers.push({ blur: targetBlur, mask });
  }
  return layers;
}

function computeHyperopiaLayers(absDiopters: number): BlurLayer[] {
  const clearFraction = Math.exp(-0.2 * absDiopters);
  const maxBlurH = Math.min(absDiopters * 5, MAX_BLUR);

  const layers: BlurLayer[] = [];

  for (const targetBlur of BLUR_LEVELS) {
    if (targetBlur > maxBlurH) break;

    const yThreshold = clearFraction + (targetBlur / maxBlurH) * (1 - clearFraction);
    if (yThreshold >= 1) break;

    const startPct = Math.round(yThreshold * 100);
    const featherPx = Math.round(FEATHER * 100);
    const fadeStart = Math.max(0, startPct - featherPx);
    const fadeEnd = Math.min(100, startPct + Math.round(featherPx * 0.5));
    const mask = `linear-gradient(to top, black 0%, black ${Math.max(0, 100 - fadeEnd)}%, transparent ${Math.max(0, 100 - fadeStart)}%)`;

    layers.push({ blur: targetBlur, mask });
  }
  return layers;
}

function computeBlurLayers(diopters: number): BlurLayer[] {
  const absDiopters = Math.abs(diopters);
  if (absDiopters < 0.05) return [];
  return diopters < 0
    ? computeMyopiaLayers(absDiopters)
    : computeHyperopiaLayers(absDiopters);
}

interface DepthBlurImageProps {
  src: string;
  diopters: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

const DepthBlurImage: React.FC<DepthBlurImageProps> = ({ src, diopters, className, style, alt }) => {
  const layers = computeBlurLayers(diopters);
  const sharedImgStyle: React.CSSProperties = {
    width: '100%', height: '100%', objectFit: 'cover',
  };
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }} className={className}>
      <img src={src} alt={alt ?? ''} style={sharedImgStyle} className="no-hc-invert" />
      {layers.map((layer, i) => (
        <img
          key={i}
          src={src}
          alt=""
          aria-hidden="true"
          style={{
            ...sharedImgStyle,
            position: 'absolute',
            inset: 0,
            filter: `blur(${layer.blur}px)`,
            WebkitMaskImage: layer.mask,
            maskImage: layer.mask,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
          className="no-hc-invert"
        />
      ))}
    </div>
  );
};

function computeVisual(active: ActiveImpairment[]): {
  imgFilter: string;
  containerFilter: string;
  overlays: { id: string; jsx: React.ReactNode }[];
  depthDiopters: number | null;
} {
  let blurPx = 0;
  let contrastMul = 1;
  let brightnessMul = 1;
  let saturateMul = 1;
  let cbType: ColourBlindType | null = null;
  let depthDiopters: number | null = null;
  const overlays: { id: string; jsx: React.ReactNode }[] = [];

  for (const imp of active) {
    const t = imp.id;
    const v = imp.value;

    if (t === 'myopia') {
      const diopters = -(v * 0.25);
      if (v > 0) depthDiopters = (depthDiopters ?? 0) + diopters;
    } else if (t === 'hyperopia') {
      const diopters = v * 0.25;
      if (v > 0) depthDiopters = (depthDiopters ?? 0) + diopters;
    } else if (t === 'glaucoma') {
      contrastMul *= 1 - (v / 100) * 0.2;
      overlays.push({
        id: 'glaucoma',
        jsx: (
          <div
            key="glaucoma"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse ${Math.max(10, 80 - v * 0.7)}% ${Math.max(8, 70 - v * 0.6)}% at 50% 50%, transparent 28%, rgba(0,0,0,${0.45 + v * 0.005}) 58%, rgba(0,0,0,0.9) 100%)`,
            }}
            aria-hidden="true"
          />
        ),
      });
    } else if (t === 'cataract') {
      const levels = [0, 0.25, 0.55, 0.9];
      const r = levels[Math.min(v, 3)];
      blurPx += r * 2.5;
      contrastMul *= 1 - r * 0.4;
      brightnessMul *= 1 + r * 0.45;
      saturateMul *= 1 - r * 0.55;
    } else if (t === 'diabetic') {
      const levels = [0, 0.3, 0.6, 1.0];
      const r = levels[Math.min(v, 3)];
      blurPx += r * 1.2;
      contrastMul *= 1 - r * 0.3;
      const spots = [
        { x: 20, y: 15, r: 8 }, { x: 65, y: 30, r: 11 },
        { x: 40, y: 60, r: 9 }, { x: 75, y: 70, r: 7 },
        { x: 15, y: 75, r: 6 }, { x: 55, y: 45, r: 10 },
      ];
      overlays.push({
        id: 'diabetic',
        jsx: (
          <div key="diabetic" className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              {spots.map((s, i) => (
                <ellipse key={i} cx={s.x} cy={s.y}
                  rx={s.r * r} ry={s.r * 0.8 * r}
                  fill={`rgba(0,0,0,${0.4 + r * 0.35})`} />
              ))}
            </svg>
          </div>
        ),
      });
    } else if (t === 'colour-blind') {
      cbType = imp.cbType ?? 'deuteranopia';
    }
  }

  const parts: string[] = [];
  if (blurPx > 0) parts.push(`blur(${blurPx.toFixed(2)}px)`);
  if (Math.abs(contrastMul - 1) > 0.001) parts.push(`contrast(${contrastMul.toFixed(3)})`);
  if (Math.abs(brightnessMul - 1) > 0.001) parts.push(`brightness(${brightnessMul.toFixed(3)})`);
  if (Math.abs(saturateMul - 1) > 0.001) parts.push(`saturate(${saturateMul.toFixed(3)})`);

  const imgFilter = parts.join(' ');
  const containerFilter = cbType ? `url('#${cbType}-filter')` : '';

  return { imgFilter, containerFilter, overlays, depthDiopters };
}

interface ImagePanelProps {
  label: string;
  src: string | null;
  uploadSlot?: boolean;
  onUpload?: (src: string) => void;
  isNoHcInvert?: boolean;
}

const ResetIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const AddIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const RemoveIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function sliderDisplayValue(def: ImpairmentDef, value: number): string {
  if (def.sliderLabels) return def.sliderLabels[Math.min(value, def.sliderLabels.length - 1)];
  if (def.id === 'myopia') return `-${(value * 0.25).toFixed(2)}D`;
  if (def.id === 'hyperopia') return `+${(value * 0.25).toFixed(2)}D`;
  if (def.id === 'glaucoma') return `${value}%`;
  return String(value);
}

const CB_TYPES: { value: ColourBlindType; label: string }[] = [
  { value: 'deuteranopia', label: 'Deuteranopia' },
  { value: 'protanopia', label: 'Protanopia' },
  { value: 'tritanopia', label: 'Tritanopia' },
];

const ImagePanel: React.FC<ImagePanelProps> = ({ label, src, uploadSlot, onUpload }) => {
  const [active, setActive] = useState<ActiveImpairment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { imgFilter, containerFilter, overlays, depthDiopters } = computeVisual(active);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    const reader = new FileReader();
    reader.onload = ev => onUpload(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, [onUpload]);

  const addImpairment = (id: string) => {
    if (active.find(a => a.id === id)) return;
    const def = IMPAIRMENTS.find(d => d.id === id)!;
    setActive(prev => [...prev, {
      id,
      value: def.defaultValue,
      cbType: id === 'colour-blind' ? 'deuteranopia' : undefined,
    }]);
  };

  const removeImpairment = (id: string) => setActive(prev => prev.filter(a => a.id !== id));

  const updateValue = (id: string, value: number) =>
    setActive(prev => prev.map(a => a.id === id ? { ...a, value } : a));

  const updateCbType = (id: string, cbType: ColourBlindType) =>
    setActive(prev => prev.map(a => a.id === id ? { ...a, cbType } : a));

  const reset = () => setActive([]);

  const available = IMPAIRMENTS.filter(d => !active.find(a => a.id === d.id));

  return (
    <div className="border-2 border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm text-foreground">{label}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
          onClick={reset}
          title="Reset to normal vision"
        >
          <ResetIcon /> Reset
        </Button>
      </div>

      {src ? (
        <div
          className="relative overflow-hidden border border-border aspect-video w-full bg-muted"
          style={containerFilter ? { filter: containerFilter } : {}}
        >
          {depthDiopters !== null ? (
            <DepthBlurImage
              src={src}
              diopters={depthDiopters}
              style={imgFilter ? { filter: imgFilter } : undefined}
              className="absolute inset-0 w-full h-full"
              alt={`${label} simulated view`}
            />
          ) : (
            <img
              src={src}
              alt={`${label} simulated view`}
              className="w-full h-full object-cover no-hc-invert"
              style={imgFilter ? { filter: imgFilter } : {}}
            />
          )}
          <div className="absolute inset-0 pointer-events-none">
            {overlays.map(o => o.jsx)}
          </div>
        </div>
      ) : uploadSlot ? (
        <div
          className="border-2 border-dashed border-border aspect-video w-full bg-muted flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
          aria-label="Upload your own image"
        >
          <p className="text-sm text-muted-foreground">Click to upload an image</p>
          <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG, GIF, WEBP</p>
        </div>
      ) : null}

      {uploadSlot && !src && (
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      )}
      {uploadSlot && src && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border border-border self-start"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Image
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </>
      )}

      {active.length > 0 && (
        <div className="flex flex-col gap-2">
          {active.map(imp => {
            const def = IMPAIRMENTS.find(d => d.id === imp.id)!;
            return (
              <div key={imp.id} className="bg-background border border-border p-2.5 rounded-none">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">{def.label}</Badge>
                  </div>
                  <button
                    onClick={() => removeImpairment(imp.id)}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                    aria-label={`Remove ${def.label}`}
                  >
                    <RemoveIcon />
                  </button>
                </div>

                {def.hasSlider && (
                  <div className="flex items-center gap-2">
                    <Slider
                      min={def.sliderMin} max={def.sliderMax} step={def.sliderStep}
                      value={[imp.value]}
                      onValueChange={([v]) => updateValue(imp.id, v)}
                      className="flex-1"
                      aria-label={`${def.label} intensity`}
                    />
                    <span className="text-xs text-muted-foreground w-20 text-right shrink-0">
                      {sliderDisplayValue(def, imp.value)}
                    </span>
                  </div>
                )}

                {imp.id === 'colour-blind' && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {CB_TYPES.map(cb => (
                      <button
                        key={cb.value}
                        onClick={() => updateCbType(imp.id, cb.value)}
                        className={`text-xs px-2 py-0.5 border transition-colors ${
                          imp.cbType === cb.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border text-muted-foreground hover:border-primary'
                        }`}
                      >
                        {cb.label}
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-1 text-pretty">{def.description}</p>
              </div>
            );
          })}
        </div>
      )}

      {available.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {available.map(def => (
            <button
              key={def.id}
              onClick={() => addImpairment(def.id)}
              className="flex items-center gap-1 text-xs px-2 py-1 border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <AddIcon /> {def.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SAMPLE_IMAGE = sampleImage1;
const SAMPLE_IMAGE_2 = sampleImage2;

const ImpairmentSimulator: React.FC = () => {
  const [customImage, setCustomImage] = useState<string | null>(null);

  return (
    <div className="bg-background border-2 border-border p-5 flex flex-col gap-1">
      <h3 className="font-bold text-lg text-foreground mb-1">Visual Impairment Simulator</h3>
      <p className="text-sm text-muted-foreground mb-3 text-pretty">{"Apply one or more conditions to each image — experience how common eye conditions affect vision."}</p>
      <div className="flex flex-col gap-4">
        <ImagePanel label="Sample 1" src={SAMPLE_IMAGE} />
        <ImagePanel label="Sample 2" src={SAMPLE_IMAGE_2} />
        <ImagePanel
          label="Your Image"
          src={customImage}
          uploadSlot
          onUpload={setCustomImage}
        />
      </div>
    </div>
  );
};

export default ImpairmentSimulator;