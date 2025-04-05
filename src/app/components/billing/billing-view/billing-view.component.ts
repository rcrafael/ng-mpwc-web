import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { BillingService } from '../../../services/billing.service';
import { CommonService } from '../../../services/common.service';
import { DecimalPipe, formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { IBillingInfo } from '../../../models/interfaces/IBilling';
import { Utils } from '../../../common/util';

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
  styleUrl: './billing-view.component.css',
  providers: [DecimalPipe]
})
export class BillingViewComponent implements OnInit {
  
onSubmit() {
throw new Error('Method not implemented.');
}

  constructor(
    private commonService: CommonService,
    private billingService: BillingService,
    private activeRoute: ActivatedRoute,
    private decimalPipe: DecimalPipe
  ) {}

  currentMonth = new Date().getMonth() + 1; //getMonth() is 0 to 11
  currentDate = formatDate(new Date(),'yyyy-MM-dd','en-PH');
  readingId: string = '';
  totalBilingAmount: number = 0;

  public fg = new FormGroup({
    readingNo: new FormControl<string>({value: '', disabled: true}),
    meterNo: new FormControl<string>(''),
    accountNo: new FormControl<string>(''),
    alias: new FormControl<string>(''),
    customerName: new FormControl<string>(''),
    branchCode: new FormControl<string>(''),
    address: new FormControl<string>(''),
    monthOf: new FormControl<number>(this.currentMonth),
    dateFrom: new FormControl<string>(this.currentDate),
    dateTo: new FormControl<string>(this.currentDate),
    dueDate: new FormControl<string>(this.currentDate),
    previous: new FormControl<number>(0),
    present: new FormControl<number>(0),
    m3Used: new FormControl<number>(0),
    readingAmount: new FormControl<string>('0'),
    parts: new FormControl<string>('0'),
    maintenanceFee: new FormControl<string>('0'),
    lessAmount: new FormControl<string>('0'),
    septageFee: new FormControl<string>('0'),
    totalAmount: new FormControl<string>({value:'0', disabled: true}),
    status: new FormControl<string>({value:'', disabled: true}),
  })

  getBranchCode = Utils.getBranchCode;
  getStatus = Utils.getStatusName;
  numberFormat = Utils.formatNumber;

  ngOnInit(): void {
      this.readingId = this.activeRoute.snapshot.paramMap.get('readingId') || '';
      this.loadBillingData();
  }

  loadBillingData(): void {
    this.billingService.getBillingById(this.readingId).then((response: IAPIResponse) => {
      
      const billing: IBillingInfo = response.result as IBillingInfo;
      console.log('BILLING READING AMOUNT: ', billing.readingAmount)

      this.fg.patchValue({
        readingNo: billing.readingNo,
        meterNo: billing.meterNo,
        accountNo: billing.customer?.accountNo,
        customerName: `${billing.customer?.lastName}, ${billing.customer?.firstName} ${billing.customer?.middleName}`,
        // branchCode: this.getBranchCode(billing.customer?.branchCode || -1),
        address: billing.customer?.address,
        monthOf: billing.monthOf,
        dateFrom: billing.dateFrom,
        dateTo: billing.dateTo,
        dueDate: billing.dueDate,
        previous: billing.previous,
        present: billing.present,
        m3Used: billing.m3Used,
        readingAmount: this.numberFormat(billing.readingAmount),
        parts: this.numberFormat(billing.parts),
        maintenanceFee: this.numberFormat(billing.maintenanceFee),
        septageFee: this.numberFormat(billing.septageFee),
        lessAmount: this.numberFormat(billing.lessAmount),
        totalAmount: this.numberFormat(billing.readingAmount + billing.parts + billing.maintenanceFee + billing.septageFee - billing.lessAmount),
        status: this.getStatus(billing.status)
      })
    });
  }

  computerTotalBillingAmount(): void {
    const frm  = this.fg.value;
    const readingAmount: number = this.sanitizeAmount(frm.readingAmount ?? '0');
    const parts: number = this.sanitizeAmount(frm.parts ?? '0');
    const maintenanceFee: number = this.sanitizeAmount(frm.maintenanceFee ?? '0');
    const septageFee: number = this.sanitizeAmount(frm.septageFee ?? '0');
    const lessAmount: number = this.sanitizeAmount(frm.lessAmount?? '0');

    this.totalBilingAmount = readingAmount + parts + maintenanceFee + septageFee - lessAmount
    this.fg.patchValue({
      totalAmount: this.numberFormat(this.totalBilingAmount),
    });
  }


  sanitizeAmount(amount: String): number {
    return parseFloat(amount.replace(/,/g, ''));
  }

}