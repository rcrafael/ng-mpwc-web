import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: ApiService) { }

  public getAllRoles(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getRoles());
  }

}
