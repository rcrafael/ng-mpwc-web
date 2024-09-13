import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ILogin } from '../../../models/interfaces/user';
import { Router } from '@angular/router'; 
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
    private userService: UserService,
    private router: Router
  ) { }

  private login!: ILogin;
  public isSubmitted: boolean = false;

  ngOnInit(): void {
    
  }
  
  fg = new FormGroup({
    email: new FormControl('',Validators.email),
    password: new FormControl('',Validators.required),
  });

  onSubmit(): void {

    const login = this.fg.value;
    console.log(this.fg.valid)
    this.isSubmitted = true;
    
    if(this.fg.valid) {
      this.router.navigateByUrl('dashboard')
    }

  }

}
