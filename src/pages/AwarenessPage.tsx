import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ImpairmentSimulator from '@/components/awareness/ImpairmentSimulator';
import CommunityResources from '@/components/awareness/CommunityResources';
import EyeHealthGraphs from '@/components/awareness/EyeHealthGraphs';

const AwarenessPage: React.FC = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 border-2 border-border px-3 py-1 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Awareness Hub</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance mb-2">{"See Through Different Eyes"}</h1>
        <p className="text-muted-foreground max-w-prose text-pretty">
          Build empathy and understanding by simulating visual impairments, then explore community resources, organisations, and inspirational stories from the eye health world.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <ImpairmentSimulator />
        </div>
        <div className="xl:col-span-2">
          <CommunityResources />
        </div>
      </div>

      {/* 6 animated data graphs */}
      <div className="mt-10">
        <EyeHealthGraphs />
      </div>
    </div>
  </MainLayout>
);

export default AwarenessPage;
