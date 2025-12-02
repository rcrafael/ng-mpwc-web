import { Injectable } from "@angular/core";
import { ApiService } from "./apis/api.service";
import { IAPIResponse } from "../models/interfaces/IApiResponse";
import { first, firstValueFrom } from "rxjs";
import { IDefaultValues } from "../models/interfaces/IDefaultValues";

@Injectable({
  providedIn: 'root'
})
export class DefaultValuesService {

  constructor(
     private http: ApiService
  ) { }


  getDefaultValues(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getDefaultValues());
  }

  updateDefaultValues(data: IDefaultValues): Promise<IAPIResponse> {
    return firstValueFrom(this.http.updateDefaultValues(data));
  }

  //sessionStorage
  getDefaultValuesFromSession(): IDefaultValues | null {
    const data = sessionStorage.getItem('DEFAULT_VALUES');
    return data ? JSON.parse(data) : null;
  }

  setDefaultValuesToSession(data: IDefaultValues): void {
    sessionStorage.setItem('DEFAULT_VALUES', JSON.stringify(data));
  }

}