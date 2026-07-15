import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { IUserProfile } from '../models/interfaces/IUser';
import { ApiService } from './apis/api.service';

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

  public getAllUser() {
    return firstValueFrom(this.http.getAllUser());
  }

}
