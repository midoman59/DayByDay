import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DayByDayStoreService } from '../../core/services/day-by-day-store.service';
import { Item } from '../../core/models/item.model';

const WEEKDAY_LABELS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

@Component({
  selector: 'app-backlog',
  imports: [FormsModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BacklogComponent {
  private readonly store = inject(DayByDayStoreService);

  readonly query = signal('');

  readonly items = computed<Item[]>(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.store.backlog();
    return q ? all.filter((item) => item.name.toLowerCase().includes(q)) : all;
  });

  daysLabel(days: number[]): string {
    return [...days]
      .sort((a, b) => a - b)
      .map((d) => WEEKDAY_LABELS[d])
      .join(', ');
  }

  remove(item: Item): void {
    if (!confirm(`Supprimer définitivement "${item.name}" ?`)) {
      return;
    }
    this.store.deleteItem(item.id);
  }
}
