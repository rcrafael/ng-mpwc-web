import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';
import { IBillingInfo } from '../models/interfaces/IBilling';

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

  createBilling(params: IBillingInfo): Promise<IAPIResponse> {
    return firstValueFrom(this.http.createBilling(params));
  }

  getBillingByCustomerId(customerId: string, pageNo: number = 0, pageSize: number = 50): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getBillingByCustomerId(customerId,pageNo,pageSize));
  }

  getRecentBillingByCustomerId(customerId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getRecentBillingsByCustomerId(customerId));
  }

  generateReadingNo(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.geneateReadingNo());
  }

  getUnpaidBillsByCustomerId(customerId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getUnpaidBillsByCustomerId(customerId));
  }


}
