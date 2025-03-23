import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BillingService } from '../../../services/billing.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Utils } from '../../../common/util';

@Component({
  selector: 'app-customer-current-billing',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIcon,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './customer-current-billing.component.html',
  styleUrl: './customer-current-billing.component.css'
})
export class CustomerCurrentBillingComponent implements OnInit {

  constructor(
    private billingService: BillingService,
    private router: Router
  ) {}

  @Input() customerId: string = '-1';

  tableCols: string[] = [
    'Reading No',
    'Meter No',
    'Previous',
    'Present',
    'Meter Used',
    'Month',
    'From Date',
    'To Date',
    'Due Date',
    'Total Amount To Pay',
    'Reading Amount',
    'Parts',
    'Maintenance Fee',
    'Septage Fee',
    'Less',
    'Status'
  ];

  dataSource = new MatTableDataSource([]);
  isPaymentBtnVisible:boolean = false;

  formatAmount = Utils.formatCurrency;
  getTransactionStatus = Utils.getStatusName;
  getMonth = Utils.getMonth;
  
  ngOnInit():void {
    this.billingService.getRecentBillingByCustomerId(this.customerId).then((response:IAPIResponse) => {
      const result: any = response.result;
      this.dataSource.data = result;
    
      this.isPaymentBtnVisible = result.some((e:any) => e.status === 2); //check if there's incomplete status
    })
  }

  onPaymentBtnClick(): void {
    this.router.navigate(['payment/official-receipt/create', this.customerId])
  }

}
