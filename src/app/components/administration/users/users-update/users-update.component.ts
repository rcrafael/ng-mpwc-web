import { Component, OnInit } from '@angular/core';
import { UsersPasswordCriteriaComponent } from "../users-password-criteria/users-password-criteria.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../common/custom-validator';
import { IRole } from '../../../../models/interfaces/IRoles';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { CommonService } from '../../../../services/common.service';
import { RoleService } from '../../../../services/role.service';
import { UserService } from '../../../../services/user.service';
import { IApiCall } from '../../../../models/interfaces/ICommon';
import { ActivatedRoute } from '@angular/router';
import { IUserData, IUserUpdate } from '../../../../models/interfaces/IUser';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';

@Component({
  selector: 'app-users-update',
  standalone: true,
  imports: [
    UsersPasswordCriteriaComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './users-update.component.html',
  styleUrl: './users-update.component.css'
})
export class UsersUpdateComponent implements OnInit {

  constructor(
    private roleService: RoleService,
    private commonService: CommonService,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private toast: ToastrService
  ) { }

  fg = new FormGroup({
    username: new FormControl<string>({value: '', disabled: true},Validators.required),
    email: new FormControl<string>('', Validators.email),
    lname: new FormControl<string>('', Validators.required),
    fname: new FormControl<string>('', Validators.required),
    mname: new FormControl<string>(''),
    roleId: new FormControl<string|null>(null, Validators.required),
    password: new FormControl<string>(''),
    confirmPassword: new FormControl<string>('')
  });

  roles: IRole[] = [];
  toastTitlePrefix = 'Update User - '
  pwd: string = '';
  userId:string = '';

  async ngOnInit(): Promise<void> {
    this.userId = this.activeRoute.snapshot.paramMap.get('userId') || '';
    console.log('USER ID: ', this.userId);
    try {
      const apiCalls: IApiCall[] = [];
      apiCalls.push({
        name: 'getRoles', 
        apiCall: this.roleService.getAllRoles()
      })

      apiCalls.push({
        name: 'getUser', 
        apiCall: this.userService.getUserById(this.userId)
      })

      this.commonService.showSpinner(true)

      for(let api of apiCalls) {
        console.log('API CALLED: ', api.name);
    
        if(api.name === 'getRoles') {
          const response = await api.apiCall;
          if(response) {
            const data = response.result as IRole[];
            this.roles = data;
          }
        }

        if(api.name === 'getUser') {
          const response = await api.apiCall;
          if(response) {
            const data = response.result as IUserData;
            console.log('DATA: ', data);
            console.log('ROLE ID: ', data.role.id);
            this.fg.get('username')?.setValue(data.username);
            this.fg.get('email')?.setValue(data.email);
            this.fg.get('lname')?.setValue(data.lname);
            this.fg.get('fname')?.setValue(data.fname);
            this.fg.get('mname')?.setValue(data.mname);
            this.fg.get('roleId')?.setValue(data.role.id);
          }
        }
      }

    } catch (error) {
      console.log('ERROR: ', error);
    } finally {
      this.commonService.showSpinner(false);
    }

    this.commonService.showSpinner(true);
        
    this.roleService.getAllRoles().then((response: IAPIResponse) => {
      console.log('ROLES: ', response);
      this.roles = response.result as IRole[];
    }).catch((error: any) => {
      
    }).finally(() => {
      this.commonService.showSpinner(false);
    });

    this.fg.get('password')?.valueChanges.subscribe((value) => {
      console.log('PASSWORD VAL CHANGE: ', value);
      this.pwd = value ?? '';

      const confirmCtrl = this.fg.get('confirmPassword');
      const passwordCtrl = this.fg.get('password');

      if (value && value.trim() !== '') {
        passwordCtrl?.setValidators([CustomValidator.isValidPassword]); // your char validator
        confirmCtrl?.setValidators([Validators.required, CustomValidator.isPasswordMatch]);
      } else {
        passwordCtrl?.clearValidators();
        confirmCtrl?.clearValidators();
        confirmCtrl?.setValue('', { emitEvent: false }); // optional: clear confirm too
      }

      passwordCtrl?.updateValueAndValidity({ emitEvent: false });
      confirmCtrl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  onSubmit() {
    console.log('FORM: ', this.fg);
    console.log('FORM IS VALID: ', this.fg.valid);

    if(!this.fg.valid) {
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.ERROR);
      return;
    }

    const data: IUserUpdate = {
      id: this.userId,
      username: this.fg.get('username')?.value ?? '',
      email: this.fg.get('email')?.value ?? '',
      lname: this.fg.get('lname')?.value ?? '',
      fname: this.fg.get('fname')?.value ?? '',
      mname: this.fg.get('mname')?.value ?? '',
      roleId: this.fg.get('roleId')?.value ?? '',
      password: this.fg.get('password')?.value ?? ''
    }

    this.commonService.showSpinner(true);
    this.userService.updateUser(data).then((response: IAPIResponse) => {
      this.toast.success(ToastrMessage.SUCCESS_UPDATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
    }).catch((error: any) => {
      this.toast.error(ToastrMessage.ERROR_UPDATE, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.log('ERROR UPDATING USER: ' , error);
    }).finally(() => {
      this.commonService.showSpinner(false);
    });

  }


}
