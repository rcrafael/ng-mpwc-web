import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ 
     providedIn: 'root' 
})
export class EnvService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get('/assets/env.json')).then(config => {
          this.config = config;
        });
  }

  get apiHost(): string {
    return this.config?.apiHost;
  }

  // Add getters for other keys as needed
}