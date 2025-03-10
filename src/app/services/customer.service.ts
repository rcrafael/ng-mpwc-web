import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: ApiService) {}

  getCustomerList(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getCustomerList());
  }

  getMeterNoByCustomerId(customerId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getMeterNoByCustomerId(customerId));
  }

  getMeterbyMeterNo(meterNo: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getMeterByMeterNo(meterNo));
  }

}