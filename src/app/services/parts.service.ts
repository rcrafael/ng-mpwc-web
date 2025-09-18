import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartsService {

  constructor(private http: ApiService) {}

  getPartsListing(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getPartsListing());
  }
  
}
