import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DayByDayStoreService } from '../../../core/services/day-by-day-store.service';

const WEEKDAY_LABELS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

@Component({
  selector: 'app-today-add',
  imports: [FormsModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './today-add.component.html',
  styleUrl: './today-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodayAddComponent {
  private readonly store = inject(DayByDayStoreService);

  readonly query = signal('');

  readonly availableItems = computed(() => {
    const todayIds = new Set(this.store.today().map((e) => e.itemId));
    const q = this.query().trim().toLowerCase();
    return this.store
      .backlog()
      .filter((item) => !todayIds.has(item.id))
      .filter((item) => !q || item.name.toLowerCase().includes(q));
  });

  daysLabel(days: number[]): string {
    return [...days]
      .sort((a, b) => a - b)
      .map((d) => WEEKDAY_LABELS[d])
      .join(', ');
  }

  add(itemId: string): void {
    this.store.addToToday(itemId);
  }
}
