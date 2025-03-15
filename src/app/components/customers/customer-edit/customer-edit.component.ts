import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { IBranchCode, IGender, ICustomerType, IPhase } from '../../../models/interfaces/ICommon';
import { branchCodeData, genderData, customerTypeData, phaseData } from '../customer-create/customer-create.component';
import { CustomerCurrentBillingComponent } from "../customer-current-billing/customer-current-billing.component";
import { CustomerShareCapComponent } from "../customer-share-cap/customer-share-cap.component";
import { CustomerService } from '../../../services/customer.service';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';
import { ActivatedRoute } from '@angular/router';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIcon,
    ReactiveFormsModule,
    CustomerCurrentBillingComponent,
    CustomerShareCapComponent
],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css'
})
export class CustomerEditComponent implements OnInit {

  constructor(
    private customerService: CustomerService,
    private activeRoute: ActivatedRoute
  ) { }

  branchCode: IBranchCode[] = branchCodeData;
  gender: IGender[] = genderData;
  customerType: ICustomerType[] = customerTypeData;
  phase: IPhase[] = phaseData;
  step = signal(0);
  customerProfile!: ICustomerProfile;
  customerId!: string;

  currentDate: string = formatDate(new Date(),'yyyy-MM-dd','en-PH');
  
  public fg = new FormGroup ({
    accountNo:  new FormControl<string>({value: '', disabled: true},Validators.required),
    lastName:  new FormControl<string>('',Validators.required),
    firstName:  new FormControl<string>('',Validators.required),
    middleName:  new FormControl<string>(''),
    branchCode:  new FormControl<number>(-1,Validators.required),
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
    dateAccepted: new FormControl<string>({value: this.currentDate, disabled: true},Validators.required),
    customerType: new FormControl<number>(-1,Validators.required),
    phase: new FormControl<number>(-1,Validators.required),
  });

ngOnInit(): void {
  this.customerId = this.activeRoute.snapshot.paramMap.get('customerId') || '';
  this.loadCustomerInfo();
}

setStep(index: number) {
  this.step.set(index);
}

nextStep() {
  this.step.update(i => i + 1);
}

loadCustomerInfo(): void {
  this.customerService.getCustomerById(this.customerId).then((response: IAPIResponse) => {
    const c:ICustomerProfile = response.result as ICustomerProfile;
    this.fg.patchValue({
      accountNo:  c.accountNo,
      lastName:  c.lastName,
      firstName: c.firstName,
      middleName:  c.middleName,
      branchCode:  c.branchCode,
      address:  c.address,
      gender:  c.gender,
      civilStatus:  c.civilStatus,
      dateOfBirth:  c.dateOfBirth,
      nationalId: c.nationalId,
      occupation: c.occupation,
      educationalLevel: c.educationalLevel,
      numberOfDependent: c.numberOfDependent,
      religion: c.religion,
      annualIncome: c.annualIncome,
      dateAccepted: c.dateAccepted,
      customerType: c.customerType,
      phase: c.phase,
    })
  });
}

onSubmit(): void {

}

onFormReset(): void {

}


}
