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
  createdAt: string;
  updatedAt: string;
}
