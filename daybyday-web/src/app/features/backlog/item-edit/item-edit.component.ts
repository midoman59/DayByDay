import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DayByDayStoreService } from '../../../core/services/day-by-day-store.service';
import { ItemType } from '../../../core/models/item.model';
import { DayPickerComponent } from '../../../shared/day-picker/day-picker.component';

@Component({
  selector: 'app-item-edit',
  imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, DayPickerComponent],
  templateUrl: './item-edit.component.html',
  styleUrl: './item-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemEditComponent {
  private readonly store = inject(DayByDayStoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isEditing: boolean;
  readonly type = signal<ItemType>('task');
  readonly name = signal('');
  readonly daysOfWeek = signal<number[]>([]);

  private readonly editingId: string | null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const existing = id ? this.store.getItem(id) : undefined;

    this.editingId = existing?.id ?? null;
    this.isEditing = this.editingId !== null;

    if (existing) {
      this.type.set(existing.type);
      this.name.set(existing.name);
      if (existing.type === 'habit') {
        this.daysOfWeek.set(existing.daysOfWeek);
      }
    }
  }

  get canSave(): boolean {
    if (!this.name().trim()) {
      return false;
    }
    if (this.type() === 'habit' && this.daysOfWeek().length === 0) {
      return false;
    }
    return true;
  }

  save(): void {
    if (!this.canSave) {
      return;
    }

    if (this.editingId) {
      if (this.type() === 'habit') {
        this.store.updateHabit(this.editingId, this.name(), this.daysOfWeek());
      } else {
        this.store.updateTaskName(this.editingId, this.name());
      }
    } else {
      if (this.type() === 'habit') {
        this.store.addHabit(this.name(), this.daysOfWeek());
      } else {
        this.store.addTask(this.name());
      }
    }

    this.router.navigate(['/backlog']);
  }
}
