import { Team } from '../models/team.model';

/**
 * Abstraction du stockage des équipes.
 * L'implémentation V1 utilise le localStorage ; une future implémentation
 * pourra appeler un backend sans changer le reste de l'application.
 */
export abstract class TeamRepository {
  abstract getAll(): Team[];
  abstract getById(id: string): Team | undefined;
  abstract save(team: Team): Team;
  abstract delete(id: string): void;
}
