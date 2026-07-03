import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { firstValueFrom } from 'rxjs';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { IReportFilters } from '../models/interfaces/IReports';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: ApiService) { }

  async getDashboardData(startDate: string, endDate: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getDashboardData(startDate, endDate));
  }

  async generateReport(params: any, api: string): Promise<ArrayBuffer> {
    return firstValueFrom(this.http.generateReport(params, api));
  }


}
