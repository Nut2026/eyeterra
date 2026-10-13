import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { getLocalToday, setLocalToday } from '@/lib/storage';

interface NutrientItem {
  name: string;
  why: string;
  foods: string[];
  icon: string;
}

const nutrients: NutrientItem[] = [
  {
    name: 'Lutein & Zeaxanthin',
    why: 'Act as internal sunglasses — filter harmful blue light, protect macula',
    foods: ['Kale', 'Spinach', 'Egg yolks', 'Corn', 'Broccoli'],
    icon: '🥬',
  },
  {
    name: 'Vitamin A',
    why: 'Essential for rhodopsin production — critical for night vision',
    foods: ['Carrots', 'Sweet potato', 'Liver', 'Butternut squash', 'Pumpkin'],
    icon: '🥕',
  },
  {
    name: 'Omega-3 Fatty Acids',
    why: 'Form structural component of retina, reduce dry eye symptoms',
    foods: ['Salmon', 'Mackerel', 'Sardines', 'Walnuts', 'Flaxseed'],
    icon: '🐟',
  },
  {
    name: 'Vitamin C',
    why: 'Antioxidant protecting against UV damage; linked to lower cataract risk',
    foods: ['Bell peppers', 'Citrus fruits', 'Guava', 'Kiwi', 'Strawberries'],
    icon: '🍋',
  },
  {
    name: 'Vitamin E',
    why: 'Protects eye cell membranes from oxidative damage',
    foods: ['Almonds', 'Sunflower seeds', 'Avocado', 'Hazelnuts', 'Olive oil'],
    icon: '🥑',
  },
  {
    name: 'Zinc',
    why: 'Transports Vitamin A from liver to retina; protects against macular degeneration',
    foods: ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas', 'Cashews'],
    icon: '🦪',
  },
];

const DAILY_TARGET = 3;

const NutritionGuide: React.FC = () => {
  const [eaten, setEaten] = useState<string[]>(
    () => getLocalToday('nutrition-eaten', []) as string[]
  );

  const toggleFood = (food: string) => {
    setEaten(prev => {
      const next = prev.includes(food) ? prev.filter(f => f !== food) : [...prev, food];
      setLocalToday('nutrition-eaten', next);
      window.dispatchEvent(new CustomEvent('eyeterra-score-update'));
      return next;
    });
  };

  const count = eaten.length;
  const targetMet = count >= DAILY_TARGET;

  return (
    <div className="bg-background border-2 border-border p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-lg text-foreground">Eye Nutrition</h3>
        <div className="flex items-center gap-2">
          <Badge variant={targetMet ? 'default' : 'secondary'} className="border border-border text-xs">
            {count} / {DAILY_TARGET}+ foods today
          </Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 text-pretty">{"Six key nutrients that directly support eye health. Check off the foods you had today."}</p>
      <div className="grid grid-cols-1 gap-3">
        {nutrients.map(n => (
          <div key={n.name} className="border-2 border-border bg-muted/30">
            {/* Nutrient header — always visible */}
            <div className="p-3 flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{n.name}</p>
                <p className="text-xs text-muted-foreground text-pretty">{n.why}</p>
              </div>
            </div>
            {/* Food checklist — always open */}
            <div className="border-t-2 border-border px-4 py-3 bg-background">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Top food sources
              </p>
              <div className="flex flex-col gap-1.5">
                {n.foods.map(food => {
                  const checked = eaten.includes(food);
                  return (
                    <label
                      key={food}
                      className="flex items-center gap-2.5 cursor-pointer group select-none"
                    >
                      <button
                        role="checkbox"
                        aria-checked={checked}
                        aria-label={food}
                        onClick={() => toggleFood(food)}
                        className={`w-4 h-4 border-2 shrink-0 flex items-center justify-center transition-colors ${
                          checked ? 'bg-primary border-primary' : 'border-border bg-background'
                        }`}
                      >
                        {checked && (
                          <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
                            <polyline points="1,4.5 3.5,7 8,2" stroke="white" strokeWidth="1.8" fill="none" />
                          </svg>
                        )}
                      </button>
                      <span className={`text-sm transition-colors ${
                        checked ? 'line-through text-muted-foreground' : 'text-foreground group-hover:text-primary'
                      }`}>
                        {food}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 italic">
        Daily dietary variety is more effective than supplements alone. Consult your GP before starting supplements.
      </p>
    </div>
  );
};

export default NutritionGuide;
