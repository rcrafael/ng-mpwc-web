import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: ApiService) { }
  
  getActiveWaterRatesResidential(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getActiveWaterRatesResidential());
  }

  getActiveWaterRatesCommercial(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getActiveWaterRatesCommercial());
  }

}
