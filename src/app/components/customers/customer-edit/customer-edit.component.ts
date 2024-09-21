import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { IBranchCode, IGender, ICustomerType, IPhase } from '../../../models/interfaces/ICommon';
import { branchCodeData, genderData, customerTypeData, phaseData } from '../customer-create/customer-create.component';
import { CustomerCurrentBillingComponent } from "../customer-current-billing/customer-current-billing.component";
import { CustomerShareCapComponent } from "../customer-share-cap/customer-share-cap.component";

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

  constructor() { }

  branchCode: IBranchCode[] = branchCodeData;
  gender: IGender[] = genderData;
  customerType: ICustomerType[] = customerTypeData;
  phase: IPhase[] = phaseData;
  step = signal(0);

  
  public fg = new FormGroup ({
    customerId: new FormControl({value:'', disabled: true}),
    accountNo:  new FormControl({value:'', disabled: true}),
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

ngOnInit(): void {
    
}

setStep(index: number) {
  this.step.set(index);
}

nextStep() {
  this.step.update(i => i + 1);
}

prevStep() {
  this.step.update(i => i - 1);
}


onSubmit(): void {

}


}
