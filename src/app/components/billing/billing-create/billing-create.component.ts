import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { BrowseCustomersComponent } from '../../modals/browse-customers/browse-customers.component';
import { MatDialog } from '@angular/material/dialog';
import { BrowseMeterNoComponent } from '../../modals/browse-meter-no/browse-meter-no.component';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';
import { CustomerService } from '../../../services/customer.service';
import { IBillingInfo } from '../../../models/interfaces/IBilling';
import { BillingService } from '../../../services/billing.service';
import { DecimalPipe, formatDate } from '@angular/common';
import { IMeterDetails } from '../../../models/interfaces/IMeter';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { IWaterRates } from '../../../models/interfaces/IWaterRates';
import { Utils } from '../../../common/util';
import { SeptageFeeService } from '../../../services/septage-fee.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { IDefaultValues } from '../../../models/interfaces/IDefaultValues';
import { DefaultValuesService } from '../../../services/default-values.service';

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
export class BillingCreateComponent implements OnInit {


  constructor(
    private customerService: CustomerService,
    private billingService: BillingService,
    private septageService: SeptageFeeService,
    private defaultValuesService: DefaultValuesService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private router: Router,
  ) {}

  toastTitlePrefix = 'Billing - ';

  selectedCustomerInfo!: ICustomerProfile;
  selectedMeterNo! : IMeterDetails;
  waterRates: IWaterRates[] = [];
  totalBilingAmount: number = 0;
  maxRateUsed: number = 0;
  septageFees!: any;

  currentMonth = new Date().getMonth() + 1; //getMonth() is 0 to 11
  currentDate = formatDate(new Date(),'yyyy-MM-dd','en-PH');

  defaultValues!: IDefaultValues;

  public fg = new FormGroup({
    readingNo: new FormControl<string>({value: '', disabled: true}, Validators.required),
    meterNo: new FormControl<string>('', Validators.required),
    accountNo: new FormControl<string>('',Validators.required),
    alias: new FormControl<string>(''),
    customerName: new FormControl<string>(''),
    branchCode: new FormControl<string>(''),
    phase: new FormControl<string>(''),
    customerType: new FormControl<string>(''),
    address: new FormControl<string>(''),
    monthOf: new FormControl<number>(this.currentMonth),
    dateFrom: new FormControl<string>(this.currentDate),
    dateTo: new FormControl<string>(this.currentDate),
    dueDate: new FormControl<string>(this.currentDate),
    previous: new FormControl<number>(0),
    present: new FormControl<number>(0),
    m3Used: new FormControl(0),
    readingAmount: new FormControl(0),
    parts: new FormControl(0),
    maintenanceFee: new FormControl(0),
    lessAmount: new FormControl(0),
    septageFee: new FormControl(0),
    totalAmount: new FormControl(this.totalBilingAmount ?? 0),
    status: new FormControl({value:'', disabled: true}),
  });


  getBranchCode = Utils.getBranchCode;
  getPhase = Utils.getPhase;
  getCustomerType = Utils.getCustomerType;
  formatNumber = Utils.formatNumber;
  sanitizeAmount = Utils.sanitizeAmount;

  async ngOnInit(): Promise<void> {
    try {
      this.commonService.showSpinner(true);
      await this.generateReadingNo();
      await this.getSeptageFees();

      this.defaultValues = await this.defaultValuesService.getDefaultValuesFromSession() as IDefaultValues;

    } catch (error) {
      this.commonService.showSpinner(false);
    }
  }
  
  async onSubmit(): Promise<void> {
    if(!this.fg.valid) {
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.ERROR);
      return;
    }

    const frm = this.fg.value;

    let params: IBillingInfo = {
      readingNo: frm.readingNo!,
      meterNo: frm.meterNo!,
      customerId: this.selectedCustomerInfo.id!,
      monthOf: frm.monthOf!,
      dateFrom: frm.dateFrom!, 
      dateTo: frm.dateTo!,
      dueDate: frm.dueDate!,
      previous: frm.previous!,
      present: frm.present!,
      m3Used: frm.m3Used!,
      rating: this.maxRateUsed,
      readingAmount: frm.readingAmount!,
      parts: frm.parts ? frm.parts : 0,
      maintenanceFee: frm.maintenanceFee ? frm.maintenanceFee : 0,
      lessAmount: frm.lessAmount ? frm.lessAmount : 0,
      totalAmount: frm.totalAmount ? frm.totalAmount : 0,
      septageFee: frm.septageFee ? frm.septageFee : 0,
      remarks: '',
      status: 2 //2 = incomplete; by default
    }

