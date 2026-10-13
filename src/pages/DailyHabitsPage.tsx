import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Timer2020 from '@/components/daily/Timer2020';
import EyeExercises from '@/components/daily/EyeExercises';
import NutritionGuide from '@/components/daily/NutritionGuide';
import WorkstationSetup from '@/components/daily/WorkstationSetup';
import EyeIntegrityScore from '@/components/daily/EyeIntegrityScore';

const DailyHabitsPage: React.FC = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 border-2 border-border px-3 py-1 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Daily Habits</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance mb-2">Build Your Eye Health Habits</h1>
        <p className="text-muted-foreground max-w-prose text-pretty">
          Four cornerstones of daily eye care — timer breaks, targeted exercises, nutrition awareness, and workstation ergonomics. Your Eye Integrity Score updates as you tick things off.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Timer2020 />
          <EyeExercises />
          <NutritionGuide />
          <WorkstationSetup />
        </div>

        {/* Score sidebar */}
        <div className="flex flex-col gap-6">
          <EyeIntegrityScore />
          {/* Tips card */}
          <div className="bg-card border-2 border-border p-5">
            <h3 className="font-bold text-base text-foreground mb-3 text-balance">Quick Tips</h3>
            <ul className="space-y-2">
              {[
                'Blink fully every 5 seconds — screen workers blink ⅓ as often as normal.',
                'Artificial tears (preservative-free) are safe to use anytime your eyes feel dry.',
                'Outdoor time — 2 hours/day — is the strongest known protection against myopia progression in children.',
                'Sleep 7–9 hrs: most tear replenishment and corneal healing happens during deep sleep.',
                'Annual eye exams catch glaucoma and macular degeneration before symptoms appear.',
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold shrink-0 mt-0.5">›</span>
                  <span className="text-pretty">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
);

export default DailyHabitsPage;
