import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── Data ──────────────────────────────────────────────────────────────────

const groups = [
  { name: 'Glaucoma UK Digital Support Groups', platform: 'Zoom', url: 'https://glaucoma.uk/care-support/support-groups/' },
  { name: 'Right Hear Meetups', platform: 'Zoom', url: 'https://www.right-hear.com/community/' },
  { name: 'VisionAware', platform: 'Facebook', url: 'https://www.facebook.com/VisionAWARE' },
  { name: 'FamilyConnect', platform: 'Facebook', url: 'https://www.facebook.com/FamilyConnect/' },
];

const newsletters = [
  { name: 'The Eye Health Connection (NIH/NEI)', url: 'https://www.nei.nih.gov/about/education-and-outreach/eye-health-connection-newsletter' },
  { name: 'Top Tech Tidbits', url: 'https://toptechtidbits.com' },
  { name: 'Blind Citizens Australia', url: 'https://www.bca.org.au/links/email-lists-of-interest/' },
];

const inspirational = [
  {
    title: 'How Vision Loss Helped Me See the World in a New Light',
    quote: '"My story became one of acceptance, adjustment, happiness, and hope."',
    url: 'https://med.stanford.edu/medicalgiving/news/how-vision-loss-helped-me-see-the-world-in-a-new-light.html',
  },
  {
    title: 'I lost an eye, but I refuse to be a victim',
    quote: '"You don\'t lose 50% of sight, you lose about 20-25%."',
    url: 'https://www.bbc.com/news/articles/c4g05mz9j1mo',
  },
  {
    title: "Kesh's Glaucoma Journey",
    quote: '"Be kind to yourself, stay curious, and don\'t be afraid to ask for help."',
    url: 'https://glaucoma.uk/stories/keshs-story/',
  },
  {
    title: 'Eyes on Success',
    quote: 'Empowering the visually impaired',
    url: 'https://www.eyesonsuccess.net/',
  },
];

const apps = [
  {
    name: 'Seeing AI',
    platform: 'iOS & Android',
    function: 'Reads text, describes scenes',
    feature: 'Identifies currency, handwriting',
    url: 'https://www.microsoft.com/en-us/seeing-ai',
  },
  {
    name: 'Be My Eyes',
    platform: 'iOS & Android',
    function: 'Live volunteer video call',
    feature: '24/7 free assistance',
    url: 'https://www.bemyeyes.com',
  },
  {
    name: 'weZoom Magnifying Glass',
    platform: 'Android',
    function: 'Magnifier with contrast',
    feature: 'Presets for low vision',
    url: 'https://play.google.com/store/apps/details?id=de.stoehr.loviapps.wezoom',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

const ExternalLink: React.FC<{ href: string; label?: string }> = ({ href, label = 'Visit →' }) => (
  <Button asChild variant="outline" size="sm" className="self-start text-xs border-2 border-border mt-auto">
    <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
  </Button>
);

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 mt-4 first:mt-0">{children}</h4>
);

// ─── Component ────────────────────────────────────────────────────────────

const CommunityResources: React.FC = () => (
  <div className="bg-background border-2 border-border p-5 flex flex-col">
    <h3 className="font-bold text-lg text-foreground mb-1">Community Resources</h3>
    <p className="text-sm text-muted-foreground mb-4 text-pretty">
      Support groups, newsletters, inspirational stories, and assistive apps for eye health.
    </p>

    {/* Groups */}
    <SectionHeading>Groups</SectionHeading>
    <div className="flex flex-col gap-2 mb-2">
      {groups.map(g => (
        <div key={g.url} className="border border-border bg-card p-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-foreground text-balance">{g.name}</p>
            <Badge variant="outline" className="text-xs">{g.platform}</Badge>
          </div>
          <ExternalLink href={g.url} />
        </div>
      ))}
    </div>

    {/* Newsletters */}
    <SectionHeading>Newsletters</SectionHeading>
    <div className="flex flex-col gap-2 mb-2">
      {newsletters.map(n => (
        <div key={n.url} className="border border-border bg-card p-3 flex flex-col gap-1.5">
          <p className="text-sm font-medium text-foreground text-balance">{n.name}</p>
          <ExternalLink href={n.url} />
        </div>
      ))}
    </div>

    {/* Inspirational */}
    <SectionHeading>Inspirational</SectionHeading>
    <div className="flex flex-col gap-2 mb-2">
      {inspirational.map(s => (
        <div key={s.url} className="border border-border bg-card p-3 flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-foreground text-balance">{s.title}</p>
          <p className="text-xs text-muted-foreground italic text-pretty">{s.quote}</p>
          <ExternalLink href={s.url} />
        </div>
      ))}
    </div>

    {/* Apps */}
    <SectionHeading>Apps</SectionHeading>
    <div className="flex flex-col gap-2">
      {apps.map(a => (
        <div key={a.url} className="border border-border bg-card p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground">{a.name}</p>
            <Badge variant="outline" className="text-xs">{a.platform}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{a.function} — <span className="text-foreground/80">{a.feature}</span></p>
          <ExternalLink href={a.url} />
        </div>
      ))}
    </div>
  </div>
);

export default CommunityResources;
