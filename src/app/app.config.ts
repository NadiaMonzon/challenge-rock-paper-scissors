import type { ApplicationConfig } from '@angular/core';
import { isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { CurrentPlayerStore } from './auth/store/CurrentPlayerStore';
import { LocalStorageRepository } from './shared/storage/repositories/LocalStorageRepository';
import { StorageRepository } from './shared/storage/repositories/StorageRepository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: StorageRepository, useClass: LocalStorageRepository },
    CurrentPlayerStore,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
