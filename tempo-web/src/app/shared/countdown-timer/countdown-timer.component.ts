import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { MascotComponent } from '../mascot/mascot.component';

@Component({
  selector: 'app-countdown-timer',
  imports: [MascotComponent],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownTimerComponent {
  /** Durée totale en secondes. Changer cette valeur réinitialise le compteur. */
  durationSeconds = input.required<number>();
  /** Démarre automatiquement dès que la durée est (ré)initialisée. */
  autoStart = input<boolean>(false);
  showMascot = input<boolean>(true);
  showControls = input<boolean>(true);

  /** Émis une seule fois, au moment exact où le temps restant atteint 0. */
  finished = output<void>();

  private readonly destroyRef = inject(DestroyRef);
  private intervalId: ReturnType<typeof setInterval> | undefined;

  readonly remainingSeconds = signal(0);
  readonly running = signal(false);

  readonly remainingRatio = computed(() => {
    const total = this.durationSeconds();
    if (total <= 0) {
      return 0;
    }
    return Math.min(1, Math.max(0, this.remainingSeconds() / total));
  });

  readonly isOvertime = computed(() => this.remainingSeconds() < 0);

  readonly display = computed(() => {
    const totalAbs = Math.abs(Math.round(this.remainingSeconds()));
    const minutes = Math.floor(totalAbs / 60);
    const seconds = totalAbs % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  constructor() {
    // Toute (ré)affectation de durationSeconds réinitialise et redémarre si demandé.
    // Les écritures (et les lectures internes à start(), comme running()) sont volontairement
    // faites hors suivi réactif : sans untracked(), l'effet se redéclencherait sur lui-même en boucle.
    effect(() => {
      const duration = this.durationSeconds();
      const shouldAutoStart = this.autoStart();
      untracked(() => {
        this.stopInterval();
        this.remainingSeconds.set(duration);
        this.running.set(false);
        if (shouldAutoStart) {
          this.start();
        }
      });
    });

    this.destroyRef.onDestroy(() => this.stopInterval());
  }

  start(): void {
    if (this.running()) {
      return;
    }
    this.running.set(true);
    this.intervalId = setInterval(() => {
      this.remainingSeconds.update((s) => s - 1);
      if (this.remainingSeconds() === 0) {
        this.finished.emit();
      }
    }, 1000);
  }

  pause(): void {
    this.running.set(false);
    this.stopInterval();
  }

  reset(): void {
    this.stopInterval();
    this.remainingSeconds.set(this.durationSeconds());
    this.running.set(false);
  }

  private stopInterval(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
