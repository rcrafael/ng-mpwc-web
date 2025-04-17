import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { IBranchCode, IGender, ICustomerType, IPhase } from '../../../models/interfaces/ICommon';
import { CustomerCurrentBillingComponent } from "../customer-current-billing/customer-current-billing.component";
import { CustomerShareCapComponent } from "../customer-share-cap/customer-share-cap.component";
import { CustomerService } from '../../../services/customer.service';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';
import { ActivatedRoute } from '@angular/router';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { formatDate } from '@angular/common';
import { CustomerMeterComponent } from "../customer-meter/customer-meter.component";
import { fromIterable } from 'rxjs/internal/observable/innerFrom';
import { AuthService } from '../../../services/auth.service';
import { branchCodeData, genderData, customerTypeData, phaseData } from '../../../common/enum';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIcon,
    ReactiveFormsModule,
    CustomerCurrentBillingComponent,
    CustomerShareCapComponent,
    CustomerMeterComponent,
],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css'
})
export class CustomerEditComponent implements OnInit {

  constructor(
    private customerService: CustomerService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  isEdit: boolean = false;

  branchCode: IBranchCode[] = branchCodeData;
  gender: IGender[] = genderData;
  customerType: ICustomerType[] = customerTypeData;
  phase: IPhase[] = phaseData;
  step = signal(0);
  customerProfile!: ICustomerProfile;
  customerId!: string;

  currentDate: string = formatDate(new Date(),'yyyy-MM-dd','en-PH');
  
  public fg = new FormGroup ({
    accountNo:  new FormControl<string>({value: '', disabled:true},Validators.required),
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
    dateAccepted: new FormControl<string>({value: this.currentDate, disabled: true},Validators.required),
    // customerType: new FormControl<number>(-1,Validators.required),
    phase: new FormControl<number>(-1,Validators.required),
    tin: new FormControl<string>('')
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
      // customerType: c.customerType,
      phase: c.phase,
      tin: c.tin
    })
  });
}

onSubmit(): void {
  console.log('fg: ' ,this.fg.getRawValue());

  const frm = this.fg.value;

  if(!this.fg.valid) {
    alert('Please enter a valid info');
    return;
  }

  const params: ICustomerProfile = {
    id: this.customerId,
    nationalId: frm.nationalId ?? '',
    firstName: frm.firstName ?? '',
    middleName: frm.middleName?? '',
    lastName: frm.lastName ?? '',
    address: frm.address ?? '',
    gender: frm.gender ?? -1,
    civilStatus: frm.civilStatus?? '',
    dateOfBirth: frm.dateOfBirth?? '',
    occupation: frm.occupation?? '',
    educationalLevel: frm.educationalLevel?? '',
    numberOfDependent: frm.numberOfDependent?? 0,
    religion: frm.religion?? '',
    annualIncome: frm.annualIncome?? 0,
    dateAccepted: frm.dateAccepted?? '',
    // customerType: frm.customerType?? -1,
    phase: frm.phase?? -1,
    dateUpdated: this.currentDate,
    updatedBy: this.authService.getUserId(),
    accountNo: frm.accountNo ?? '',
    userId: null,
    tin: frm.tin ?? ''
  }

  this.customerService.updateCustomer(params).then((response: IAPIResponse) => {
    console.log('response: ', response);
    alert('Customer updated successfully');
  })
  .catch((error: any) => {
    console.log('error: ', error);
    alert('Failed to update customer');
  })
  .finally(() => {
    this.isEdit = false
  });

  
}

onFormReset(): void {

}

onEditClick(): void {
  this.isEdit = true;
}

}
