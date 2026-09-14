export type ItemType = 'task' | 'habit';

export interface TaskItem {
  id: string;
  type: 'task';
  name: string;
  createdAt: string;
}

export interface HabitItem {
  id: string;
  type: 'habit';
  name: string;
  /** 0 = dimanche ... 6 = samedi (convention JS Date#getDay). */
  daysOfWeek: number[];
  createdAt: string;
}

export type Item = TaskItem | HabitItem;

export interface TodayEntry {
  itemId: string;
  done: boolean;
}

export interface AppState {
  backlog: Item[];
  today: TodayEntry[];
  /** Dernier jour connu, format YYYY-MM-DD (heure locale). */
  currentDayKey: string;
}
