import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CountdownTimerComponent } from '../../shared/countdown-timer/countdown-timer.component';

const PRESETS_MINUTES = [1, 3, 5, 10, 15, 20];

@Component({
  selector: 'app-timer-page',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CountdownTimerComponent,
  ],
  templateUrl: './timer-page.component.html',
  styleUrl: './timer-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPageComponent {
  readonly presets = PRESETS_MINUTES;

  readonly phase = signal<'setup' | 'running'>('setup');
  readonly minutes = signal(5);
  readonly seconds = signal(0);

  readonly durationSeconds = computed(() => this.minutes() * 60 + this.seconds());

  selectPreset(minutes: number): void {
    this.minutes.set(minutes);
    this.seconds.set(0);
  }

  begin(): void {
    if (this.durationSeconds() > 0) {
      this.phase.set('running');
    }
  }

  backToSetup(): void {
    this.phase.set('setup');
  }
}
