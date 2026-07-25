import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RoleService } from '../../../../services/role.service';
import { CommonService } from '../../../../services/common.service';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { IRoles } from '../../../../models/interfaces/IRoles';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../services/user.service';
import { IUserRegister } from '../../../../models/interfaces/IUser';
import { UsersPasswordCriteriaComponent } from "../users-password-criteria/users-password-criteria.component";
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-users-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UsersPasswordCriteriaComponent,
    NgIf  
],
  templateUrl: './users-create.component.html',
  styleUrl: './users-create.component.css'
})
export class UsersCreateComponent implements OnInit {


  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private commonService: CommonService,
    private toast: ToastrService
  ) { }

  roles: IRoles[] = [];
  toastTitlePrefix = 'User - '
  pwd: string = '';

  isValidPassword:  ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const validCharacters = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (control.value.length < 8) {
      return { invalidPasswordLength : true };
    }

    if(validCharacters.test(control.value) === false) {
      return { invalidCharacters: true };
    }

    return null;
  }

  isPasswordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const pwd1 = control.get('password')?.value;
    const pwd2 = control.get('confirmPassword')?.value;

    if(pwd1 !== pwd2) {
      return { passwordMismatch: true };
    }

    return null;
  }

  fg = new FormGroup({
    username: new FormControl<string>({value: '', disabled: true},Validators.required),
    email: new FormControl<string>('', Validators.email),
    lname: new FormControl<string>('', Validators.required),
    fname: new FormControl<string>('', Validators.required),
    mname: new FormControl<string>(''),
    roleId: new FormControl<string|null>(null, Validators.required),
    password: new FormControl<string>('', [Validators.required, this.isValidPassword]),
    confirmPassword: new FormControl<string>('',Validators.required)
  }, { validators: this.isPasswordMatch });


  ngOnInit(): void {
    this.commonService.showSpinner(true);
    
    this.roleService.getAllRoles().then((response: IAPIResponse) => {
      console.log('ROLES: ', response);
      this.roles = response.result as IRoles[];
    }).catch((error: any) => {
      
    }).finally(() => {
      this.commonService.showSpinner(false);
    });

    this.fg.get('password')?.valueChanges.subscribe((value) => {
      console.log('PASSWORD VAL CHANGE: ', value);
      this.pwd = value ?? '';
    });


  }

  async onSubmit(): Promise<void> {
    const formValue = this.fg.getRawValue();
    if(!this.fg.valid) {
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.log('INVALID INPUT:', this.fg);
      return;
    }

    const user: IUserRegister = {
      username: formValue.username ?? '',
      email: formValue.email ?? '',
      lname: formValue.lname ?? '',
      fname: formValue.fname ?? '',
      mname: formValue.mname ?? '',
      roleId: formValue.roleId ?? '',
      password: formValue.password ?? ''
    }

    this.commonService.showSpinner(true);
    await this.userService.registerUser(user).then((response: IAPIResponse) => {
      this.toast.success(ToastrMessage.SUCCESS_CREATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      this.resetForm();
    }).catch((error: any) => {
      this.toast.error(ToastrMessage.ERROR_CREATE, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.log('ERROR CREATING USER: ' , error);
    }).finally(() => {
      this.commonService.showSpinner(false);
    });
  }

  resetForm(): void {
    this.fg.reset();
  }

  generateUsername(): void {

    const fgValue = this.fg.getRawValue();
    const lastName = fgValue.lname?.replaceAll(' ', '');
    const firstName = fgValue.fname;
    const middleName = fgValue.mname;
    
    const firstNameInitial = firstName?.charAt(0).toLowerCase();
    const middleNameInitial = middleName?.charAt(0).toLowerCase();

    this.fg.patchValue({username: `${firstNameInitial}${middleNameInitial}${lastName}`}); 

  }


  

  

}
