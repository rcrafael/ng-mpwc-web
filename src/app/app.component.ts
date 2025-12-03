import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthLoginComponent } from "./components/auth/auth-login/auth-login.component";
import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { BrowserModule } from '@angular/platform-browser';
import { AuthComponent } from "./components/auth/auth.component";
import { NgIf } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from "./components/common/spinner/spinner.component";
import { DefaultValuesService } from './services/default-values.service';
import { IDefaultValues } from './models/interfaces/IDefaultValues';
import { CommonService } from './services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from './common/constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    private defaultValuesService: DefaultValuesService,
    private commonService: CommonService,
    private toast: ToastrService
  ) {}

  token: any = '';

  toastTitlePrefix = 'App - '

  async ngOnInit(): Promise<void> {
    
    
    
  }

}
