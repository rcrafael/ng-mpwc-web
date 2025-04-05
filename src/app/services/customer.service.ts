import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom, Observable } from 'rxjs';
import { IMeterDetails } from '../models/interfaces/IMeter';
import { ICustomerProfile } from '../models/interfaces/ICustomer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: ApiService) {}

  getCustomerList(pageIdx: number = 0, pageSize: number = 50 ): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getCustomerList(pageIdx, pageSize));
  }

  createCustomer(params: ICustomerProfile): Promise<IAPIResponse> {
    return firstValueFrom(this.http.createCustomer(params));
  }

  updateCustomer(params: ICustomerProfile): Promise<IAPIResponse> {
    return firstValueFrom(this.http.updateCustomer(params));
  }

  getCustomerById(customerId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getCustomerById(customerId));
  }

  generateAccountNumber(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.generateAccountNumber());
  }


  getMeterNoByCustomerId(customerId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getMeterNoByCustomerId(customerId));
  }

  getMeterbyMeterNo(meterNo: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getMeterByMeterNo(meterNo));
  }

  

  updateMeterNo(params: IMeterDetails): Promise<IAPIResponse> {
    return firstValueFrom(this.http.updateMeterNo(params));
  }


  createMeterNo(params: any): Promise<IAPIResponse> {
    return firstValueFrom(this.http.createMeterNo(params));
  }

}