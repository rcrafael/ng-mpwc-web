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

    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // If running locally → use env.json value
    if (isLocal) {
      return this.config.apiHost;  // "http://localhost:8080/api"
    }

    // If accessed from LAN / other host → use machine hostname
    return `http://${window.location.hostname}:8080/api`;

  }

}