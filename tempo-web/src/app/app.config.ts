import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { TeamRepository } from './core/services/team-repository';
import { LocalStorageTeamRepository } from './core/services/local-storage-team-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    // Hash routing : fonctionne sans configuration serveur particulière,
    // quel que soit l'hébergement statique choisi plus tard.
    provideRouter(routes, withHashLocation()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: TeamRepository, useClass: LocalStorageTeamRepository },
  ],
};
