import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding lets book-detail receive :id as a component input().
    // withHashLocation keeps client-side routes working on static hosting (GitHub
    // Pages): routes live after the '#', so a hard refresh or bookmark of any route
    // resolves without a server rewrite — and it won't collide with the Hugo site.
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
  ],
};
