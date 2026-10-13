import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layouts/MainLayout';
import eyeterraHero from '@/assets/eyeterra-hero.png';

const EyeIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const CompassIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const features: { Icon: React.FC; title: string; desc: string; path: string; cta: string }[] = [
  {
    Icon: ShieldIcon,
    title: 'Daily Habits',
    desc: 'Build four daily habits — timer, exercises, nutrition, workstation — with a nightly Eye Integrity Score.',
    path: '/daily-habits',
    cta: 'Start Today',
  },
  {
    Icon: EyeIcon,
    title: 'Awareness Hub',
    desc: 'Simulate visual impairments on real images and explore community, inspirational stories, and apps.',
    path: '/awareness',
    cta: 'Explore',
  },
  {
    Icon: CompassIcon,
    title: 'Vision Tour',
    desc: 'Six interactive stops: acuity test, Amsler grid, pupil check, motility, symptom quiz, and photo analysis.',
    path: '/vision-tour',
    cta: 'Take the Tour',
  },
  {
    Icon: ChartIcon,
    title: 'Find Eye Care',
    desc: 'Locate optometrists and ophthalmologists near you with live Google reviews.',
    path: '/find-care',
    cta: 'Find a Clinic',
  },
];

const HomePage: React.FC = () => (
  <MainLayout>
    {/* Hero */}
    <section className="border-b-2 border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 border-2 border-primary px-3 py-1 mb-6">

            <span className="text-xs font-bold uppercase tracking-widest text-primary">{"Eyeterra"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight mb-4">{"Protecting vision shouldn't be just a vision"}</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-prose mb-8">{"Your eye health companion — covering prevention, symptom awareness, vision screening, disorder awareness, and specialised navigation."}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="border-2 border-primary">
              <Link to="/daily-habits">Start Daily Habits</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-border">
              <Link to="/vision-tour">Take Vision Tour</Link>
            </Button>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center">
          <img
            src={eyeterraHero}
            alt="Eyeterra eye health logo"
            className="w-48 h-48 md:w-64 md:h-64 opacity-90" />
        </div>
      </div>
    </section>

    {/* Feature cards */}
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
      <h2 className="text-2xl font-bold text-foreground mb-2 text-balance">{"Everything your eyes deserve"}</h2>
      <p className="text-muted-foreground mb-8 text-pretty">One place for daily care, awareness, self-screening, and professional connections.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map(f => (
          <div
            key={f.path}
            className="bg-card border-2 border-border p-6 flex flex-col h-full"
          >
            <div className="text-primary mb-3"><f.Icon /></div>
            <h3 className="text-xl font-bold text-foreground mb-2 text-balance">{f.title}</h3>
            <p className="text-muted-foreground text-pretty flex-1 mb-4">{f.desc}</p>
            <Button asChild variant="outline" className="self-start border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-auto">
              <Link to={f.path}>{f.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>

    {/* Disclaimer */}
    <section className="border-t-2 border-border bg-muted">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
        <p className="text-sm text-muted-foreground text-center text-pretty">{"Eyeterra is for educational and preventive use. It is not a medical device and does not provide clinical diagnoses. Always consult a licensed eye care professional for any concerns about your vision or eye health."}</p>
      </div>
    </section>
  </MainLayout>
);

export default HomePage;
