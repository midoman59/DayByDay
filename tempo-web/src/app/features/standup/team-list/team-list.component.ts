import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TeamRepository } from '../../../core/services/team-repository';
import { Team } from '../../../core/models/team.model';

@Component({
  selector: 'app-team-list',
  imports: [RouterLink, DecimalPipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamListComponent {
  private readonly repository = inject(TeamRepository);

  readonly teams = signal<Team[]>(this.repository.getAll());

  totalDuration(team: Team): number {
    return team.members.reduce((sum, m) => sum + m.allocatedSeconds, 0);
  }

  deleteTeam(team: Team): void {
    if (!confirm(`Supprimer l'équipe "${team.name}" ?`)) {
      return;
    }
    this.repository.delete(team.id);
    this.teams.set(this.repository.getAll());
  }
}
