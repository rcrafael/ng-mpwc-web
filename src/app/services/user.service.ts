import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUserProfile } from '../models/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private userProfile = new BehaviorSubject<IUserProfile|null>(null);
  public currentUserProfile = this.userProfile.asObservable();
  
  public setCurrentUserProfile(userProfile: IUserProfile) {
    this.userProfile.next(userProfile);
  }



}
