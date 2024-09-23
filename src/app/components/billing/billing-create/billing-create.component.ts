import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-billing-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatDivider
  ],
  templateUrl: './billing-create.component.html',
  styleUrl: './billing-create.component.css'
})
export class BillingCreateComponent {


  constructor(

  ) {}

  public fg = new FormGroup({
    readingNo: new FormControl(''),
    meterNo: new FormControl(''),
    customerId: new FormControl(''),
    accountNo: new FormControl(''),
    alias: new FormControl(''),
    customerName: new FormControl(''),
    branchCode: new FormControl(''),
    address: new FormControl(''),
    billingMonth: new FormControl(''),
    billingStart: new FormControl(''),
    billingEnd: new FormControl(''),
    billingDueDate: new FormControl(''),
    previousM3: new FormControl(0),
    presentM3: new FormControl(),
    m3Used: new FormControl(),
    rate: new FormControl(0),
    waterAmount: new FormControl(0),
    partsAmount: new FormControl(0),
    maintenanceFee: new FormControl(0),
    lessAmount: new FormControl(0),
    totalAmount: new FormControl(0)
  })


  onSubmit() {
    
  }

}
