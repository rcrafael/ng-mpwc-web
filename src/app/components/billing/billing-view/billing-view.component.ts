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
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { SeptageFeeService } from '../../../services/septage-fee.service';

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
    private septageService: SeptageFeeService,
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
  septageFees!: any;


  fg = new FormGroup({
    readingNo: new FormControl<string>({value: '', disabled: true}),
    meterNo: new FormControl<string>({value: '', disabled: true}),
    accountNo: new FormControl<string>({value: '', disabled: true}),
    alias: new FormControl<string>({value: '', disabled: true}),
    customerName: new FormControl<string>({value: '', disabled: true}),
    branchCode: new FormControl<string>({value: '', disabled: true}),
    phase: new FormControl<string>(''),
    customerType: new FormControl<string>(''),
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
  getPhase = Utils.getPhase;
  getMeterType = Utils.getCustomerType;

  async ngOnInit(): Promise<void> {
      this.readingId = this.activeRoute.snapshot.paramMap.get('readingId') || '';
 
      try {
        await this.loadBillingData();
        await this.getSeptageFees();
        await this.getWaterRates(this.currentBiling.meterInfo?.customerType || 1);
      } catch (error) {
        this.commonService.showSpinner(false);
      } finally {
        this.commonService.showSpinner(false);
      }
      
  }

  async loadBillingData(): Promise<void> {
    this.commonService.showSpinner(true);
    await this.billingService.getBillingById(this.readingId).then(async (response: IAPIResponse) => {
      
      const billing: IBillingInfo = response.result as IBillingInfo;
      this.currentBiling = billing;

      this.fg.patchValue({
        readingNo: billing.readingNo,
        meterNo: billing.meterNo,
        accountNo: billing.customer?.accountNo,
        customerName: `${billing.customer?.lastName}, ${billing.customer?.firstName} ${billing.customer?.middleName}`,
        alias: billing.meterInfo?.alias,
        branchCode: this.getBranchCode(billing.meterInfo?.branchCode || -1),
        phase: this.getPhase(billing.meterInfo?.phase || -1),
        customerType: this.getMeterType(billing.meterInfo?.customerType || -1),
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
      }, {emitEvent: false});


      this.fg.controls.m3Used.valueChanges.subscribe(() => this.computeTotalBillingAmount());
      this.fg.controls.readingAmount.valueChanges.subscribe(() => this.computeTotalBillingAmount());
      this.fg.controls.parts.valueChanges.subscribe(() => this.computeTotalBillingAmount());
      this.fg.controls.maintenanceFee.valueChanges.subscribe(() => this.computeTotalBillingAmount());
      this.fg.controls.septageFee.valueChanges.subscribe(() => this.computeTotalBillingAmount());
      this.fg.controls.lessAmount.valueChanges.subscribe(() => this.computeTotalBillingAmount());

      this

      this.transStatus = billing.status;
      await this.getWaterRates(billing.meterInfo?.customerType!);
    }).catch((error) => {
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA + ': ' + error.message, this.toastTitlePrefix + ToastrTitle.ERROR);
    }).finally(() => {
      this.commonService.showSpinner(false);
    });
  }

  computeTotalBillingAmount(): void {
    const frm  = this.fg.getRawValue();
    
    if(frm.maintenanceFee === null) console.log('MAINTENANCE FEE IS NULL');
    if(frm.maintenanceFee === '') console.log('MAINTENANCE FEE IS EMPTY');

    const readingAmount: number = this.sanitizeAmount(frm.readingAmount || '0');
    const parts: number = this.sanitizeAmount(frm.parts || '0');
    const maintenanceFee: number = this.sanitizeAmount(frm.maintenanceFee || '0');
    const septageFee: number = this.sanitizeAmount(frm.septageFee || '0');
    const lessAmount: number = this.sanitizeAmount(frm.lessAmount || '0');

    this.totalBilingAmount = (readingAmount + parts + maintenanceFee + septageFee) - lessAmount

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

  onBlurUsage(): void {
    this.computeUsageAmount();
  }

  onBlurAmounts(e: Event, formControlName: string): void {
    const input = e.target as HTMLInputElement;
    this.fg.get(formControlName)?.setValue(this.numberFormat(this.sanitizeAmount(input.value) ?? 0));
    this.computeTotalBillingAmount();
  }

  computeUsageAmount() {
    const prev: number = this.fg.get('previous')?.value ? this.fg.get('previous')?.value! : 0;
    const present: number = this.fg.get('present')?.value ? this.fg.get('present')?.value! : 0;
    const useM3: number = present - prev;
    this.fg.patchValue({
      m3Used: useM3,
      septageFee: this.numberFormat(this.computeSeptageFee(useM3)) 
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
          if(useM3 < r.to) {
            break;
          }
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
    this.computeTotalBillingAmount();
  }

  async getSeptageFees(): Promise<void> {
    await this.septageService.getSeptageFees().then((response: IAPIResponse) => {
      this.septageFees = response.result;
    })
    .catch((err: Error) => {
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA + ': ' + 'Septage Fees', this.toastTitlePrefix + ToastrTitle.ERROR);
      console.error('FAILED TO FETCH SEPTAGE FEES: ', err.message);
    });
  }

  async getWaterRates(customerType: number): Promise<void> {

    if (customerType === 1) { // 1 - residential
      await this.billingService.getActiveWaterRatesResidential().then((response) => {
        const resp = response.result as IWaterRates[];
        this.waterRates = structuredClone(resp);
      });
    } else { // 2 - commercial
      await this.billingService.getActiveWaterRatesCommercial().then((response) => {
        const resp = response.result as IWaterRates[];
        this.waterRates = structuredClone(resp);
      });
    }
  } 

  computeSeptageFee(m3Used: number): number {
    
    if(m3Used <= 10) {
      return this.septageFees.minimumZeroTo10;
    } else if(m3Used === 11) {
      return this.septageFees.m3To11;
    } else if(m3Used === 12) {
      return this.septageFees.m3To12;
    } else if(m3Used === 13) {
      return this.septageFees.m3To13;
    } else if(m3Used === 14) {
      return this.septageFees.m3To14;
    } else if(m3Used === 15) {
      return this.septageFees.m3To15;
    } else if(m3Used === 16) {
      return this.septageFees.m3To16;
    } else if(m3Used === 17) {
      return this.septageFees.m3To17;
    } else if(m3Used === 18) {
      return this.septageFees.m3To18;
    } else if(m3Used === 19) {
      return this.septageFees.m3To19;
    } else if(m3Used === 20) {
      return this.septageFees.m3To20;
    } else if(m3Used === 21) {
      return this.septageFees.m3To21;
    } else if(m3Used === 22) {
      return this.septageFees.m3To22;
    } else if(m3Used === 23) {
      return this.septageFees.m3To23;
    } else if(m3Used === 24) {
      return this.septageFees.m3To24;
    } else if(m3Used === 25) {
      return this.septageFees.m3To25;
    } else if(m3Used === 26) {
      return this.septageFees.m3To26;
    } else if(m3Used === 27) {
      return this.septageFees.m3To27;
    } else if(m3Used === 28) {
      return this.septageFees.m3To28;
    } else if(m3Used === 29) {
      return this.septageFees.m3To29;
    } else if(m3Used >= 30) {
      return this.septageFees.m3To30;
    } else {
      return 0;
    }

  }

}