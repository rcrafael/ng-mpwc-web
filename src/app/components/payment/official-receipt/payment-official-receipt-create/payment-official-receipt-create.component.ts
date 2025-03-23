import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { IOfficialReceipt, IOfficialReceiptDetail, IShareCapital, IShareCbu, IShareSavings } from '../../../../models/interfaces/IOfficialReceipt';
import { BrowseCustomersComponent } from '../../../modals/browse-customers/browse-customers.component';
import { BrowseMeterNoComponent } from '../../../modals/browse-meter-no/browse-meter-no.component';
import { AddDetailsModalComponent } from './add-details-modal/add-details-modal.component';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../../services/customer.service';
import { PaymentService } from '../../../../services/payment.service';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { Utils } from '../../../../common/util';


@Component({
  selector: 'app-payment-official-receipt-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatTableModule
  ],
  templateUrl: './payment-official-receipt-create.component.html',
  styleUrl: './payment-official-receipt-create.component.css',
})
export class PaymentOfficialReceiptCreateComponent implements OnInit {
  
  constructor(
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private customerService: CustomerService,
    private paymentService: PaymentService
  ) {}

  branchCodes: IBranchCode[] = [
    {
      id: 1,
      name: 'Patubig'
    },
    {
      id: 2,
      name: 'Mahabang Parang'
    },
    {
      id: 3,
      name:'Santa Rosa'
    },
    {
      id: 4,
      name: 'Duhat'
    }
  ];

  dataSource!: MatTableDataSource<IOfficialReceiptDetail>;
  tableColumns: string[] = [
    'Reading No',
    'Reading Amount Paid',
    'Parts',
    'Maintenance Fee',
    'Septage Fee',
    'Membership Fee',
    'Tapping',
    'Calibration',
    'Reconnection',
    'Sub Receivable',
    'Penalty',
    'Other Collection',
    'Other Description',
    'Senior Discount',
    'Remarks',
    'Total Amount'
  ];

  currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-PH');
  selectedCustomerInfo!: any;
  orDetails: IOfficialReceiptDetail[] = []; 

  formatAmount = Utils.formatCurrency;

  public fg = new FormGroup({
    accountNo: new FormControl<string>('', Validators.required),
    customerName: new FormControl<string>('', Validators.required),
    branchCode: new FormControl<number>(0),
    address: new FormControl<string>('', Validators.required),
    orNo: new FormControl<string>('', Validators.required),
    orDate: new FormControl<string>(this.currentDate),
    entryDate: new FormControl<string>(this.currentDate),
    createdBy: new FormControl<string>(''),
    shareCapital: new FormControl<number>(0),
    cbu: new FormControl<number>(0),
    savings: new FormControl<number>(0),
    totalBillingAmount: new FormControl<number>(0),
    totalShareAmount: new FormControl<number>(0),
    shareAsPayment: new FormControl<number>(0),
    seniorDiscount: new FormControl<number>(0),
    totalAmountPay: new FormControl<number>(0),
    checkNo: new FormControl<string>(''),
    checkBank: new FormControl<string>(''),
    checkDate: new FormControl<string|null>(null),
  })

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      const customerId = params.get('customerId');
      if(customerId !== undefined && customerId !== null && customerId !== '') {
        this.customerService.getCustomerById(customerId).then((response) => {
          
          if(response.result) {
            this.selectedCustomerInfo = response.result;
            this.fg.patchValue({
              accountNo: this.selectedCustomerInfo.accountNo,
              customerName: `${this.selectedCustomerInfo.lastName}, ${this.selectedCustomerInfo.firstName} ${this.selectedCustomerInfo.middleName}` ,
              branchCode: this.selectedCustomerInfo.branchCode,
              address: this.selectedCustomerInfo.address
            })
          }
          
        });
      }
    })

    this.paymentService.generateNewORno().then((response: IAPIResponse) => {
      if(response.result) {
        this.fg.patchValue({
          orNo: response.result.toString()
        })
      }
    })
    .catch((error: Error) => {
      console.error('ERROR GENERATING NEW OR NUMBER: ', error);
        this.fg.patchValue({
          orNo: ''
        })
    })

  }

  onSubmit(): void {
    if(!this.fg.valid) {
      alert('Invalid Inputs. Please try again.');
      return;
    }

    const frm = this.fg.value;

    let shareCap!: IShareCapital
    let cbu!: IShareCbu
    let savings!: IShareSavings

    if(frm.cbu !== null && frm.cbu !== undefined && frm.cbu > 0) {
      cbu = {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        amount: frm.cbu,
        entryDate: frm.entryDate!,
        transactionType: 1
      }
    }

    if(frm.shareCapital !== null && frm.shareCapital !== undefined && frm.shareCapital > 0) {
      shareCap = {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        amount: frm.shareCapital,
        entryDate: frm.entryDate!,
        transactionType: 1
      }
    }

    if(frm.savings !== null && frm.savings !== undefined && frm.savings > 0) {
      savings = {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        amount: frm.savings,
        entryDate: frm.entryDate!,
        transactionType: 1
      }
    }

    const paymentDetails: IOfficialReceipt = {
      header: {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        orDate: frm.orDate!,
        totalBillingAmount: frm.totalBillingAmount ?? 0,
        totalShareAmount: frm.totalShareAmount ?? 0,
        totalAmountPay: frm.totalAmountPay ?? 0,
        seniorDiscount: frm.seniorDiscount ?? 0,
        entryDate: frm.entryDate!,
        createdBy: frm.createdBy!,
        checkNo: frm.checkNo ?? '',
        checkBank: frm.checkBank ?? '', 
        checkDate: frm.checkDate ?? '',
        status: 1, //1 = complete
      },
      details: this.orDetails,
      shareCapital: shareCap,
      cbu: cbu,
      savings: savings
    }

    console.log('OR PAYLOAD: ', paymentDetails);

    this.paymentService.createORPayment(paymentDetails).then((response: IAPIResponse) => {
      alert('SUCCESS PAYMENT!');
      console.log('PAYMENT RESPONSE:', response);
    })
    .catch((error: Error) => {
      alert('EROR CREATING PAYMENT: ' + error.message);
      console.error("ERROR CREATING PAYMENT: ", error);
    })
    .finally(() => {
      
    });


  }

  openDetailFormDialog(): void {
    const dialogRef = this.dialog.open(AddDetailsModalComponent, {
      data: {customerId: this.selectedCustomerInfo.id},
      width: '90%',
      height: '90%'
    });


    dialogRef.afterClosed().subscribe(data => {
      if(data!== null) {
        this.orDetails = data;
        this.dataSource = new MatTableDataSource<IOfficialReceiptDetail>(this.orDetails);
      }
    })
  }

  openCustomerDialog(): void {
    const dialogRef = this.dialog.open(BrowseCustomersComponent, {
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== null) {
        this.selectedCustomerInfo = data
        this.fg.patchValue({
          accountNo: this.selectedCustomerInfo.accountNo,
          customerName: `${this.selectedCustomerInfo.lastName}, ${this.selectedCustomerInfo.firstName} ${this.selectedCustomerInfo.middleName}` ,
          branchCode: this.selectedCustomerInfo.branchCode,
          address: this.selectedCustomerInfo.address
        })
      }
    })
  }

}
  