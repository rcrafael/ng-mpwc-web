import { Component, OnInit } from '@angular/core';
import { MatDivider } from "@angular/material/divider";
import { branchCodeData } from '../../../../common/enum';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Utils } from '../../../../common/util';
import { IOtherPaymentTableDetails, IOtherPaymenttWithDetails } from '../../../../models/interfaces/IOtherPayments';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { PaymentService } from '../../../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-other-payment-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './other-payment-view.component.html',
  styleUrl: './other-payment-view.component.css'
})
export class OtherPaymentViewComponent implements OnInit {

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private activedRoute: ActivatedRoute,
    private toast: ToastrService,
    private commonService: CommonService,
    private router: Router
  ) { }

  toastTitlePrefix = 'Other Payment - ';
  COMPLETE_STATUS: number = 1;

  branchCodes:IBranchCode[] = branchCodeData;
  dataSource!: MatTableDataSource<IOtherPaymentTableDetails>;
  currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-PH');
  orId: string | null = null;

  tableColumns: string[] = [
    'Description',
    'Remarks',
    'Amount'
  ]

  fg = new FormGroup({
    isOutsideCollection: new FormControl<boolean>(false),
    accountNo: new FormControl<string>('', Validators.required),
    customerName: new FormControl<string | null>('', Validators.required),
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
    orStatus: new FormControl<string>(''),
  });

  transStatus!: number;

  buildCustomerName = Utils.buildCustomerName;
  sanitizeAmount = Utils.sanitizeAmount;
  numberFormat = Utils.formatNumber;
  getStatus = Utils.getStatusName;

  async ngOnInit(): Promise<void> {
    
    this.activedRoute.paramMap.subscribe(async (params): Promise<void> => {

      this.orId = params.get('orId');
      if(this.orId ) {
        await this.paymentService.getOtherPaymentWithCustomerInfoById(this.orId ).then(async (res) => {
          const response = res as any;
          const result = response.result as IOtherPaymenttWithDetails;
          const header = result.header;
          const details = result.details;

          const customerName = header.customerId ? this.buildCustomerName(header.customer.firstName, header.customer.middleName, header.customer.lastName) : header.outsideCustomerName;
          const address = header.customerId ? header.customer.address : header.outsideCustomerAddress;

          let username = '';
          try {
            await this.authService.getUsernameById(header.createdBy).then((res) => {
              username = res.result as any;
            })
          } catch(err) {
            console.error('ERROR FETCHING USERNAME BY ID: ', err);
            this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}(Username): ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
          }
          
          this.transStatus = header.status;

          this.fg.patchValue({
            isOutsideCollection: header.isOutsideCollection ?? false,
            accountNo: header.customer.accountNo ?? '',
            customerName: customerName,
            address: address,
            orNo: header.orNo ?? '',
            orDate: header.orDate ?? this.currentDate,
            entryDate: header.entryDate ?? this.currentDate,
            createdBy: username ?? '', //change to actual user created
            totalBillingAmount: header.totalBillingAmount ? this.numberFormat(header.totalBillingAmount) : '0.00',
            totalAmountPay: header.totalAmountPay ? this.numberFormat(header.totalAmountPay) : '0.00',
            checkNo: header.checkNo ?? '',
            checkBank: header.checkBank ?? '',
            checkDate: header.checkDate ?? null,
            orStatus: this.getStatus(header.status) 
          });

          let tableDetails: IOtherPaymentTableDetails[] = [];
          for(const d of details) {
            tableDetails.push({
              id: d.id ?? '',
              description: d.otherDescription ?? '',
              remarks: d.remarks ?? '',
              amount: d.totalAmount ? this.numberFormat(d.totalAmount) : '0.00'
            })
          }

          this.dataSource = new MatTableDataSource<IOtherPaymentTableDetails>(tableDetails);

        })
        .catch(err => {
          console.log(err);
          this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
        })
        .finally(() => {
          
        })
      }
    });

  }

   async handlePrintPdf(): Promise<void> {
    this.commonService.showSpinner(true);
    await this.paymentService.printORPdf(this.orId!).then((response:ArrayBuffer) => {
      if(response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const pdfWindow = window.open(blobUrl);
        if (pdfWindow) {
          pdfWindow.addEventListener('load', () => {
            pdfWindow.focus();
            pdfWindow.print();
          });
        }
      }
    })
    .catch((err: Error) => {
      console.error('ERROR PRINTING OR RECEIPT: ', err);
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${err.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    })
    .finally(() => {
      this.commonService.showSpinner(false);
    });
  }

  async handleDownloadXls(): Promise<void> {
    this.commonService.showSpinner(true);
    await this.paymentService.printORExcel(this.orId!).then((response:ArrayBuffer) => {
      
      if(response !== null) {

        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `OfficialReceipt_${this.orId}.xlsx`;   // filename
        a.click();
        event?.preventDefault();

        window.URL.revokeObjectURL(blobUrl);
      }
    })
    .catch((err: Error) => {
      console.error('ERROR PRINTING OR RECEIPT: ', err);
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${err.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    })
    .finally(() => {
      this.commonService.showSpinner(false);
    });
  }

  async handleVoid(): Promise<void> {
    const isConfirm = confirm('Are you sure you want to VOID this record?');
    if(!isConfirm) return;

    const VOID_STATUS_ID = 4;
    try {
      const response = await this.paymentService.updateStatus(this.orId!, VOID_STATUS_ID);
      console.log('RESPONSE: ', response);
      this.fg.patchValue({
        orStatus: this.getStatus(VOID_STATUS_ID)
      })
      this.toast.success(`${ToastrMessage.SUCCESS_UPDATE}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
    } catch (err) {
      console.error('ERROR VOIDING OTHER PAYMENT RECORD: ', err);
      this.toast.error(`${ToastrMessage.ERROR_UPDATE}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    }
  }

  async handleDelete(): Promise<void> {
    const isConfirm = confirm('Are you sure you want to DELETE this record?');
    if(!isConfirm) return;
    
    try {
      const response = await this.paymentService.deleteRecord(this.orId!);
      console.log('RESPONSE: ', response);
      this.toast.success(`${ToastrMessage.SUCCESS_DELETE}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      this.router.navigate(['payment/official-receipt']);
    } catch (err) {
      console.error('ERROR DELETING OTHER PAYMENT RECORD: ', err);
      this.toast.error(`${ToastrMessage.ERROR_DELETE}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    }
  }

}
