import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TeamRepository } from '../../../core/services/team-repository';
import { Team } from '../../../core/models/team.model';
import { CountdownTimerComponent } from '../../../shared/countdown-timer/countdown-timer.component';

@Component({
  selector: 'app-standup-session',
  imports: [RouterLink, CountdownTimerComponent, MatButtonModule, MatIconModule],
  templateUrl: './standup-session.component.html',
  styleUrl: './standup-session.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandupSessionComponent {
  private readonly repository = inject(TeamRepository);
  private readonly router = inject(Router);

  readonly team: Team | undefined;
  readonly currentIndex = signal(0);

  readonly currentMember = computed(() => this.team?.members[this.currentIndex()]);
  readonly isFinished = computed(() => !!this.team && this.currentIndex() >= this.team.members.length);
  readonly nextMember = computed(() => this.team?.members[this.currentIndex() + 1]);

  constructor() {
    const route = inject(ActivatedRoute);
    const id = route.snapshot.paramMap.get('id');
    this.team = id ? this.repository.getById(id) : undefined;

    if (!this.team || this.team.members.length === 0) {
      this.router.navigate(['/standup']);
    }
  }

  goToNext(): void {
    this.currentIndex.update((i) => i + 1);
  }

  goToPrevious(): void {
    this.currentIndex.update((i) => Math.max(0, i - 1));
  }

  restart(): void {
    this.currentIndex.set(0);
  }

  isDone(index: number): boolean {
    return index < this.currentIndex();
  }

  isCurrent(index: number): boolean {
    return index === this.currentIndex();
  }
}
