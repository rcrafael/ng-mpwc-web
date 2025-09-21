import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { firstValueFrom } from 'rxjs';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { ILogin } from '../models/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: ApiService) { }

  login(params:ILogin): Promise<IAPIResponse> {
    return firstValueFrom(this.http.login(params));
  }

  getUserId(): string {
    return (window as any).userId || '';
  }

  getUserName(): string {
    return (window as any).userName || '';
  }

  getUsernameById(id: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getUsername(id));
  }

  getToken(): String {
    return localStorage.getItem('accessToken') || '';
  }

  isValidToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload
      const exp = payload.exp * 1000; // Convert to milliseconds
      return exp > Date.now() // Check if current time is past expiration time
    } catch (error) {
      return false; // If there's an error, treat it as expired
    }
  }

  decodeToken(): any {
    const token = this.getToken();
    const tokenPayload = token.split('.')[1];
    return JSON.parse(atob(tokenPayload));
  }

}
