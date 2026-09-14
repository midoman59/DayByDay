import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { TeamRepository } from './team-repository';

const STORAGE_KEY = 'daybyday.teams';

@Injectable()
export class LocalStorageTeamRepository extends TeamRepository {
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
}
