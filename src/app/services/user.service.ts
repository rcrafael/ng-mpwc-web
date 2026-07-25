import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { IUserProfile, IUserRegister } from '../models/interfaces/IUser';
import { ApiService } from './apis/api.service';
import { IAPIResponse } from '../models/interfaces/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: ApiService) { }

  private userProfile = new BehaviorSubject<IUserProfile|null>(null);
  public currentUserProfile = this.userProfile.asObservable();
  
  public setCurrentUserProfile(userProfile: IUserProfile) {
    this.userProfile.next(userProfile);
  }

  public async getAllUser(): Promise<IAPIResponse> {
    return firstValueFrom(this.http.getAllUser());
  }

  public async registerUser(user: IUserRegister): Promise<IAPIResponse> {
    return firstValueFrom(this.http.registerUser(user));
  }

}
