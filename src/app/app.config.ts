import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr} from 'ngx-toastr';
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
    provideToastr({
      timeOut: 10000,
      extendedTimeOut: 5000,
      disableTimeOut: false,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right',
      newestOnTop: true,
      tapToDismiss: true,
      maxOpened: 5
    }),
    EnvService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [EnvService],
      multi: true
    }
  ]
};
