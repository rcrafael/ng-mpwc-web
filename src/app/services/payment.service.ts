import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IOfficialReceipt } from '../models/interfaces/IOfficialReceipt';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: ApiService) { }

  createORPayment(params: IOfficialReceipt): Promise<IAPIResponse> {
    return firstValueFrom(this.http.createORPayment(params));
  }

  generateNewORno(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.generateNewORNo());
  }

  getORAllWithCustomerInfo(pageNo: number, pageSize: number): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getORAllPaymentsWithCustomerInfo(pageNo, pageSize));
  }

}
