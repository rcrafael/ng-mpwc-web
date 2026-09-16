import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOtherPaymentDetail, IOtherPaymentHeader, IOtherPaymentPayload, IOtherPaymentTableDetails } from '../../../../models/interfaces/IOtherPayments';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { MatDialog } from '@angular/material/dialog';
import { AddDetailsModalComponent } from '../add-details-modal/add-details-modal.component';
import { branchCodeData } from '../../../../common/enum';
import { BrowseCustomersComponent } from '../../../modals/browse-customers/browse-customers.component';
import { Utils } from '../../../../common/util';
import { formatDate } from '@angular/common';
import { IMeterDetails } from '../../../../models/interfaces/IMeter';
import { AuthService } from '../../../../services/auth.service';
import { PaymentService } from '../../../../services/payment.service';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-other-payment-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './other-payment-create.component.html',
  styleUrl: './other-payment-create.component.css'
})
export class OtherPaymentCreateComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private toast: ToastrService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.fg.patchValue({
      createdBy: this.authService.getUserName()
    })
  }

  toastTitlePrefix = 'Other Payment - ';

  dialog = inject(MatDialog)

  branchCodes:IBranchCode[] = branchCodeData;
  dataSource!: MatTableDataSource<IOtherPaymentTableDetails>;
  
  buildCustomerName = Utils.buildCustomerName;
  sanitizeAmount = Utils.sanitizeAmount;
  numberFormat = Utils.formatNumber;

  currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-PH');
  selectedCustomer: any = null;
  // selectedMeter!: IMeterDetails;

  amountChange: string = '0.00';
  amountReceived: string = '0.00';

  isCustomerEditable: boolean = false;

  tableColumns: string[] = [
    'Description',
    'Remarks',
    'Amount'
  ]

  fg = new FormGroup({
    isOutsideCollection: new FormControl<boolean>(false),
    accountNo: new FormControl<string>('', Validators.required),
    customerName: new FormControl<string | null>('', Validators.required),
    // branchCode: new FormControl<number>({value: 0, disabled: true}),
    address: new FormControl<string>('', Validators.required),
    orNo: new FormControl<string>('', Validators.required),
    orDate: new FormControl<string>(this.currentDate),
    entryDate: new FormControl<string>(this.currentDate),
    createdBy: new FormControl<string>(''),
    totalBillingAmount: new FormControl<string>('0.00'),
    totalAmountPay: new FormControl<string>('0.00'),
    checkNo: new FormControl<string>(''),
    checkBank: new FormControl<string>(''),
    checkDate: new FormControl<string | null>(null),
  })

  async ngOnInit(): Promise<void> {

    this.commonService.showSpinner(true);
    await this.paymentService.generateNewORno().then((response: IAPIResponse) => {
      if(response.result) {
        this.fg.patchValue({
          orNo: response.result.toString()
        });
      }
    })
    .catch((error: Error) => {
      this.fg.patchValue({
        orNo: ''
      });
      console.error('ERROR GENERATING NEW OR NUMBER: ', error);
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA + ': ' + error.message, this.toastTitlePrefix + ToastrTitle.ERROR);
    })
    .finally(() => {
      this.commonService.showSpinner(false);
    });

    this.fg.get('isOutsideCollection')?.valueChanges.subscribe((value) => {
      this.isCustomerEditable = value ?? false;

      if(value) {
        this.fg.get('accountNo')?.clearValidators();
      } else {
        this.fg.get('accountNo')?.setValidators([Validators.required]);
      }
      this.fg.get('accountNo')?.updateValueAndValidity();
      this.fg.get('accountNo')?.setValue('');
    })

  }

  async onSubmit(): Promise<void> {
    
    const formData = this.fg.value;

    if(!this.fg.valid) {
      console.log('INVALID INPUT', this.fg);
      this.toast.error(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.ERROR);
      return;
    }
    
    const header: IOtherPaymentHeader = {
      orNo: formData.orNo ?? '',
      customerId: this.selectedCustomer?.id ?? null,
      orDate: formData.orDate ?? '',
      entryDate: formData.entryDate ?? '',
      createdBy: this.authService.getUserId() ?? '',
      totalBillingAmount: this.sanitizeAmount(formData.totalBillingAmount ?? '0'),
      totalAmountPay: this.sanitizeAmount(formData.totalAmountPay ?? '0'),
      checkBank: formData.checkBank ?? '',
      checkNo: formData.checkNo ?? '',
      checkDate: formData.checkDate ?? null,
      status: 1,
      isPartSale: true,
      isOutsideCollection: formData.isOutsideCollection ?? false,
      outsideCustomerName: formData.isOutsideCollection ? formData.customerName ?? '' : '',
      outsideCustomerAddress: formData.isOutsideCollection ? formData.address ?? '' : '',
    };

    const details: IOtherPaymentDetail[] = [];
    this.dataSource.data.map((d: IOtherPaymentTableDetails) => {
      const detail: IOtherPaymentDetail = {
        orNo: formData.orNo ?? '',
        partId: d.id ?? '',
        parts: this.sanitizeAmount(d.amount ?? 0),
        otherDescription: d.description ?? '',
        remarks: d.remarks ?? '',
        totalAmount: this.sanitizeAmount(d.amount ?? '0')
      };

      details.push(detail);
    })

    const params: IOtherPaymentPayload = {
      header: header,
      details: details,
    };
    
    this.commonService.showSpinner(true);
    await this.paymentService.createOtherPayment(params).then((response: IAPIResponse) => {
      console.log('API RESPONSE: ', response);
      this.toast.success(ToastrMessage.SUCCESS_CREATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      this.router.navigate(['/payment/other-receipt']);
    })
    .catch((error: Error) => {
      console.error('ERROR CREATING OTHER PAYMENT: ', error);
      this.toast.error(ToastrMessage.ERROR_CREATE + ': ' + error.message, this.toastTitlePrefix + ToastrTitle.ERROR);
    })
    .finally(() => {
      this.dataSource = new MatTableDataSource<IOtherPaymentTableDetails>([]);
      this.commonService.showSpinner(false);
    });


    console.log('API PAYLOAD: ', params);
  }

  openCustomerDialog(): void { 
    const dialogRef = this.dialog.open(BrowseCustomersComponent, {
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(data => {
      console.log('DATA FROM CUSTOMER DIALOG: ', data);
      if (data !== null) {
        this.selectedCustomer = data;

        this.fg.patchValue({
          accountNo: data.accountNo,
          customerName: this.buildCustomerName(data.firstName, data.middleName, data.lastName),
          // branchCode: data.branchCode,
          address: data.address
        });
      }
    });

  }

  openDetailFormDialog(): void {
    const dialogRef = this.dialog.open(AddDetailsModalComponent, {
      width: '90%',
      height: '90%'
    });
    
    dialogRef.afterClosed().subscribe(data => {
      console.log('DATA FROM DIALOG:', data);
      
      if(data!== null) {
        this.dataSource = new MatTableDataSource<IOtherPaymentTableDetails>(data);

        let totalAmount: number = 0;

        data.map((detail: IOtherPaymentTableDetails) => {
          totalAmount += this.sanitizeAmount(detail.amount);
        })

        this.fg.patchValue({
          totalBillingAmount: this.numberFormat(totalAmount),
          totalAmountPay: this.numberFormat(totalAmount)
        });

      }
    });

  }

  computeChange(): void {
    const totalAmounToPay: number = this.sanitizeAmount(this.fg.get('totalAmountPay')?.value ?? '0');
    this.amountChange = this.numberFormat(this.sanitizeAmount(this.amountReceived ?? '0') - totalAmounToPay);
    this.amountReceived = this.numberFormat(this.sanitizeAmount(this.amountReceived ?? '0'));
  }

}
