import { Component } from '@angular/core';
import { IBranchCode, ICustomerType, IGender, IPhase } from '../../../models/interfaces/ICommon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})
export class CustomerCreateComponent {

  constructor(

  ) {}

  branchCode: IBranchCode[] = branchCodeData;
  gender: IGender[] = genderData;
  customerType: ICustomerType[] = customerTypeData;
  phase: IPhase[] = phaseData;

  public fg = new FormGroup ({
    customerId: new FormControl(''),
    accountNo:  new FormControl(''),
    meterNo:  new FormControl(''),
    alias:  new FormControl(''),
    lastName:  new FormControl(''),
    firstName:  new FormControl(''),
    middleName:  new FormControl(''),
    branchCode:  new FormControl(-1),
    address:  new FormControl(''),
    gender:  new FormControl(-1),
    civilStatus:  new FormControl(''),
    dateOfBirth:  new FormControl(new Date()),
    occupation: new FormControl(''),
    educationAttainment: new FormControl(''),
    noOfDependents: new FormControl(0),
    religion: new FormControl(''),
    annualIncome: new FormControl(''),
    dateAccepted: new FormControl(new Date()),
    customerType: new FormControl(-1),
    phase: new FormControl(-1),
    withMembership: new FormControl(true)
  });
  
  onSubmit() : void {
    console.log('FORM VALUE ',this.fg.value);
    
  }

}


export const branchCodeData: IBranchCode[] = [
  { id: 1, name: 'Branch 1' },
  { id: 2, name: 'Branch 2' },
  { id: 3, name: 'Branch 3' },
  { id: 4, name: 'Branch 4' },
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