import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { BrowseCustomersComponent } from '../../modals/browse-customers/browse-customers.component';
import { MatDialog } from '@angular/material/dialog';
import { BrowseMeterNoComponent } from '../../modals/browse-meter-no/browse-meter-no.component';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';
import { CustomerService } from '../../../services/customer.service';
import { IWaterRates } from '../../../models/interfaces/IBilling';
import { BillingService } from '../../../services/billing.service';

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
    private customerService: CustomerService,
    private billingService: BillingService,
    private dialog: MatDialog
  ) {}

  selectedCustomerInfo!: ICustomerProfile;
  selectedMeterNo! : any;

  waterRates: IWaterRates[] = [];

  public fg = new FormGroup({
    meterNo: new FormControl('', Validators.required),
    accountNo: new FormControl('',Validators.required),
    alias: new FormControl(''),
    customerName: new FormControl(''),
    branchCode: new FormControl(''),
    address: new FormControl(''),
    billingMonth: new FormControl(''),
    billingStart: new FormControl(''),
    billingEnd: new FormControl(''),
    billingDueDate: new FormControl(''),
    previousM3: new FormControl<number>(0),
    presentM3: new FormControl<number>(0),
    m3Used: new FormControl(0),
    rate: new FormControl(0),
    waterAmount: new FormControl(0),
    partsAmount: new FormControl(0),
    maintenanceFee: new FormControl(0),
    lessAmount: new FormControl(0),
    totalAmount: new FormControl(0),
    status: new FormControl({value:'', disabled: true}),
  })

  
  onSubmit() {
    
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
        width: '90%',
        height: '90%'
      });
  
      dialogRef.afterClosed().subscribe(data => {
        if(data !== null) {
          console.log('RECEIVED FROM meter DIALOG: ', data);
          this.selectedMeterNo = data;
          this.getMeterInfo(this.selectedMeterNo.meterNo);
          this.getWaterRates(this.selectedCustomerInfo.customerType);
        }
      })
    }

  updateFormFromCustomer() {
    this.fg.patchValue({
      customerName: `${this.selectedCustomerInfo.lastName}, ${this.selectedCustomerInfo.firstName} ${this.selectedCustomerInfo.middleName}`,
      branchCode: this.selectedCustomerInfo.branchCode,
      address: this.selectedCustomerInfo.address,
      accountNo: this.selectedCustomerInfo.accountNo,
    });
  }

  updateFormFromMeterNo(data:any) {
    this.fg.patchValue({
      meterNo: data.meterNo,
      previousM3: data.previous ? data.previous : 0,
      presentM3: data.present ? data.present : 0,
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

  onBlur(): void {
    this.computeUsageAmount();
  }

  computeUsageAmount() {
    const prev: number = this.fg.get('previousM3')?.value ? this.fg.get('previousM3')?.value! : 0;
    const present: number = this.fg.get('presentM3')?.value ? this.fg.get('presentM3')?.value! : 0;
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
            console.log('M3used: ', useM3, 'rate.To: ', r.to)
            previousCeiling = this.waterRates[idx-1].to ? this.waterRates[idx-1].to : 0 ;
            currentCeiling = r.to ? r.to : 0;
            currentAmount = ((currentCeiling - (previousCeiling ? previousCeiling : 0)) * r.ratingValue) + baseAmount;
            baseAmount = currentAmount;
          } else {
            console.log('M3used: ', useM3, 'rate.To: ', r.to)
            previousCeiling = this.waterRates[idx-1].to ? this.waterRates[idx-1].to : 0 ;
            currentAmount = ((useM3 - (previousCeiling ? previousCeiling : 0)) * r.ratingValue) + baseAmount;
            baseAmount = currentAmount;
            break;
          }
          
        }

      } else {
        previousCeiling = this.waterRates[idx-1].to ? this.waterRates[idx-1].to : 0 ;
        currentCeiling = r.to ? r.to : 0;
        currentAmount = ((useM3 - (previousCeiling ? previousCeiling : 0)) * r.ratingValue) + baseAmount;
        baseAmount = currentAmount;
      }
      console.log('from: ', r.from , 'to: ', r.to, 'rate: ', r.ratingValue, 'baseAmount: ', baseAmount, 'reading Amount: ', currentAmount);
      idx += 1;
    };

    this.fg.patchValue({
      waterAmount: currentAmount,
    });
  }

}
