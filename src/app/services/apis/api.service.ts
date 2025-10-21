import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthApi, BillingApi, Constants, CustomerApi, PartsApi, PaymentApi, SeptageFeeApi, UserApi } from '../../common/constants';
import { firstValueFrom, Observable, ObservedValueOf } from 'rxjs';
import { IAPIResponse } from '../../models/interfaces/IApiResponse';
import { IBillingInfo, IUpdateBilling } from '../../models/interfaces/IBilling';
import { IMeterDetails } from '../../models/interfaces/IMeter';
import { ICustomerProfile } from '../../models/interfaces/ICustomer';
import { IOfficialReceipt } from '../../models/interfaces/IOfficialReceipt';
import { ILogin } from '../../models/interfaces/IUser';
import { EnvService } from './env.service';
import { IOtherPaymentPayload } from '../../models/interfaces/IOtherPayments';
import { IPartDetails } from '../../models/interfaces/IParts';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private env: EnvService
  ) { }


  // Auth APIs
  login(params: ILogin): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${AuthApi.LOGIN}`, params );
  }
 
  // Users APIs
  getUsername(id: string): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${UserApi.GET_USERNAME.replace('{id}', id)}`);
  }

  // customer APIs

  getCustomerList(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${CustomerApi.GET_CUSTOMER_LIST.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  }

  getCustomerById(customerId: string): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${CustomerApi.GET_CUSTOMER_BY_ID.replace('{id}', customerId.toString())}`);
  }

  createCustomer(params: ICustomerProfile): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${CustomerApi.CREATE_CUSTOMER}`, params);
  }

  updateCustomer(params: ICustomerProfile): Observable<IAPIResponse> {
    return this.httpClient.put<IAPIResponse>(`${this.env.apiHost}${CustomerApi.UPDATE_CUSTOMER}`, params);
  }

  generateAccountNumber(): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${CustomerApi.GET_NEW_ACCOUNT_NUMBER}`);
  }

  getMeterByMeterNo(meterNo: string): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${CustomerApi.GET_METER_BY_METER_NO.replace('{meterNo}', meterNo)}`);
  }

  updateMeterNo(params: IMeterDetails): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${CustomerApi.UPDATE_METER_NO}`, params);
  }

  getMeterNoByCustomerId(customerId: string): Observable<IAPIResponse> {
    let params = {
      customerId: customerId,
    }
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${CustomerApi.GET_METER_BY_CUSTOMER_ID}`, {params});
  }

  createMeterNo(params: any): Observable<IAPIResponse> {
      return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${CustomerApi.CREATE_METER_NO}`, params)
  }
  

  getCustomerWithSearch(keyword: string, pageNo: number = 0, pageSize:number = 50): Observable<IAPIResponse> {
    let params = {
      searchKeyword: keyword
    }
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${CustomerApi.GET_CUSTOMER_SEARCH.replace('{pageNo}',pageNo.toString()).replace('{pageSize}', pageSize.toString())}`, {params});
  }


  // billing APIs

  getActiveWaterRatesResidential() {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${BillingApi.GET_ACTIVE_WATER_RATES_RESIDENTIAL}`);
  }

  getActiveWaterRatesCommercial() {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${BillingApi.GET_ACTIVE_WATER_RATES_COMMERCIAL}`);
  }

  getBillings(pageNo: number, pageSize: number) {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${BillingApi.GET_BILLING.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  }

  getBillingById(readingId: string) {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${BillingApi.GET_BILLING_BY_ID.replace('{billingId}',readingId)}`);
  }

  createBilling(params:IBillingInfo) {
    return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${BillingApi.CREATE_BILLING}`, params);
  }

  updateBilling(params: IUpdateBilling) {
    return this.httpClient.put<IAPIResponse>(`${this.env.apiHost}${BillingApi.CREATE_BILLING}`, params);
  }

  getBillingByCustomerId(customerId: string, pageNo: number = 0 , pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${BillingApi.GET_BILLING_BY_CUSTOMER_ID.replace('{customerId}',customerId).replace('{pageNo}',pageNo.toString()).replace('{pageSize}',pageSize.toString())}`);
  }

  geneateReadingNo() : Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${BillingApi.GET_NEW_READING_NUMBER}`);
  }

  getRecentBillingsByCustomerId(customerId: string): Observable<IAPIResponse> {
    let params = {
      customerId: customerId,
    }
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${BillingApi.GET_RECENT_BILLING_BY_CUSTOMER_ID}`, {params});
  }

  getUnpaidBillsByCustomerId(customerId: string): Observable<IAPIResponse> {
    let params = {
      customerId: customerId,
    }
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${BillingApi.GET_UNPAID_BILLING_BY_CUSTOMER_ID}`, {params});
  }



  //septage fee APIs
  getSeptageFees(): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${SeptageFeeApi.GET_SEPTAGE_FEES}`);
  }



  //payment APIs

  getORAllPayments(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_OR_ALL_PAYMENTS.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  } 

  getORPaymentsByCustomerId(customerId: string, pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_OR_ALL_PAYMENTS_BY_CUSTOMER_ID.replace('{customerId}',customerId).replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  } 

  getORAllPaymentsWithCustomerInfo(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  }

  getORPaymentsWithCustomerInfoById(orId: string): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO_BY_ID.replace('{id}', orId.toString())}`);
  }

  getORAllPaymentsWithSearch(keyword: string, pageNo: number = 0, pageSize:number = 50): Observable<IAPIResponse> {
    let params = {
      searchKeyword: keyword
    }
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_OR_ALL_WITH_SEARCH.replace('{pageNo}',pageNo.toString()).replace('{pageSize}', pageSize.toString())}`, {params});
  }

  generateNewORNo(): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GENERATE_OR_NUMBER}`);
  }

  createORPayment(params: IOfficialReceipt): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${PaymentApi.CREATE_OR_PAYMENT}`, params);
  }

  //OTHER PAYMENTS APIs

  createOtherPayment(params: IOtherPaymentPayload): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${PaymentApi.CREATE_OTHER_PAYMENT}`, params);
  }

  getAllOtherPayments(pageNo:number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_ALL_OTHER_PAYMENTS}`.replace('{pageNo}',pageNo.toString()).replace('{pageSize}',pageSize.toString()));
  }

  getAllOtherPaymentsWithCustomerInfo(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_ALL_OTHER_PAYMENTS_WITH_CUSTOMER_INFO}`.replace('{pageNo}',pageNo.toString()).replace('{pageSize}',pageSize.toString()));
  }

  getOtherPaymentWithCustomerInfoById(orId: string): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_ALL_OTHER_PAYMENTS_WITH_CUSTOMER_INFO_BY_ID}`.replace('{id}',orId));
  }

  getAllOtherPaymentsWithSearch(keyword: string, pageNo: number = 0, pageSize:number = 50): Observable<IAPIResponse> {
    let params = {
      searchKeyword: keyword
    }
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PaymentApi.GET_ALL_OTHER_PAYMENTS_WITH_SEARCH.replace('{pageNo}',pageNo.toString()).replace('{pageSize}', pageSize.toString())}`, {params});
  }

  //GENERIC OR APIs
  updateStatus(id: string, status: number): Observable<IAPIResponse> {
    const params = {
      id: id,
      status: status
    }

    return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${PaymentApi.UPDATE_STATUS}`,params);
  }

  deleteRecord(id: string): Observable<IAPIResponse> {
    return this.httpClient.delete<IAPIResponse>(`${this.env.apiHost}${PaymentApi.DELETE_RECORD}`.replace('{id}',id));
  }


  // SETTINGS APIs

  //PARTS APIs

  getParts(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PartsApi.GET_PARTS_ALL}`.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString()));
  }

  //used this api for dropdown
  getPartsListing(): Observable<IAPIResponse> { 
    return this.httpClient.get<IAPIResponse>(`${this.env.apiHost}${PartsApi.GET_PARTS_LIST}`);
  }

  createPart(params: IPartDetails): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${this.env.apiHost}${PartsApi.CREATE_PARTS}`, params);
  }

}
