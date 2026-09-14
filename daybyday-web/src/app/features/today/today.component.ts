import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { DayByDayStoreService } from '../../core/services/day-by-day-store.service';
import { Item } from '../../core/models/item.model';

interface TodayRow {
  itemId: string;
  done: boolean;
  item: Item;
}

@Component({
  selector: 'app-today',
  imports: [FormsModule, RouterLink, MatButtonModule, MatCheckboxModule, MatIconModule],
  templateUrl: './today.component.html',
  styleUrl: './today.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodayComponent {
  private readonly store = inject(DayByDayStoreService);

  readonly dateLabel = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  readonly quickAddName = signal('');

  readonly rows = computed<TodayRow[]>(() =>
    this.store
      .today()
      .map((entry) => {
        const item = this.store.getItem(entry.itemId);
        return item ? { itemId: entry.itemId, done: entry.done, item } : null;
      })
      .filter((row): row is TodayRow => row !== null),
  );

  quickAdd(): void {
    const name = this.quickAddName().trim();
    if (!name) {
      return;
    }
    this.store.addNewTaskToToday(name);
    this.quickAddName.set('');
  }

  toggleDone(itemId: string): void {
    this.store.toggleDone(itemId);
  }

  remove(itemId: string): void {
    this.store.removeFromToday(itemId);
  }
}
