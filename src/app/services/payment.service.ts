import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IOfficialReceipt } from '../models/interfaces/IOfficialReceipt';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';
import { IOtherPaymentPayload } from '../models/interfaces/IOtherPayments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: ApiService) { }

  async createORPayment(params: IOfficialReceipt): Promise<IAPIResponse> {
    return firstValueFrom(this.http.createORPayment(params));
  }

  async generateNewORno(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.generateNewORNo());
  }

  async getORAllWithCustomerInfo(pageNo: number, pageSize: number): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getORAllPaymentsWithCustomerInfo(pageNo, pageSize));
  }

  async getORWithCustomerInfoById(orId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getORPaymentsWithCustomerInfoById(orId));
  }

  async getORAllPaymentWithSearch(keyword: string, pageNo: number = 0, pageSize: number = 50): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getORAllPaymentsWithSearch(keyword, pageNo, pageSize));
  }

  async voidRecord(orId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.voidOR(orId));
  }

  //OTHERS
  async createOtherPayment(params: IOtherPaymentPayload): Promise<IAPIResponse> {
    return firstValueFrom(this.http.createOtherPayment(params));
  }

  async getAllOtherPayments(pageNo: number, pageSize: number): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getAllOtherPayments(pageNo, pageSize));
  }

  async getAllOtherPaymentsWithCustomerInfo(pageNo: number, pageSize: number): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getAllOtherPaymentsWithCustomerInfo(pageNo, pageSize));
  }

  async getOtherPaymentWithCustomerInfoById(orId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getOtherPaymentWithCustomerInfoById(orId));
  }

  async getAllOtherPaymentWithSearch(keyword: string, pageNo: number = 0, pageSize: number = 50): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getAllOtherPaymentsWithSearch(keyword, pageNo, pageSize));
  }

  async updateStatus(orId: string, statusIs: number): Promise<IAPIResponse> {
    return firstValueFrom(this.http.updateStatus(orId, statusIs));
  }

  async deleteRecord(orId: string): Promise<any> {
    return firstValueFrom(this.http.deleteRecord(orId));
  }

  async printORPdf(id: string): Promise<any> {
    return firstValueFrom(this.http.printORPdf(id));
  }

  async printORExcel(id: string): Promise<any> {
    return firstValueFrom(this.http.printORExcel(id));
  }

}
