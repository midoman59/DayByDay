export interface TeamMember {
  id: string;
  name: string;
  /** Temps alloué pour ce membre, en secondes. */
  allocatedSeconds: number;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  /** Si défini, tous les membres partagent ce même temps (en secondes) plutôt qu'un temps individuel. */
  uniformSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}
