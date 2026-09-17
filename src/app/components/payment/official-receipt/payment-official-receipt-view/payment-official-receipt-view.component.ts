import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../../../../common/util';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import {  IOfficialReceiptDetail, IOfficialReceiptWithDetails } from '../../../../models/interfaces/IOfficialReceipt';
import { PaymentService } from '../../../../services/payment.service';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';
import { CommonService } from '../../../../services/common.service';
import { utils } from 'xlsx';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-payment-official-receipt-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './payment-official-receipt-view.component.html',
  styleUrl: './payment-official-receipt-view.component.css'
})
export class PaymentOfficialReceiptViewComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private authService: AuthService,
    private toast: ToastrService,
    private commonService: CommonService,
    private router: Router
  ) {}

  COMPLETE_STATUS: number = 1;

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
  orId: string|null = '';
  transStatus!: number;

  formatAmount = Utils.formatCurrency;
  formatNumber = Utils.formatNumber;
  sanitizeAmount = Utils.sanitizeAmount;
  getStatus = Utils.getStatusName;

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
    seniorDiscount: new FormControl<string>('0.00'),
    totalAmountPay: new FormControl<string>('0.00'),
    checkNo: new FormControl<string>(''),
    checkBank: new FormControl<string>(''),
    checkDate: new FormControl<string|null>(null),
    orStatus: new FormControl<string>(''),
  })

  async ngOnInit(): Promise<void> {
    await this.activeRoute.paramMap.subscribe(async params => {
      this.orId = params.get('orId');
      if(this.orId !== undefined && this.orId !== null && this.orId !== '') {
        await this.paymentService.getORWithCustomerInfoById(this.orId).then(async (response: IAPIResponse) => {
          
          if(response.result) {
            const result = response.result as IOfficialReceiptWithDetails;
            this.selectedCustomerInfo = result.header.customer;
            this.orDetails = result.details;
            this.dataSource = new MatTableDataSource<IOfficialReceiptDetail>(this.orDetails);
            
            this.transStatus = result.header.status;

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
              cbu: this.formatNumber(result.cbu?.amount ?? 0),
              savings: this.formatNumber(result.savings?.amount ?? 0),
              totalBillingAmount: this.formatNumber(result.header.totalBillingAmount ?? 0),
              totalShareAmount: this.formatNumber(result.header.totalShareAmount ?? 0),
              seniorDiscount: this.formatNumber(result.header.seniorDiscount ?? 0),
              totalAmountPay: this.formatNumber(result.header.totalAmountPay ?? 0),
              checkNo: result.header.checkNo,
              checkBank: result.header.checkBank,
              checkDate: result.header.checkDate,
              orStatus: this.getStatus(result.header.status)
            })
          }
          
        });
      }
    })

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
    const isConfirm = await AlertService.confirm('Are you sure you want to VOID this record?', 'Void Official Receipt');
    if(!isConfirm) return;

    const VOID_STATUS_ID = 4;
    try {
      this.commonService.showSpinner(true);
      const response = await this.paymentService.voidRecord(this.orId!);
      console.log('RESPONSE: ', response);
      this.fg.patchValue({
        orStatus: this.getStatus(VOID_STATUS_ID)
      })
      this.toast.success(`${ToastrMessage.SUCCESS_UPDATE}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
    } catch (err) {
      console.error('ERROR VOIDING OTHER PAYMENT RECORD: ', err);
      this.toast.error(`${ToastrMessage.ERROR_UPDATE}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
    }
  }

  async handleDelete(): Promise<void> {
    const isConfirm = await AlertService.confirm('Are you sure you want to DELETE this record?', 'Delete Official Receipt');
    if(!isConfirm) return;
    
    try {
      this.commonService.showSpinner(true);
      const response = await this.paymentService.deleteRecord(this.orId!);
      console.log('RESPONSE: ', response);
      this.toast.success(`${ToastrMessage.SUCCESS_DELETE}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      this.router.navigate(['payment/official-receipt']);
    } catch (err) {
      console.error('ERROR DELETING OTHER PAYMENT RECORD: ', err);
      this.toast.error(`${ToastrMessage.ERROR_DELETE}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
    }
  }

}
