import React, { useState, useCallback } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MAPS_API_KEY = 'AIzaSyB_LJOYJL-84SMuxNB7LtRGhxEQLjswvy0';

const FindCarePage: React.FC = () => {
  const [location, setLocation] = useState('');
  const [mapQuery, setMapQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(() => {
    const q = location.trim();
    if (!q) return;
    setLoading(true);
    setMapQuery(`optometrist ophthalmologist eye care near ${q}`);
    setSearched(true);
    setTimeout(() => setLoading(false), 800);
  }, [location]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 border-2 border-border px-3 py-1 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Find Eye Care</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance mb-2">
            Find Optometrists Near You
          </h1>
          <p className="text-muted-foreground max-w-prose text-pretty">
            Search for optometrists and ophthalmologists — powered by Google Maps.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-6 max-w-2xl">
          <Input
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Enter city, suburb, or postcode…"
            className="border-2 border-border text-base"
            aria-label="Location search"
          />
          <Button
            onClick={handleSearch}
            disabled={loading || !location.trim()}
            className="border-2 border-primary shrink-0"
          >
            {loading ? 'Searching…' : 'Search'}
          </Button>
        </div>

        {/* Map */}
        <div className="border-2 border-border overflow-hidden w-full bg-muted" style={{ height: 560 }}>
          {searched ? (
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/search?key=${MAPS_API_KEY}&q=${encodeURIComponent(mapQuery)}&language=en`}
              allowFullScreen
              title="Eye care clinics map"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-5xl mb-3" aria-hidden="true">🗺</div>
                <p className="text-muted-foreground text-sm">Enter a location above to see clinics on the map</p>
              </div>
            </div>
          )}
        </div>

        {/* When to visit tip box */}
        <div className="border-2 border-border bg-card p-4 mt-6 max-w-3xl">
          <h3 className="font-semibold text-sm text-foreground mb-2 text-balance">When to Visit an Eye Care Professional</h3>
          <ul className="space-y-1">
            {[
              'Annually if you are 40+, have diabetes, or a family history of glaucoma',
              'Every 2 years for healthy adults aged 18–39',
              'Immediately for: sudden vision loss, new floaters/flashes, eye pain, or a "curtain" effect',
              'Children: first exam at 6 months, age 3, and before starting school',
            ].map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary shrink-0">›</span>
                <span className="text-pretty">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default FindCarePage;
