import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { firstValueFrom, Observable } from 'rxjs';
import { IAPIResponse } from '../models/interfaces/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class SeptageFeeService {

  constructor(
    private http: ApiService
  ) { }

  getSeptageFees(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getSeptageFees());
  }

}
