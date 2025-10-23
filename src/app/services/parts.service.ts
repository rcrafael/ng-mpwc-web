import { Injectable } from '@angular/core';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';
import { firstValueFrom } from 'rxjs';
import { IPartDetails } from '../models/interfaces/IParts';

@Injectable({
  providedIn: 'root'
})
export class PartsService {

  constructor(private http: ApiService) {}

  getPartsListing(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getPartsListing());
  }

  getParts(pageNo: number = 0, pageSize: number = 50): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getParts(pageNo, pageSize));
  }
  
  createPart(params: IPartDetails): Promise<IAPIResponse> {
    return firstValueFrom(this.http.createPart(params));
  }

  updatePart(params: IPartDetails): Promise<IAPIResponse> {
    return firstValueFrom(this.http.updatePart(params));
  }
  
  getPartByid(partId: string): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getPartByid(partId));
  }

}
