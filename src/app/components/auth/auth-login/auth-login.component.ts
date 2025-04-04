import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILogin } from '../../../models/interfaces/IUser';
import { Router } from '@angular/router'; 
import { AuthService } from '../../../services/auth.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css'
})
export class AuthLoginComponent implements OnInit {


  constructor( 
    private authService: AuthService,
    private router: Router
  ) { }

  private login!: ILogin;

  ngOnInit(): void {
    
  }
  
  fg = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('',Validators.required),
  });

  onSubmit(): void {

    const login = this.fg.value;
      // console.log(this.fg.valid)
      // this.isSubmitted = true;
    this.fg.markAllAsTouched();
    if(this.fg.valid) {

      const params: ILogin = {
        email: login.email!,
        password: login.password!
      }

      this.authService.login(params).then((response: IAPIResponse) => {
        this.router.navigateByUrl('dashboard')

        const result = response.result as any;
        localStorage.setItem('accessToken',result.accessToken);
      })
      .catch((error: Error) => {
        console.error('ERROR LOGIN: ', error);
        localStorage.removeItem('accessToken');
        alert('Invalid email or password.');
      })



      
    }

  }

}
