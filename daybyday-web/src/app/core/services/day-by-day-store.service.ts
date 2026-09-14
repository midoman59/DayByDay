import { Injectable, signal } from '@angular/core';
import { AppState, HabitItem, Item, TaskItem, TodayEntry } from '../models/item.model';

const STORAGE_KEY = 'daybyday.state';

function createId(): string {
  return crypto.randomUUID();
}

function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

@Injectable({ providedIn: 'root' })
export class DayByDayStoreService {
  private readonly backlogSignal = signal<Item[]>([]);
  private readonly todaySignal = signal<TodayEntry[]>([]);
  private readonly currentDayKeySignal = signal('');

  readonly backlog = this.backlogSignal.asReadonly();
  readonly today = this.todaySignal.asReadonly();

  constructor() {
    const state = this.loadState();
    this.backlogSignal.set(state.backlog);
    this.todaySignal.set(state.today);
    this.currentDayKeySignal.set(state.currentDayKey);
    this.rolloverIfNeeded();
  }

  getItem(id: string): Item | undefined {
    return this.backlogSignal().find((i) => i.id === id);
  }

  addTask(name: string): TaskItem {
    const item: TaskItem = { id: createId(), type: 'task', name: name.trim(), createdAt: new Date().toISOString() };
    this.backlogSignal.update((list) => [...list, item]);
    this.persist();
    return item;
  }

  addHabit(name: string, daysOfWeek: number[]): HabitItem {
    const sorted = [...daysOfWeek].sort((a, b) => a - b);
    const item: HabitItem = {
      id: createId(),
      type: 'habit',
      name: name.trim(),
      daysOfWeek: sorted,
      createdAt: new Date().toISOString(),
    };
    this.backlogSignal.update((list) => [...list, item]);
    this.persist();
    // Si l'habitude est prévue aujourd'hui, elle rejoint Today immédiatement
    // plutôt que d'attendre le prochain changement de jour.
    if (sorted.includes(new Date().getDay())) {
      this.addToToday(item.id);
    }
    return item;
  }

  /** Crée directement une Task et l'ajoute à Today (elle rejoint aussi le Backlog). */
  addNewTaskToToday(name: string): void {
    const item = this.addTask(name);
    this.addToToday(item.id);
  }

  addToToday(itemId: string): void {
    if (this.todaySignal().some((e) => e.itemId === itemId)) {
      return;
    }
    this.todaySignal.update((list) => [...list, { itemId, done: false }]);
    this.persist();
  }

  removeFromToday(itemId: string): void {
    this.todaySignal.update((list) => list.filter((e) => e.itemId !== itemId));
    this.persist();
  }

  toggleDone(itemId: string): void {
    this.todaySignal.update((list) => list.map((e) => (e.itemId === itemId ? { ...e, done: !e.done } : e)));
    this.persist();
  }

  /** Suppression définitive depuis le Backlog (retire aussi l'occurrence dans Today). */
  deleteItem(itemId: string): void {
    this.backlogSignal.update((list) => list.filter((i) => i.id !== itemId));
    this.todaySignal.update((list) => list.filter((e) => e.itemId !== itemId));
    this.persist();
  }

  updateTaskName(id: string, name: string): void {
    this.backlogSignal.update((list) => list.map((i) => (i.id === id && i.type === 'task' ? { ...i, name: name.trim() } : i)));
    this.persist();
  }

  updateHabit(id: string, name: string, daysOfWeek: number[]): void {
    const sorted = [...daysOfWeek].sort((a, b) => a - b);
    this.backlogSignal.update((list) =>
      list.map((i) => (i.id === id && i.type === 'habit' ? { ...i, name: name.trim(), daysOfWeek: sorted } : i)),
    );
    const weekday = new Date().getDay();
    if (!sorted.includes(weekday)) {
      // Retirée immédiatement de Today si le jour actuel n'est plus prévu.
      this.removeFromToday(id);
    } else if (!this.todaySignal().some((e) => e.itemId === id)) {
      // À l'inverse, si le jour actuel vient d'être ajouté, elle rejoint Today immédiatement.
      this.addToToday(id);
    } else {
      this.persist();
    }
  }

  private rolloverIfNeeded(): void {
    const nowKey = dayKey(new Date());
    if (this.currentDayKeySignal() === nowKey) {
      return;
    }

    const doneTaskIds = new Set(this.todaySignal().filter((e) => e.done).map((e) => e.itemId));

    const survivors = this.backlogSignal().filter((item) => !(item.type === 'task' && doneTaskIds.has(item.id)));

    const weekday = new Date().getDay();
    const freshToday: TodayEntry[] = survivors
      .filter((item): item is HabitItem => item.type === 'habit' && item.daysOfWeek.includes(weekday))
      .map((h) => ({ itemId: h.id, done: false }));

    this.backlogSignal.set(survivors);
    this.todaySignal.set(freshToday);
    this.currentDayKeySignal.set(nowKey);
    this.persist();
  }

  private persist(): void {
    const state: AppState = {
      backlog: this.backlogSignal(),
      today: this.todaySignal(),
      currentDayKey: this.currentDayKeySignal(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private loadState(): AppState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { backlog: [], today: [], currentDayKey: '' };
    }
    try {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return {
        backlog: parsed.backlog ?? [],
        today: parsed.today ?? [],
        currentDayKey: parsed.currentDayKey ?? '',
      };
    } catch {
      return { backlog: [], today: [], currentDayKey: '' };
    }
  }
}
