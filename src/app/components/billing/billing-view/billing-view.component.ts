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
import { IBillingInfo, IUpdateBilling } from '../../../models/interfaces/IBilling';
import { Utils } from '../../../common/util';
import { IWaterRates } from '../../../models/interfaces/IWaterRates';
import { transactionStatus } from '../../../common/enum';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';

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
  


  constructor(
    private commonService: CommonService,
    private billingService: BillingService,
    private activeRoute: ActivatedRoute,
    private toast: ToastrService
  ) {}

  toastTitlePrefix = 'Billing - ';

  COMPLETE_STATUS: number = 1;
  INCOMPLETE_STATUS: number = 2;
  VOID_STATUS: number = 4;

  currentMonth = new Date().getMonth() + 1; //getMonth() is 0 to 11
  currentDate = formatDate(new Date(),'yyyy-MM-dd','en-PH');
  readingId: string = '';
  totalBilingAmount: number = 0;
  currentBiling!: IBillingInfo;
  waterRates: IWaterRates[] = [];
  maxRateUsed: number = 0;
  transStatus:number = 0;

  public fg = new FormGroup({
    readingNo: new FormControl<string>({value: '', disabled: true}),
    meterNo: new FormControl<string>({value: '', disabled: true}),
    accountNo: new FormControl<string>({value: '', disabled: true}),
    alias: new FormControl<string>({value: '', disabled: true}),
    customerName: new FormControl<string>({value: '', disabled: true}),
    branchCode: new FormControl<string>({value: '', disabled: true}),
    address: new FormControl<string>({value: '', disabled: true}),
    monthOf: new FormControl<number>(this.currentMonth),
    dateFrom: new FormControl<string>(this.currentDate),
    dateTo: new FormControl<string>(this.currentDate),
    dueDate: new FormControl<string>(this.currentDate),
    previous: new FormControl<number>(0),
    present: new FormControl<number>(0),
    m3Used: new FormControl<number>({value: 0, disabled: true}),
    readingAmount: new FormControl<string>({value: '0.00', disabled: true}),
    parts: new FormControl<string>('0.00'),
    maintenanceFee: new FormControl<string>('0.00'),
    lessAmount: new FormControl<string>({value: '0.00', disabled: true}),
    septageFee: new FormControl<string>({value: '0.00', disabled: true}),
    totalAmount: new FormControl<string>({value:'0.00', disabled: true}),
    status: new FormControl<string>({value:'', disabled: true}),
  })

  getBranchCode = Utils.getBranchCode;
  getStatus = Utils.getStatusName;
  numberFormat = Utils.formatNumber;
  sanitizeAmount = Utils.sanitizeAmount;

  ngOnInit(): void {
      this.readingId = this.activeRoute.snapshot.paramMap.get('readingId') || '';
      this.loadBillingData();
  }

  async loadBillingData(): Promise<void> {
    this.billingService.getBillingById(this.readingId).then(async (response: IAPIResponse) => {
      
      const billing: IBillingInfo = response.result as IBillingInfo;
      this.currentBiling = billing;

      this.fg.patchValue({
        readingNo: billing.readingNo,
        meterNo: billing.meterNo,
        accountNo: billing.customer?.accountNo,
        customerName: `${billing.customer?.lastName}, ${billing.customer?.firstName} ${billing.customer?.middleName}`,
        alias: billing.meterInfo?.alias,
        branchCode: this.getBranchCode(billing.meterInfo?.branchCode || -1),
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
      });

      this.transStatus = billing.status;
      await this.getWaterRates(billing.meterInfo?.customerType!);
    });
  }

  computeTotalBillingAmount(): void {
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

  onSubmit(): void {
    
    console.log('FORM: ', this.fg);

    if(!this.fg.valid) {
      this.toast.error(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.ERROR);
      return;
    }
    
    this.updateBilling();

  }

  updateBilling(): void {

    const data = this.fg.getRawValue();

    const params: IUpdateBilling = {
      id: this.readingId,
      readingNo: data.readingNo!,
      monthOf: data.monthOf!,
      dateFrom: data.dateFrom!,
      dateTo: data.dateTo!,
      dueDate: data.dueDate!,
      previous: data.previous!,
      present: data.present!,
      m3Used: data.m3Used!,
      readingAmount: this.sanitizeAmount(data.readingAmount!),
      parts: this.sanitizeAmount(data.parts!) ,
      maintenanceFee: this.sanitizeAmount(data.maintenanceFee!),
      septageFee: this.sanitizeAmount(data.septageFee!),
      totalAmount: this.sanitizeAmount(data.totalAmount!)
    }

    this.billingService.updateBilling(params).then((response: IAPIResponse) => {
      this.toast.success(ToastrMessage.SUCCESS_UPDATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      console.log('updateBilling() SUCCESS!', response); 
    }) 
    .catch((err:Error) => {
      this.toast.error(ToastrMessage.ERROR_UPDATE + ': ' + err.message, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.error('ERROR UPDATING BILLING RECORD OCCURED: ', err.message);
    })
    .finally(() => {
      console.log('updateBilling() finished')
    }) 

  }

  async getWaterRates(customerType: number) {

    if (customerType === 1) { // 1 - residential
      this.billingService.getActiveWaterRatesResidential().then((response) => {
        const resp = response.result as IWaterRates[];
        this.waterRates = structuredClone(resp)
      })
    } else { // 2 - commercial
      this.billingService.getActiveWaterRatesCommercial().then((response) => {
        const resp = response.result as IWaterRates[];
        this.waterRates = structuredClone(resp)
      })
    }
  } 

  onBlurUsage(): void {
    this.computeUsageAmount();
  }

  onBlurAmounts(e: Event, formControlName: string): void {
    const input = e.target as HTMLInputElement;
    this.computerTotalBillingAmount();
    this.fg.get(formControlName)?.setValue(this.numberFormat(this.sanitizeAmount(input.value) ?? 0))
  }

  computeUsageAmount() {
    const prev: number = this.fg.get('previous')?.value ? this.fg.get('previous')?.value! : 0;
    const present: number = this.fg.get('present')?.value ? this.fg.get('present')?.value! : 0;
    const useM3: number = present - prev;
    this.fg.patchValue({
      m3Used: useM3
    })

    let billingAmount: number = 0;
    let baseAmount: number = 0;

    let currentAmount:number = 0;
    let previousCeiling: number | null = 0;
    let currentCeiling: number | null = 0;

    let idx: number = 0;

    for (let r of this.waterRates) {
      
      if(r.to !== null) {
      
        if(r.isBaseAmount) {
          baseAmount = r.ratingValue;
          currentAmount = baseAmount;
        } else {
          if (useM3 >= r.to) {
            previousCeiling = this.waterRates[idx-1].to ? this.waterRates[idx-1].to : 0 ;
            currentCeiling = r.to ? r.to : 0;
            currentAmount = ((currentCeiling - (previousCeiling ? previousCeiling : 0)) * r.ratingValue) + baseAmount;
            baseAmount = currentAmount;
          } else {
            previousCeiling = this.waterRates[idx-1].to ? this.waterRates[idx-1].to : 0 ;
            currentAmount = ((useM3 - (previousCeiling ? previousCeiling : 0)) * r.ratingValue) + baseAmount;
            baseAmount = currentAmount;
            this.maxRateUsed = r.ratingValue;
            break;
          }
          
        }

      } else {
        previousCeiling = this.waterRates[idx-1].to ? this.waterRates[idx-1].to : 0 ;
        currentCeiling = r.to ? r.to : 0;
        currentAmount = ((useM3 - (previousCeiling ? previousCeiling : 0)) * r.ratingValue) + baseAmount;
        baseAmount = currentAmount;
      }
      // console.log('from: ', r.from , 'to: ', r.to, 'rate: ', r.ratingValue, 'baseAmount: ', baseAmount, 'reading Amount: ', currentAmount);
      idx += 1;
    };
    
    this.fg.patchValue({
      readingAmount: this.numberFormat(currentAmount),
    });
    this.computerTotalBillingAmount();
  }

  computerTotalBillingAmount(): void {
    console.log('FORM FROM COMPUTE: ', this.fg.getRawValue());
    const frm  = this.fg.getRawValue();
    this.totalBilingAmount = (this.sanitizeAmount(frm.readingAmount ?? '0')) + (this.sanitizeAmount(frm.parts ?? '0')) + (this.sanitizeAmount(frm.maintenanceFee! ?? '0')) + (this.sanitizeAmount(frm.septageFee ?? '0')) - (this.sanitizeAmount(frm.lessAmount ?? '0'))
    this.fg.patchValue({
      totalAmount: this.numberFormat(this.totalBilingAmount),
    });
  }

}