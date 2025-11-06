import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Utils } from '../../../../common/util';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { IOfficialReceipt, IOfficialReceiptDetail, IOfficialReceiptWithDetails, IShareCapital, IShareCbu, IShareSavings } from '../../../../models/interfaces/IOfficialReceipt';
import { CustomerService } from '../../../../services/customer.service';
import { PaymentService } from '../../../../services/payment.service';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { BrowseCustomersComponent } from '../../../modals/browse-customers/browse-customers.component';
import { AddDetailsModalComponent } from '../payment-official-receipt-create/add-details-modal/add-details-modal.component';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';

@Component({
  selector: 'app-payment-official-receipt-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatTableModule,
  ],
  templateUrl: './payment-official-receipt-view.component.html',
  styleUrl: './payment-official-receipt-view.component.css'
})
export class PaymentOfficialReceiptViewComponent implements OnInit {

constructor(
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private customerService: CustomerService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  toastTitlePrefix = 'Official Receipt - '

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
  formatNumber = Utils.formatNumber;
  sanitizeAmount = Utils.sanitizeAmount;

  public fg = new FormGroup({
    accountNo: new FormControl<string>('', Validators.required),
    customerName: new FormControl<string>('', Validators.required),
    branchCode: new FormControl<number>(0),
    address: new FormControl<string>('', Validators.required),
    orNo: new FormControl<string>('', Validators.required),
    orDate: new FormControl<string>(this.currentDate),
    entryDate: new FormControl<string>(this.currentDate),
    createdBy: new FormControl<string>(''),
    shareCapital: new FormControl<string>('0.00'),
    cbu: new FormControl<string>('0.00'),
    savings: new FormControl<string>('0.00'),
    totalBillingAmount: new FormControl<string>('0.00'),
    totalShareAmount: new FormControl<string>('0.00'),
    // shareAsPayment: new FormControl<string>('0.00'),
    seniorDiscount: new FormControl<string>('0.00'),
    totalAmountPay: new FormControl<string>('0.00'),
    checkNo: new FormControl<string>(''),
    checkBank: new FormControl<string>(''),
    checkDate: new FormControl<string|null>(null),
  })

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      const orId = params.get('orId');
      if(orId !== undefined && orId !== null && orId !== '') {
        this.paymentService.getORWithCustomerInfoById(orId).then(async (response: IAPIResponse) => {
          
          if(response.result) {
            const result = response.result as IOfficialReceiptWithDetails;
            this.selectedCustomerInfo = result.header.customer;
            this.orDetails = result.details;
            this.dataSource = new MatTableDataSource<IOfficialReceiptDetail>(this.orDetails);
            
            let username = '';
            try {
              await this.authService.getUsernameById(result.header.createdBy).then((res) => {
                console.log('RESPONSE FOR: ', res);
                username = res.result as any;
              })
            } catch(err) {
              console.error('ERROR FETCHING USERNAME BY ID: ', err);
              this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
            }
            
            this.fg.patchValue({
              accountNo: this.selectedCustomerInfo.accountNo,
              customerName: `${this.selectedCustomerInfo.lastName}, ${this.selectedCustomerInfo.firstName} ${this.selectedCustomerInfo.middleName}` ,
              branchCode: this.selectedCustomerInfo.branchCode,
              address: this.selectedCustomerInfo.address,
              orNo: result.header.orNo,
              orDate: result.header.orDate,
              entryDate: result.header.entryDate,
              createdBy:  username || '',
              shareCapital: this.formatNumber(result.shareCapital?.amount ?? 0) ,
              cbu: this.formatNumber(result.shareCbu?.amount ?? 0),
              savings: this.formatNumber(result.shareSavings?.amount ?? 0),
              totalBillingAmount: this.formatNumber(result.header.totalBillingAmount ?? 0),
              totalShareAmount: this.formatNumber(result.header.totalShareAmount ?? 0),
              // shareAsPayment: this.formatNumber(result.header.totalShareAmount ?? 0), 
              seniorDiscount: this.formatNumber(result.header.seniorDiscount ?? 0),
              totalAmountPay: this.formatNumber(result.header.totalAmountPay ?? 0),
              checkNo: result.header.checkNo,
              checkBank: result.header.checkBank,
              checkDate: result.header.checkDate
            })
          }
          
        });
      }
    })

  }

  onSubmit(): void {
    if(!this.fg.valid) {
      alert('Invalid Inputs. Please try again.');
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.INVALID_INPUT);
      return;
    }

    const frm = this.fg.value;

    let shareCap!: IShareCapital
    let cbu!: IShareCbu
    let savings!: IShareSavings

    if(frm.cbu !== null && frm.cbu !== undefined && this.sanitizeAmount(frm.cbu ?? '0') > 0) {
      cbu = {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        amount: this.sanitizeAmount(frm.cbu ?? '0'),
        entryDate: frm.entryDate!,
        transactionType: 1
      }
    }

    if(frm.shareCapital !== null && frm.shareCapital !== undefined && this.sanitizeAmount(frm.shareCapital ??'0') > 0) {
      shareCap = {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        amount: this.sanitizeAmount(frm.shareCapital ?? '0'),
        entryDate: frm.entryDate!,
        transactionType: 1
      }
    }

    if(frm.savings !== null && frm.savings !== undefined && this.sanitizeAmount(frm.savings ?? '0') > 0) {
      savings = {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        amount: this.sanitizeAmount(frm.savings ?? '0'),
        entryDate: frm.entryDate!,
        transactionType: 1
      }
    }

    const paymentDetails: IOfficialReceipt = {
      header: {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        orDate: frm.orDate!,
        totalBillingAmount: this.sanitizeAmount(frm.totalBillingAmount ?? '0'),
        totalShareAmount: this.sanitizeAmount(frm.totalShareAmount ?? '0'),
        totalAmountPay: this.sanitizeAmount(frm.totalAmountPay ?? '0'),
        seniorDiscount: this.sanitizeAmount(frm.seniorDiscount ?? '0'),
        entryDate: frm.entryDate!,
        createdBy: this.authService.getUserId(),
        checkNo: frm.checkNo ?? '',
        checkBank: frm.checkBank ?? '', 
        checkDate: frm.checkDate ?? '',
        status: 1, //1 = complete
        isDeleted: false,
      },
      details: this.orDetails,
      shareCapital: shareCap,
      cbu: cbu,
      savings: savings
    }

    console.log('OR PAYLOAD: ', paymentDetails);

    this.paymentService.createORPayment(paymentDetails).then((response: IAPIResponse) => {
      console.log('PAYMENT RESPONSE:', response);
      this.toast.success(ToastrMessage.SUCCESS_CREATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
    })
    .catch((error: Error) => {
      console.error("ERROR CREATING PAYMENT: ", error);
      this.toast.error(`${ToastrMessage.ERROR_CREATE} - ${error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
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
