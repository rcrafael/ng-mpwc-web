import { Component, OnInit, signal } from '@angular/core';
import { IBranchCode, ICustomerType, IGender, IPhase } from '../../../models/interfaces/ICommon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';
import { formatDate } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { branchCodeData, genderData, customerTypeData, phaseData } from '../../../common/enum';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule
  ],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})
export class CustomerCreateComponent implements OnInit {

  constructor(
    private customerService: CustomerService,
    private toast: ToastrService,
    private router: Router
  ) {}

  toastTitlePrefix = 'Customer - '

  branchCode: IBranchCode[] = branchCodeData;
  gender: IGender[] = genderData;
  customerType: ICustomerType[] = customerTypeData;
 
  currentDate: string = formatDate(new Date(),'yyyy-MM-dd','en-PH');

  fg = new FormGroup ({
    accountNo:  new FormControl<string>('',Validators.required),
    lastName:  new FormControl<string>('',Validators.required),
    firstName:  new FormControl<string>('',Validators.required),
    middleName:  new FormControl<string>(''),
    address:  new FormControl<string>('',Validators.required),
    gender:  new FormControl<number>(-1,Validators.required),
    civilStatus:  new FormControl<string>('',Validators.required),
    dateOfBirth:  new FormControl<string>(this.currentDate,Validators.required),
    nationalId: new FormControl<string>(''),
    occupation: new FormControl<string>(''),
    educationalLevel: new FormControl<string>(''),
    numberOfDependent: new FormControl<number>(0),
    religion: new FormControl<string>(''),
    annualIncome: new FormControl<number | null>(0),
    dateAccepted: new FormControl<string>(this.currentDate,Validators.required),
    tin: new FormControl<string>(''),
  });
  
  ngOnInit(): void {
    this.customerService.generateAccountNumber().then((response: IAPIResponse) => { 
      this.fg.patchValue({ accountNo: response.result.toString() });
    })
  }

  async onSubmit() : Promise<void> {
    if(!this.fg.valid) {
      this.toast.success(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.ERROR);
      return;
    }

    const frm = this.fg.value;
    let cust: ICustomerProfile = {
      accountNo: frm.accountNo!,
      lastName: frm.lastName!,
      firstName:frm.firstName!,
      middleName: frm.middleName!,
      address: frm.address!,
      gender: frm.gender!,
      civilStatus: frm.civilStatus ?? '',
      dateOfBirth: frm.dateOfBirth!,
      nationalId: frm.nationalId ?? '',
      occupation: frm.occupation ?? '',
      educationalLevel: frm.educationalLevel ?? '',
      numberOfDependent: frm.numberOfDependent ?? 0,
      religion: frm.religion ?? '',
      annualIncome: frm.annualIncome ?? 0,
      dateAccepted: frm.dateAccepted!,
      tin: frm.tin ?? ''
    }

    await this.customerService.createCustomer(cust).then((response: IAPIResponse)=> {
      this.toast.success(ToastrMessage.SUCCESS_CREATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      console.log('CUSTOMER CREATED',response);
      this.router.navigateByUrl('customer');
    })
    .catch((error: Error) => {
      this.toast.error(ToastrMessage.ERROR_CREATE, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.error('Error creating customer:', error);
    });


  }

}
