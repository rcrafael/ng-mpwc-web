import { Component, Input, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-password-criteria',
  standalone: true,
  imports: [],
  templateUrl: './users-password-criteria.component.html',
  styleUrl: './users-password-criteria.component.css'
})
export class UsersPasswordCriteriaComponent implements OnChanges {


  @Input() password: string = '';

  hasUpperCase: boolean = false;
  hasLowerCase: boolean = false;
  hasNumber: boolean = false;
  hasEightChar: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.hasUpperCase = this.password.match(/[A-Z]/) ? true : false;
    this.hasLowerCase = this.password.match(/[a-z]/) ? true : false;
    this.hasNumber = this.password.match(/\d/) ? true : false;
    this.hasEightChar = this.password.length >= 8 ? true : false;
  }


}
