import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  private isSpinnerVisible = new BehaviorSubject<boolean>(false);


  showSpinner(visible: boolean): void {
    this.isSpinnerVisible.next(visible);
  }

  getShowSpinnerVisibility() {
    return this.isSpinnerVisible.asObservable();
  }

}
