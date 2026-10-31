import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { firstValueFrom } from 'rxjs';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { ILogin } from '../models/interfaces/IUser';

import { ALL_PAGE_DEFINITIONS } from '../common/enum';

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
    try {
      const token = this.getToken();
      if (!token) return null;
      const tokenPayload = token.split('.')[1];
      if (!tokenPayload) return null;
      return JSON.parse(atob(tokenPayload));
    } catch {
      return null;
    }
  }

  isSuperAdmin(): boolean {
    try {
      const decoded = this.decodeToken();
      if (!decoded) return false;
      const roleVal = decoded.role?.role || decoded.role || '';
      return typeof roleVal === 'string' && roleVal.toLowerCase() === 'superadmin';
    } catch {
      return false;
    }
  }

  getUserPages(): string[] {
    try {
      if (this.isSuperAdmin()) {
        return ALL_PAGE_DEFINITIONS.map(p => p.code);
      }
      const decoded = this.decodeToken();
      if (!decoded || !decoded.pageAccess) return [];
      return Array.isArray(decoded.pageAccess) ? decoded.pageAccess : [];
    } catch {
      return [];
    }
  }

  hasPageAccess(pageCode: string): boolean {
    if (!pageCode) return true;
    if (this.isSuperAdmin()) return true;
    return this.getUserPages().includes(pageCode);
  }

}
