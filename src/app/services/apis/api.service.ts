import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BillingApi, Constants, CustomerApi } from '../../common/constants';
import { firstValueFrom, Observable } from 'rxjs';
import { IAPIResponse } from '../../models/interfaces/IApiResponse';
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


  // billing APIs

  getActiveWaterRatesResidential() {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_ACTIVE_WATER_RATES_RESIDENTIAL}`);
  }

  getActiveWaterRatesCommercial() {
    return this.httpClient.get<IAPIResponse>(`${Constants.HOST}${BillingApi.GET_ACTIVE_WATER_RATES_COMMERCIAL}`);
  }

}
