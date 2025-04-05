import { Component, OnInit, signal } from '@angular/core';
import { IBranchCode, ICustomerType, IGender, IPhase } from '../../../models/interfaces/ICommon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';
import { formatDate } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';

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
    private customerService: CustomerService
  ) {}

  branchCode: IBranchCode[] = branchCodeData;
  gender: IGender[] = genderData;
  customerType: ICustomerType[] = customerTypeData;
  phase: IPhase[] = phaseData;
  
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
    customerType: new FormControl<number>(-1,Validators.required),
    phase: new FormControl<number>(-1,Validators.required),
    tin: new FormControl<string>(''),
  });
  
  ngOnInit(): void {
    this.customerService.generateAccountNumber().then((response: IAPIResponse) => { 
      this.fg.patchValue({ accountNo: response.result.toString() });
    })
  }

  onSubmit() : void {
    if(!this.fg.valid) {
      alert("Invalid inputs! Please try again.");
      console.log('FORM: ', this.fg);
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
      customerType: frm.customerType ?? 1,
      phase: frm.phase ?? 1,
      tin: frm.tin ?? ''
    }

    this.customerService.createCustomer(cust).then((response: IAPIResponse)=> {
      alert("CUSTOMER CREATED");
      console.log('CUSTOMER CREATED',response);
    })
    .catch((error: Error) => {
      console.error('Error creating customer:', error);
    });


  }

}


export const branchCodeData: IBranchCode[] = [
  { id: 1, name: 'Patubig' },
  { id: 2, name: 'Mahabang Parang' },
  { id: 3, name: 'Sta. Rosa' },
  { id: 4, name: 'Duhat' },
]

export const genderData: IGender[] = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
]

export const customerTypeData: ICustomerType[] = [
  { id: 1, name: 'Residential' },
  { id: 2, name: 'Commercial' },
]

export const phaseData: IPhase[] = [
  { id: 1, name: 'Phase 1'},
  { id: 2, name: 'Phase 2'},
]