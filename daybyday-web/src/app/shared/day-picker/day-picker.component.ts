import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

interface DayOption {
  value: number;
  label: string;
}

// Affichage lundi -> dimanche, valeurs alignées sur Date#getDay() (0 = dimanche).
const DAY_OPTIONS: DayOption[] = [
  { value: 1, label: 'L' },
  { value: 2, label: 'M' },
  { value: 3, label: 'M' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
  { value: 6, label: 'S' },
  { value: 0, label: 'D' },
];

@Component({
  selector: 'app-day-picker',
  imports: [MatRippleModule],
  templateUrl: './day-picker.component.html',
  styleUrl: './day-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayPickerComponent {
  readonly days = DAY_OPTIONS;

  /** Jours sélectionnés (convention Date#getDay() : 0 = dimanche ... 6 = samedi). */
  value = model.required<number[]>();

  isSelected(day: number): boolean {
    return this.value().includes(day);
  }

  toggle(day: number): void {
    this.value.update((list) => (list.includes(day) ? list.filter((d) => d !== day) : [...list, day]));
  }
}
