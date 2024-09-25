import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-billing-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatDivider
  ],
  templateUrl: './billing-view.component.html',
  styleUrl: './billing-view.component.css'
})
export class BillingViewComponent implements OnInit {
onSubmit() {
throw new Error('Method not implemented.');
}

  constructor(

  ) {}

  public fg = new FormGroup({
    readingNo: new FormControl({value:'', disabled: true}),
    meterNo: new FormControl({value:'', disabled: true}),
    customerId: new FormControl({value:'', disabled: true}),
    accountNo: new FormControl({value:'', disabled: true}),
    alias: new FormControl({value:'', disabled: true}),
    customerName: new FormControl({value:'', disabled: true}),
    branchCode: new FormControl({value:'', disabled: true}),
    address: new FormControl({value:'', disabled: true}),
    billingMonth: new FormControl(''),
    billingStart: new FormControl(''),
    billingEnd: new FormControl(''),
    billingDueDate: new FormControl(''),
    previousM3: new FormControl(0),
    presentM3: new FormControl(),
    m3Used: new FormControl(),
    rate: new FormControl({value:0, disabled: true}),
    waterAmount: new FormControl({value:0, disabled: true}),
    partsAmount: new FormControl({value:0, disabled: true}),
    maintenanceFee: new FormControl(0),
    lessAmount: new FormControl({value:0, disabled: true}),
    totalAmount: new FormControl({value:0, disabled: true}),
    status: new FormControl({value:'', disabled: true}),
  })

  ngOnInit(): void {
      
  }

}
