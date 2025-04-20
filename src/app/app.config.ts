import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './interceptor/http.interceptor';
import { EnvService } from './services/apis/env.service';

export function initConfig(envService: EnvService) {
  return () => envService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideAnimations(),
    EnvService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [EnvService],
      multi: true
    }
  ]
};
