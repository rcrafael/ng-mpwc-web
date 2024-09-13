import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthLoginComponent } from "./components/auth/auth-login/auth-login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    AuthLoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mpwc-web';
}
