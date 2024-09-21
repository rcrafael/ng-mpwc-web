import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthLoginComponent } from "./components/auth/auth-login/auth-login.component";
import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { BrowserModule } from '@angular/platform-browser';
import { AuthComponent } from "./components/auth/auth.component";
import { NgIf } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    RouterOutlet,
    AuthLoginComponent,
    AppLayoutComponent,
    AuthComponent,
    
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  token: any = '';

  ngOnInit(): void {
    // Check if token is present in local storage
    this.token = localStorage.getItem('token')
    if(!this.token) {
      this.router.navigateByUrl('auth/login');
    }
  }

}
