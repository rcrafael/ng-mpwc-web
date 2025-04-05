import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthApi, BillingApi, Constants, CustomerApi, PaymentApi } from '../../common/constants';
import { firstValueFrom, Observable } from 'rxjs';
import { IAPIResponse } from '../../models/interfaces/IApiResponse';
import { IBillingInfo } from '../../models/interfaces/IBilling';
import { IMeterDetails } from '../../models/interfaces/IMeter';
import { ICustomerProfile } from '../../models/interfaces/ICustomer';
import { IOfficialReceipt } from '../../models/interfaces/IOfficialReceipt';
import { ILogin } from '../../models/interfaces/IUser';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }


  // Auth APIs
  login(params: ILogin): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${Constants.HOST}${AuthApi.LOGIN}`, params );
  }

 
  // customer APIs

  getCustomerList(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${CustomerApi.GET_CUSTOMER_LIST.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  }

  getCustomerById(customerId: string): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${CustomerApi.GET_CUSTOMER_BY_ID.replace('{id}', customerId.toString())}`);
  }

  createCustomer(params: ICustomerProfile): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${Constants.HOST}${CustomerApi.CREATE_CUSTOMER}`, params);
  }

  updateCustomer(params: ICustomerProfile): Observable<IAPIResponse> {
    return this.httpClient.put<IAPIResponse>(`${Constants.HOST}${CustomerApi.UPDATE_CUSTOMER}`, params);
  }

  generateAccountNumber(): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${CustomerApi.GET_NEW_ACCOUNT_NUMBER}`);
  }

  getMeterByMeterNo(meterNo: string): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${CustomerApi.GET_METER_BY_METER_NO.replace('{meterNo}', meterNo)}`);
  }

  updateMeterNo(params: IMeterDetails): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${Constants.HOST}${CustomerApi.UPDATE_METER_NO}`, params);
  }

  getMeterNoByCustomerId(customerId: string): Observable<IAPIResponse> {
    let params = {
      customerId: customerId,
    }
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${CustomerApi.GET_METER_BY_CUSTOMER_ID}`, {params});
  }

  createMeterNo(params: any): Observable<IAPIResponse> {
      return this.httpClient.post<IAPIResponse>(`${Constants.HOST}${CustomerApi.CREATE_METER_NO}`, params)
  }
  




  // billing APIs

  getActiveWaterRatesResidential() {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_ACTIVE_WATER_RATES_RESIDENTIAL}`);
  }

  getActiveWaterRatesCommercial() {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_ACTIVE_WATER_RATES_COMMERCIAL}`);
  }

  getBillings(pageNo: number, pageSize: number) {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_BILLING.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  }

  getBillingById(readingId: string) {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_BILLING_BY_ID.replace('{billingId}',readingId)}`);
  }

  createBilling(params:IBillingInfo) {
    return this.httpClient.post<IAPIResponse>(`${Constants.HOST}${BillingApi.CREATE_BILLING}`, params);
  }

  getBillingByCustomerId(customerId: string, pageNo: number = 0 , pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_BILLING_BY_CUSTOMER_ID.replace('{customerId}',customerId).replace('{pageNo}',pageNo.toString()).replace('{pageSize}',pageSize.toString())}`);
  }

  geneateReadingNo() : Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_NEW_READING_NUMBER}`);
  }

  getRecentBillingsByCustomerId(customerId: string): Observable<IAPIResponse> {
    let params = {
      customerId: customerId,
    }
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_RECENT_BILLING_BY_CUSTOMER_ID}`, {params});
  }

  getUnpaidBillsByCustomerId(customerId: string): Observable<IAPIResponse> {
    let params = {
      customerId: customerId,
    }
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_UNPAID_BILLING_BY_CUSTOMER_ID}`, {params});
  }




  //payment APIs

  getORAllPayments(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${PaymentApi.GET_OR_ALL_PAYMENTS.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  } 

  getORPaymentsByCustomerId(customerId: string, pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${PaymentApi.GET_OR_ALL_PAYMENTS_BY_CUSTOMER_ID.replace('{customerId}',customerId).replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  } 

  getORAllPaymentsWithCustomerInfo(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${PaymentApi.GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  }

  getORPaymentsWithCustomerInfoById(orId: String): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${PaymentApi.GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO_BY_ID.replace('{id}', orId.toString())}`);
  }


  generateNewORNo(): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${PaymentApi.GENERATE_OR_NUMBER}`);
  }

  createORPayment(params: IOfficialReceipt): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${Constants.HOST}${PaymentApi.CREATE_OR_PAYMENT}`, params);
  }

}
