// Vision Fair shared types
export interface VFStop {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
}

export interface VFResult {
  stopId: number;
  label: string;
  value: string;
  concern: boolean;
}

export const stops: VFStop[] = [
  { id: 1, name: 'Visual Acuity', subtitle: 'Snellen Chart', icon: '📋' },
  { id: 2, name: 'Amsler Grid', subtitle: 'Macular Check', icon: '⊞' },
  { id: 3, name: 'Pupil Symmetry', subtitle: 'Anisocoria Screen', icon: '◉' },
  { id: 4, name: 'Eye Motility', subtitle: 'Tracking Test', icon: '👁' },
  { id: 5, name: 'Symptom Check', subtitle: 'Self-Assessment', icon: '📋' },
];
