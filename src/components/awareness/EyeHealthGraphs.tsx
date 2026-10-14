import React, { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.25): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function useAnimatedValue(target: number, triggered: boolean, duration = 900): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(target * ease);
      if (prog < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);
  return val;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const SourceLink: React.FC<{ label: string; url: string }> = ({ label, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary underline hover:opacity-80"
  >
    {label}
  </a>
);

const GraphCard: React.FC<{
  title: string;
  insight: string;
  sources: React.ReactNode;
  children: React.ReactNode;
  refProp: React.RefObject<HTMLDivElement | null>;
}> = ({ title, insight, sources, children, refProp }) => (
  <div ref={refProp} className="border-2 border-border bg-card p-5 flex flex-col gap-3">
    <h3 className="font-bold text-base text-foreground text-balance">{title}</h3>
    <div className="w-full min-w-0">{children}</div>
    <p className="text-sm text-muted-foreground text-pretty border-l-2 border-primary pl-3">{insight}</p>
    <p className="text-xs text-muted-foreground">Source: {sources}</p>
  </div>
);

const TEMPORAL_DATA = [
  { year: 1990, blind: 28.7, msvi: 154, mild: 220, presbyopia: 400 },
  { year: 2020, blind: 43.3, msvi: 295, mild: 258, presbyopia: 510 },
  { year: 2050, blind: 61.0, msvi: 474, mild: 360, presbyopia: 866 },
];

const TEMPORAL_SERIES = [
  { key: 'blind' as const, label: 'Blindness (M)', color: COLORS[0] },
  { key: 'msvi' as const, label: 'Moderate & Severe VI (M)', color: COLORS[1] },
  { key: 'mild' as const, label: 'Mild VI (M)', color: COLORS[2] },
  { key: 'presbyopia' as const, label: 'Uncorrected Presbyopia (M)', color: COLORS[3] },
];

const Graph1: React.FC = () => {
  const [ref, inView] = useInView();
  const progress = useAnimatedValue(1, inView, 1200);
  const W = 500; const H = 200; const PL = 48; const PR = 12; const PT = 12; const PB = 28;
  const gW = W - PL - PR; const gH = H - PT - PB;
  const allVals = TEMPORAL_DATA.flatMap(d => [d.blind, d.msvi, d.mild, d.presbyopia]);
  const maxVal = Math.max(...allVals);
  const xOf = (i: number) => PL + (i / (TEMPORAL_DATA.length - 1)) * gW;
  const yOf = (v: number) => PT + gH - (v / maxVal) * gH;

  return (
    <GraphCard
      refProp={ref}
      title="Global Vision Impairment Trends (1990–2050)"
      insight="Age-standardised prevalence decreased 28.5% (positive), but absolute numbers rose sharply due to population ageing."
      sources={<SourceLink label="GBD 2019 — The Lancet" url="https://www.thelancet.com/infographics-do/gbd-2019" />}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Temporal trends line chart">
        {[0, 250, 500, 750].map(v => (
          <g key={v}>
            <line x1={PL} y1={yOf(v)} x2={W - PR} y2={yOf(v)} stroke="hsl(var(--border))" strokeWidth="0.5" />
            <text x={PL - 4} y={yOf(v) + 3} textAnchor="end" fontSize="8" fill="hsl(var(--muted-foreground))">{v}</text>
          </g>
        ))}
        {TEMPORAL_DATA.map((d, i) => (
          <text key={d.year} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">{d.year}</text>
        ))}
        {TEMPORAL_SERIES.map(s => {
          const pts = TEMPORAL_DATA.map((d, i) => `${xOf(i)},${yOf(d[s.key])}`).join(' ');
          const totalLen = 300;
          return (
            <polyline
              key={s.key}
              points={pts}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeDasharray={totalLen}
              strokeDashoffset={totalLen * (1 - progress)}
              style={{ transition: 'none' }}
            />
          );
        })}
        {TEMPORAL_SERIES.map(s =>
          TEMPORAL_DATA.map((d, i) => (
            <circle
              key={`${s.key}-${i}`}
              cx={xOf(i)} cy={yOf(d[s.key])} r="3"
              fill={s.color}
              opacity={progress}
            >
              <title>{s.label}: {d[s.key]}M ({d.year})</title>
            </circle>
          ))
        )}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
        {TEMPORAL_SERIES.map(s => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 inline-block shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </GraphCard>
  );
};

const GENDER_DATA = [
  { cat: 'Blindness', female: 23.9, male: 19.4 },
  { cat: 'Moderate & Severe VI', female: 163, male: 132 },
  { cat: 'Mild VI', female: 142, male: 116 },
  { cat: 'Uncorrected Presbyopia', female: 280, male: 230 },
];

const Graph2: React.FC = () => {
  const [ref, inView] = useInView();
  const progress = useAnimatedValue(1, inView, 1000);
  const maxVal = Math.max(...GENDER_DATA.flatMap(d => [d.female, d.male]));
  const barH = 14; const gap = 6; const groupGap = 18; const PL = 130; const W = 500; const PR = 40; const PT = 12; const PB = 8;
  const groupH = barH * 2 + gap;
  const totalH = PT + PB + GENDER_DATA.length * groupH + (GENDER_DATA.length - 1) * groupGap;
  const barW = W - PL - PR;

  return (
    <GraphCard
      refProp={ref}
      title="Gender Disparity in Vision Impairment (2020)"
      insight="Women account for 55% of all vision impairment globally — 112 million more than men."
      sources={
        <>
          <SourceLink label="GBD 2019" url="https://www.thelancet.com/infographics-do/gbd-2019" /> |{' '}
          <SourceLink label="WHO 2019" url="https://www.who.int/publications/i/item/world-report-on-vision" />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${totalH}`} className="w-full" aria-label="Gender disparity paired bar chart">
        {GENDER_DATA.map((d, i) => {
          const y0 = PT + i * (groupH + groupGap);
          return (
            <g key={d.cat}>
              <text x={PL - 6} y={y0 + groupH / 2 + 3} textAnchor="end" fontSize="9" fill="hsl(var(--muted-foreground))">{d.cat.length > 18 ? d.cat.slice(0, 18) + '…' : d.cat}</text>
              <rect x={PL} y={y0} width={(d.female / maxVal) * barW * progress} height={barH} fill={COLORS[0]} rx="1" />
              <text x={PL + (d.female / maxVal) * barW * progress + 3} y={y0 + 10} fontSize="8" fill="hsl(var(--foreground))">{(d.female * progress).toFixed(0)}M</text>
              <rect x={PL} y={y0 + barH + gap} width={(d.male / maxVal) * barW * progress} height={barH} fill={COLORS[1]} rx="1" />
              <text x={PL + (d.male / maxVal) * barW * progress + 3} y={y0 + barH + gap + 10} fontSize="8" fill="hsl(var(--foreground))">{(d.male * progress).toFixed(0)}M</text>
            </g>
          );
        })}
      </svg>
      <div className="flex gap-4 mt-1">
        {[{ label: 'Female', c: COLORS[0] }, { label: 'Male', c: COLORS[1] }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 inline-block shrink-0 rounded-sm" style={{ background: l.c }} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </GraphCard>
  );
};

const REGIONAL_DATA = [
  { region: 'W. Sub-Saharan Africa', val: 11.1 },
  { region: 'E. Sub-Saharan Africa', val: 10.7 },
  { region: 'Southeast Asia', val: 10.0 },
  { region: 'South Asia', val: 6.0 },
  { region: 'High-income countries', val: 1.8 },
];

const Graph3: React.FC = () => {
  const [ref, inView] = useInView();
  const progress = useAnimatedValue(1, inView, 1000);
  const maxVal = 12;
  const barH = 18; const gap = 10; const PL = 130; const W = 500; const PR = 50; const PT = 12; const PB = 8;
  const totalH = PT + PB + REGIONAL_DATA.length * (barH + gap);
  const barW = W - PL - PR;

  return (
    <GraphCard
      refProp={ref}
      title="Regional Blindness Prevalence (per 1,000)"
      insight="90% of global vision impairment occurs in low- and middle-income countries."
      sources={
        <>
          <SourceLink label="GBD 2019" url="https://www.thelancet.com/infographics-do/gbd-2019" /> |{' '}
          <SourceLink label="WHO 2019" url="https://www.who.int/publications/i/item/world-report-on-vision" />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${totalH}`} className="w-full" aria-label="Regional disparities horizontal bar chart">
        {REGIONAL_DATA.map((d, i) => {
          const y = PT + i * (barH + gap);
          const w = (d.val / maxVal) * barW * progress;
          return (
            <g key={d.region}>
              <text x={PL - 6} y={y + 12} textAnchor="end" fontSize="9" fill="hsl(var(--muted-foreground))">{d.region}</text>
              <rect x={PL} y={y} width={w} height={barH} fill={COLORS[i % COLORS.length]} rx="1" />
              <text x={PL + w + 3} y={y + 12} fontSize="9" fill="hsl(var(--foreground))">{(d.val * progress).toFixed(1)}</text>
            </g>
          );
        })}
      </svg>
    </GraphCard>
  );
};

const CHILDREN_DATA = [
  { label: 'Myopia (2023)', val: 65, color: COLORS[0] },
  { label: 'Vision loss (all)', val: 90, color: COLORS[1] },
  { label: 'Uncorr. refract.', val: 448, color: COLORS[2] },
  { label: 'Myopia (2050 proj.)', val: 275, color: COLORS[3] },
];

const Graph4: React.FC = () => {
  const [ref, inView] = useInView();
  const progress = useAnimatedValue(1, inView, 1100);
  const cx = 90; const cy = 90; const R = 65; const r = 38;
  const total = CHILDREN_DATA.reduce((s, d) => s + d.val, 0);
  let startAngle = -Math.PI / 2;

  const slices = CHILDREN_DATA.map(d => {
    const angle = (d.val / total) * Math.PI * 2 * progress;
    const endAngle = startAngle + angle;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);
    const xi1 = cx + r * Math.cos(startAngle);
    const yi1 = cy + r * Math.sin(startAngle);
    const xi2 = cx + r * Math.cos(endAngle);
    const yi2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`;
    const mid = startAngle + angle / 2;
    startAngle = endAngle;
    return { ...d, path, mid };
  });

  return (
    <GraphCard
      refProp={ref}
      title="Children's Vision Data (Millions)"
      insight="Glasses reduce study-related difficulties in children by up to 44%."
      sources={
        <>
          <SourceLink label="GBD 2019" url="https://www.thelancet.com/infographics-do/gbd-2019" /> |{' '}
          <SourceLink label="WHO 2019" url="https://www.who.int/publications/i/item/world-report-on-vision" />
        </>
      }
    >
      <div className="flex flex-col md:flex-row items-center gap-4">
        <svg viewBox="0 0 180 180" className="w-40 shrink-0" aria-label="Children vision donut chart">
          {slices.map(s => (
            <path key={s.label} d={s.path} fill={s.color} stroke="hsl(var(--background))" strokeWidth="1.5">
              <title>{s.label}: {s.val}M</title>
            </path>
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fill="hsl(var(--foreground))" fontWeight="bold">{Math.round(total)}M</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))">total</text>
        </svg>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {slices.map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-3 h-3 shrink-0 rounded-sm" style={{ background: s.color }} />
              <span className="text-xs text-muted-foreground flex-1">{s.label}</span>
              <span className="text-xs font-semibold text-foreground">{s.val}M</span>
            </div>
          ))}
        </div>
      </div>
    </GraphCard>
  );
};

const CAUSES_DATA = [
  { cause: 'Cataract', pct: 42.5 },
  { cause: 'Glaucoma', pct: 10 },
  { cause: 'AMD', pct: 7 },
  { cause: 'Diabetic Retinopathy', pct: 4.5 },
  { cause: 'Trachoma', pct: 3.5 },
  { cause: 'Other', pct: 27.5 },
];

const Graph5: React.FC = () => {
  const [ref, inView] = useInView();
  const progress = useAnimatedValue(1, inView, 1000);
  const W = 480; const H = 52; const PL = 8; const PR = 8;
  const total = CAUSES_DATA.reduce((s, d) => s + d.pct, 0);
  let x = PL;

  return (
    <GraphCard
      refProp={ref}
      title="Causes of Blindness Globally"
      insight="~80% of blindness cases worldwide are preventable or treatable."
      sources={
        <>
          <SourceLink label="GBD 2019" url="https://www.thelancet.com/infographics-do/gbd-2019" /> |{' '}
          <SourceLink label="WHO 2019" url="https://www.who.int/publications/i/item/world-report-on-vision" />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Causes of blindness stacked bar">
        {CAUSES_DATA.map((d, i) => {
          const w = (d.pct / total) * (W - PL - PR) * progress;
          const rx = x;
          x += w;
          return (
            <rect key={d.cause} x={rx} y={12} width={w} height={28} fill={COLORS[i % COLORS.length]} rx="1">
              <title>{d.cause}: ~{d.pct}%</title>
            </rect>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
        {CAUSES_DATA.map((d, i) => (
          <div key={d.cause} className="flex items-center gap-1.5">
            <span className="w-3 h-3 inline-block shrink-0 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-muted-foreground">{d.cause} ~{d.pct}%</span>
          </div>
        ))}
      </div>
    </GraphCard>
  );
};

const MYOPIA_DATA = [
  { year: 2010, val: 1.6 },
  { year: 2020, val: 2.0 },
  { year: 2050, val: 4.9 },
];

const Graph6: React.FC = () => {
  const [ref, inView] = useInView();
  const progress = useAnimatedValue(1, inView, 1200);
  const W = 500; const H = 160; const PL = 40; const PR = 12; const PT = 12; const PB = 28;
  const gW = W - PL - PR; const gH = H - PT - PB;
  const maxVal = 5.5;
  const xOf = (i: number) => PL + (i / (MYOPIA_DATA.length - 1)) * gW;
  const yOf = (v: number) => PT + gH - (v / maxVal) * gH;
  const pts = MYOPIA_DATA.map((d, i) => `${xOf(i)},${yOf(d.val)}`).join(' ');
  const totalLen = 350;

  return (
    <GraphCard
      refProp={ref}
      title="The Myopia Epidemic (Billions)"
      insight='"By 2050 half the global population could be living with myopia — a challenge on a scale hard to imagine."'
      sources={
        <>
          <SourceLink label="IAPB 2023" url="https://international-diabetes-federation.s3.eu-west-1.amazonaws.com/media/uploads/2023/06/WHA76-statement-13.2-Appendix-3-IAPB.pdf" /> |{' '}
          <SourceLink label="WHO 2019" url="https://www.who.int/publications/i/item/world-report-on-vision" />
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Myopia epidemic line chart">
        {[0, 1, 2, 3, 4, 5].map(v => (
          <g key={v}>
            <line x1={PL} y1={yOf(v)} x2={W - PR} y2={yOf(v)} stroke="hsl(var(--border))" strokeWidth="0.5" />
            <text x={PL - 4} y={yOf(v) + 3} textAnchor="end" fontSize="8" fill="hsl(var(--muted-foreground))">{v}B</text>
          </g>
        ))}
        {MYOPIA_DATA.map((d, i) => (
          <text key={d.year} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))">{d.year}</text>
        ))}
        <polyline
          points={`${xOf(0)},${yOf(0)} ` + pts + ` ${xOf(MYOPIA_DATA.length - 1)},${yOf(0)}`}
          fill={COLORS[0]}
          fillOpacity={0.12 * progress}
          stroke="none"
        />
        <polyline
          points={pts}
          fill="none"
          stroke={COLORS[0]}
          strokeWidth="2.5"
          strokeDasharray={totalLen}
          strokeDashoffset={totalLen * (1 - progress)}
        />
        {MYOPIA_DATA.map((d, i) => (
          <g key={d.year}>
            <circle cx={xOf(i)} cy={yOf(d.val)} r="4" fill={COLORS[0]} opacity={progress} />
          </g>
        ))}
      </svg>
    </GraphCard>
  );
};

const EyeHealthGraphs: React.FC = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h2 className="font-bold text-xl text-foreground mb-1 text-balance">Eye Health By The Numbers</h2>
      <p className="text-sm text-muted-foreground text-pretty">{"Global stats on vision impairment — know the data behind the mission."}</p>
    </div>
    <Graph1 />
    <Graph2 />
    <Graph3 />
    <Graph4 />
    <Graph5 />
    <Graph6 />
  </div>
);

export default EyeHealthGraphs;
