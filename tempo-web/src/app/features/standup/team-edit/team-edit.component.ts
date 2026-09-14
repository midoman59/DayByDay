import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeamRepository } from '../../../core/services/team-repository';
import { Team, TeamMember } from '../../../core/models/team.model';

interface MemberDraft {
  id: string;
  name: string;
  allocatedMinutes: number;
}

const DEFAULT_MINUTES_PER_MEMBER = 3;

function createId(): string {
  return crypto.randomUUID();
}

@Component({
  selector: 'app-team-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamEditComponent {
  private readonly repository = inject(TeamRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly editingTeamId: string | null;
  private readonly createdAt: string;

  readonly teamName = signal('');
  readonly members = signal<MemberDraft[]>([]);
  readonly isEditing: boolean;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const existing = id ? this.repository.getById(id) : undefined;

    this.editingTeamId = existing?.id ?? null;
    this.isEditing = this.editingTeamId !== null;
    this.createdAt = existing?.createdAt ?? new Date().toISOString();
    this.teamName.set(existing?.name ?? '');
    this.members.set(
      existing?.members.map((m) => ({
        id: m.id,
        name: m.name,
        allocatedMinutes: m.allocatedSeconds / 60,
      })) ?? [],
    );
  }

  addMember(): void {
    this.members.update((list) => [
      ...list,
      { id: createId(), name: '', allocatedMinutes: DEFAULT_MINUTES_PER_MEMBER },
    ]);
  }

  removeMember(member: MemberDraft): void {
    this.members.update((list) => list.filter((m) => m.id !== member.id));
  }

  get canSave(): boolean {
    return this.teamName().trim().length > 0 && this.members().length > 0 && this.members().every((m) => m.name.trim().length > 0 && m.allocatedMinutes > 0);
  }

  save(): void {
    if (!this.canSave) {
      return;
    }

    const team: Team = {
      id: this.editingTeamId ?? createId(),
      name: this.teamName().trim(),
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString(),
      members: this.members().map(
        (m): TeamMember => ({
          id: m.id,
          name: m.name.trim(),
          allocatedSeconds: Math.round(m.allocatedMinutes * 60),
        }),
      ),
    };

    this.repository.save(team);
    this.router.navigate(['/standup']);
  }
}
