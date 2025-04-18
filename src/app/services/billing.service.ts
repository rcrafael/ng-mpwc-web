import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';
import { IBillingInfo, IUpdateBilling } from '../models/interfaces/IBilling';

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

  getBillings(pageNo: number = 0, pageSize: number = 50): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getBillings(pageNo,pageSize));
  }

  getBillingById(id: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getBillingById(id));
  }

  createBilling(params: IBillingInfo): Promise<IAPIResponse> {
    return firstValueFrom(this.http.createBilling(params));
  }

  updateBilling(params: IUpdateBilling): Promise<IAPIResponse> {
    return firstValueFrom(this.http.updateBilling(params));
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
