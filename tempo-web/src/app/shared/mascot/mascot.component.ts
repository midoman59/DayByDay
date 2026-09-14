import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type MascotMood = 'calm' | 'attentive' | 'tense' | 'critical';

const MOOD_THRESHOLDS: { min: number; mood: MascotMood }[] = [
  { min: 0.5, mood: 'calm' },
  { min: 0.25, mood: 'attentive' },
  { min: 0.1, mood: 'tense' },
  { min: 0, mood: 'critical' },
];

@Component({
  selector: 'app-mascot',
  templateUrl: './mascot.component.html',
  styleUrl: './mascot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MascotComponent {
  /** Proportion de temps restant, de 1 (temps plein) à 0 (temps écoulé). */
  remainingRatio = input<number>(1);

  mood = computed<MascotMood>(() => {
    const ratio = this.remainingRatio();
    return MOOD_THRESHOLDS.find((t) => ratio >= t.min)?.mood ?? 'critical';
  });
}
