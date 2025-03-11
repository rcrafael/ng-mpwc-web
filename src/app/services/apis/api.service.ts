import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BillingApi, Constants, CustomerApi } from '../../common/constants';
import { firstValueFrom, Observable } from 'rxjs';
import { IAPIResponse } from '../../models/interfaces/IApiResponse';
import { IBillingInfo } from '../../models/interfaces/IBilling';
import { IMeterDetails } from '../../models/interfaces/IMeter';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  // customer APIs

  getCustomerList(pageNo: number = 0, pageSize: number = 50): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${CustomerApi.GET_CUSTOMER_LIST.replace('{pageNo}', pageNo.toString()).replace('{pageSize}', pageSize.toString())}`);
  }

  getMeterNoByCustomerId(customerId: string): Observable<IAPIResponse> {
    let params = {
      customerId: customerId,
    }
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${CustomerApi.GET_METER_BY_CUSTOMER_ID}`, {params});
  }

  getMeterByMeterNo(meterNo: string): Observable<IAPIResponse> {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${CustomerApi.GET_METER_BY_METER_NO.replace('{meterNo}', meterNo)}`);
  }

  updateMeterNo(params: IMeterDetails): Observable<IAPIResponse> {
    return this.httpClient.post<IAPIResponse>(`${Constants.HOST}${CustomerApi.UPDATE_METER_NO}`, params);
  }


  // billing APIs

  getActiveWaterRatesResidential() {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_ACTIVE_WATER_RATES_RESIDENTIAL}`);
  }

  getActiveWaterRatesCommercial() {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_ACTIVE_WATER_RATES_COMMERCIAL}`);
  }


  createBilling(params:IBillingInfo) {
    return this.httpClient.post<IAPIResponse>(`${Constants.HOST}${BillingApi.CREATE_BILLING}`, params);
  }
  

}
