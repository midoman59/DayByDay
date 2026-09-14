import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { TeamRepository } from './team-repository';

const STORAGE_KEY = 'tempo.teams';
const LEGACY_STORAGE_KEY = 'daybyday.teams';

@Injectable()
export class LocalStorageTeamRepository extends TeamRepository {
  constructor() {
    super();
    this.migrateLegacyData();
  }

  getAll(): Team[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as Team[];
    } catch {
      return [];
    }
  }

  getById(id: string): Team | undefined {
    return this.getAll().find((team) => team.id === id);
  }

  save(team: Team): Team {
    const teams = this.getAll();
    const index = teams.findIndex((t) => t.id === team.id);
    const now = new Date().toISOString();
    const toSave: Team = {
      ...team,
      updatedAt: now,
      createdAt: team.createdAt ?? now,
    };

    if (index >= 0) {
      teams[index] = toSave;
    } else {
      teams.push(toSave);
    }

    this.persist(teams);
    return toSave;
  }

  delete(id: string): void {
    const teams = this.getAll().filter((team) => team.id !== id);
    this.persist(teams);
  }

  private persist(teams: Team[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  }

  /** Reprend les équipes sauvegardées sous l'ancien nom de l'app (DayByDay) une seule fois. */
  private migrateLegacyData(): void {
    if (localStorage.getItem(STORAGE_KEY) !== null) {
      return;
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === null) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, legacy);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
}
