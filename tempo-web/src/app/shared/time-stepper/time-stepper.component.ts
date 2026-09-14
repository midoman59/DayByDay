import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-time-stepper',
  imports: [MatIconButton],
  templateUrl: './time-stepper.component.html',
  styleUrl: './time-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeStepperComponent {
  /** Valeur en minutes. */
  value = model.required<number>();
  min = input(0.5);
  step = input(0.5);

  increment(): void {
    this.value.update((v) => this.round(v + this.step()));
  }

  decrement(): void {
    this.value.update((v) => Math.max(this.min(), this.round(v - this.step())));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