    this.commonService.showSpinner(true);
    await this.billingService.createBilling(params).then(async mainResponse => {

      let params: IMeterDetails = this.selectedMeterNo;
      params.previous = this.selectedMeterNo.present;
      params.present = frm.present ?? 0;

      await this.customerService.updateMeterNo(params).then( secondResponse => {
        this.toast.success(ToastrMessage.SUCCESS_CREATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
        this.router.navigateByUrl('billing');
      })
      .catch((err: Error) => {
        this.toast.error(ToastrMessage.ERROR_CREATE + ': ' + err.message, this.toastTitlePrefix + ToastrTitle.ERROR);
        console.log('Error:', err);
        throw err;
      })
    })
    .catch((err: Error) => {
      this.toast.error(ToastrMessage.ERROR_CREATE + ': ' + err.message, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.log('Error:', err);
    })
    .finally(() => {
      this.commonService.showSpinner(false);
    });

  }

  openCustomerDialog(): void {
    const dialogRef = this.dialog.open(BrowseCustomersComponent, {
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== null) {
        console.log('RECEIVED FROM Customer DIALOG: ', data);
        this.selectedCustomerInfo = data;
        this.updateFormFromCustomer();
      }
    })
  }

  openMeterDialog(): void {
      const dialogRef = this.dialog.open(BrowseMeterNoComponent, {
        data: this.selectedCustomerInfo.id,
        width: '70%',
        height: '50%'
      });
  
      dialogRef.afterClosed().subscribe(async data => {
        if(data !== null) {
          this.selectedMeterNo = data;
          try {
            this.commonService.showSpinner(true);
            await this.getMeterInfo(this.selectedMeterNo.meterNo);
            await this.getWaterRates(this.selectedMeterNo.customerType);
            this.fg.patchValue({
              branchCode: this.getBranchCode(data.branchCode),
              alias: data.alias,
              phase: this.getPhase(data.phase),
              customerType: this.getCustomerType(data.customerType),
              maintenanceFee: this.sanitizeAmount(this.defaultValues.maintenanceFee.toString()),
            });
            console.log("CUSTOMER TYPE: ", this.selectedMeterNo.customerType);
          } catch (error) {
            console.log('Error: ', error);
          } finally {
            this.commonService.showSpinner(false);
          }
        }
      })
    }

  updateFormFromCustomer() {
    this.fg.patchValue({
      customerName: `${this.selectedCustomerInfo.lastName}, ${this.selectedCustomerInfo.firstName} ${this.selectedCustomerInfo.middleName}`,
      // branchCode: this.selectedCustomerInfo.branchCode.toString(),
      address: this.selectedCustomerInfo.address,
      accountNo: this.selectedCustomerInfo.accountNo,
    });
  }

  updateFormFromMeterNo(data:any) {
    this.fg.patchValue({
      meterNo: data.meterNo,
      previous:  data.present ?? 0, //use the latest present value as previous value to create new reading
      present: 0, // default to zero when creating new reading
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

  async getMeterInfo(meterNo: string): Promise<void> {
    await this.customerService.getMeterbyMeterNo(meterNo).then(response => {
      this.updateFormFromMeterNo(response.result);
    });
  }

  onBlurUsage(): void {
    this.computeUsageAmount();
  }

  onBlurAmounts(): void {
    this.computerTotalBillingAmount();
  }

  computeUsageAmount() {
    const prev: number = this.fg.get('previous')?.value ? this.fg.get('previous')?.value! : 0;
    const present: number = this.fg.get('present')?.value ? this.fg.get('present')?.value! : 0;
    const useM3: number = present - prev;

    this.fg.patchValue({
      m3Used: useM3,
      septageFee: this.computeSeptageFee(useM3)
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
    }

    console.log('currentAmount: ', currentAmount);
    console.log('baseAmount: ', baseAmount);
    this.fg.patchValue({
      readingAmount: currentAmount,
    });
    this.computerTotalBillingAmount();
  }

  computerTotalBillingAmount(): void {
    const frm  = this.fg.value;

    this.totalBilingAmount = (frm.readingAmount ?? 0) + (frm.parts ?? 0) + (frm.maintenanceFee ?? 0) + (frm.septageFee ?? 0) - (frm.lessAmount ?? 0);
    this.fg.patchValue({
      totalAmount: this.totalBilingAmount,
    });
  }

  async generateReadingNo(): Promise<void> {
    this.commonService.showSpinner(true);
    await this.billingService.generateReadingNo().then((response: IAPIResponse) => {
      this.fg.patchValue({
        readingNo: response.result.toString()
      })
    });
    this.commonService.showSpinner(false);
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
