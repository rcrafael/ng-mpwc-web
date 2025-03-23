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
import { IBillingInfo, IWaterRates } from '../../../models/interfaces/IBilling';
import { BillingService } from '../../../services/billing.service';
import { DecimalPipe, formatDate } from '@angular/common';
import { IMeterDetails } from '../../../models/interfaces/IMeter';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';

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
    private dialog: MatDialog
  ) {}

  selectedCustomerInfo!: ICustomerProfile;
  selectedMeterNo! : IMeterDetails;
  waterRates: IWaterRates[] = [];
  totalBilingAmount: number = 0;
  maxRateUsed: number = 0;

  currentMonth = new Date().getMonth() + 1; //getMonth() is 0 to 11
  currentDate = formatDate(new Date(),'yyyy-MM-dd','en-PH');

  public fg = new FormGroup({
    readingNo: new FormControl<string>({value: '', disabled: true}, Validators.required),
    meterNo: new FormControl<string>('', Validators.required),
    accountNo: new FormControl<string>('',Validators.required),
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
    m3Used: new FormControl(0),
    readingAmount: new FormControl(0),
    parts: new FormControl(0),
    maintenanceFee: new FormControl(0),
    lessAmount: new FormControl(0),
    septageFee: new FormControl(0),
    totalAmount: new FormControl(this.totalBilingAmount ?? 0),
    status: new FormControl({value:'', disabled: true}),
  })


  ngOnInit(): void {
    this.generateReadingNo();
  }
  
  onSubmit() {
    if(!this.fg.valid) {
      alert('Invalid input! Please try again.');
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

    this.billingService.createBilling(params).then(response => {
      

      let params: IMeterDetails = this.selectedMeterNo;
      params.previous = this.selectedMeterNo.present;
      params.present = frm.present ?? 0;

      this.customerService.updateMeterNo(params).then(response => {
        alert('SUCCESS!');
      })
      .catch((err: Error) => {
        alert('ERROR IN UPDATING METER: ' + err.name);
        console.log('Error:', err);
      })
    })
    .catch((err: Error) => {
      alert('ERROR IN CREATING READING: ' + err.name);
      console.log('Error:', err);
    })
    .finally(() => {

    });


  }

  openCustomerDialog(): void {
    const dialogRef = this.dialog.open(BrowseCustomersComponent, {
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== null) {
        console.log('RECEIVED FROM Customer DIALOG: ', data)
        this.selectedCustomerInfo = data
        this.updateFormFromCustomer()
      }
    })
  }

  openMeterDialog(): void {
      const dialogRef = this.dialog.open(BrowseMeterNoComponent, {
        data: this.selectedCustomerInfo,
        width: '50%',
        height: '50%'
      });
  
      dialogRef.afterClosed().subscribe(data => {
        if(data !== null) {
          this.selectedMeterNo = data;
          this.getMeterInfo(this.selectedMeterNo.meterNo);
          this.getWaterRates(this.selectedCustomerInfo.customerType);
        }
      })
    }

  updateFormFromCustomer() {
    this.fg.patchValue({
      customerName: `${this.selectedCustomerInfo.lastName}, ${this.selectedCustomerInfo.firstName} ${this.selectedCustomerInfo.middleName}`,
      branchCode: this.selectedCustomerInfo.branchCode.toString(),
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

  getWaterRates(customerType: number) {
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

  getMeterInfo(meterNo: string) {
    this.customerService.getMeterbyMeterNo(meterNo).then(response => {
      this.updateFormFromMeterNo(response.result);
    })
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
      readingAmount: currentAmount,
    });
    this.computerTotalBillingAmount();
  }

  computerTotalBillingAmount(): void {
    const frm  = this.fg.value;

    this.totalBilingAmount = (frm.readingAmount ?? 0) + (frm.parts ?? 0) + (frm.maintenanceFee ?? 0) + (frm.septageFee ?? 0) - (frm.lessAmount ?? 0)
    this.fg.patchValue({
      totalAmount: this.totalBilingAmount,
    });
  }

  generateReadingNo():void {
    this.billingService.generateReadingNo().then((response: IAPIResponse) => {
      this.fg.patchValue({
        readingNo: response.result.toString()
      })
    })
  }

}
