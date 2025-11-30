import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { IOfficialReceiptList } from '../../../../models/interfaces/IOfficialReceipt';
import { CommonService } from '../../../../services/common.service';
import { PaymentService } from '../../../../services/payment.service';
import { Utils } from '../../../../common/util';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SpinnerComponent } from '../../../common/spinner/spinner.component';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { ReceiptComponent } from '../../../receipt/receipt.component';
import { MatDialog } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatTooltip } from "@angular/material/tooltip";
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { FormsModule, NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { NoDataToDisplayComponent } from "../../../common/no-data-to-display/no-data-to-display.component";

@Component({
  selector: 'app-payment-official-receipt-list',
  standalone: true,
  imports: [
    MatIcon,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    NgIf,
    MatTooltip,
    FormsModule,
    NoDataToDisplayComponent
],
  templateUrl: './payment-official-receipt-list.component.html',
  styleUrl: './payment-official-receipt-list.component.css'
})
export class PaymentOfficialReceiptListComponent implements OnInit {

  constructor(
    private router: Router,
    private commonService: CommonService,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.subscription = this.subjectKeyword.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(keyword => {
      if(keyword.trim() === '') {
        this.loadORData(this.paginator.pageIndex, this.paginator.pageSize);
      } else {
        this.loadDataWithSearch(keyword, this.paginator.pageIndex, this.paginator.pageSize);
      }
      
    });

    this.iconRegistry.addSvgIcon('excel-icon', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/icons/excel-icon.svg'));

  }
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  toastTitlePrefix = 'Official Receipt List - ';

  dataSource = new MatTableDataSource([]);

  tableCols: string[] = [
    'Official Receipt No', 
    'OR Date', 
    'Account No', 
    'Customer Name', 
    'Address',
    'Total Billing Amount', 
    'Total Share Amount', 
    'Total Amount To Pay', 
    'Status',
    'Actions'
  ];
  
  pageIdx:number = 0;
  pageSize: number = 50;
  pageLength: number = 0;
  totalRecordCount: number = 0;
  searchKeyword: string = '';

  getStatus = Utils.getStatusName;
  formatAmount = Utils.formatCurrency;
  formatDate = Utils.dateFormatter;
  buildCustName = Utils.buildCustomerName;
  
  private subjectKeyword = new Subject<string>();
  private subscription: Subscription;
  
  ngOnInit(): void {
    this.loadORData(this.pageIdx,this.pageSize)
  }

  onCreateNewClick() {
    this.router.navigateByUrl('/payment/official-receipt/create');
  }

  async handlePageChange(e: PageEvent) {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;

    this.pageIdx = e.pageIndex;
    this.pageSize = e.pageSize;

    if(this.searchKeyword.trim() === '') {
      await this.loadORData(e.pageIndex, e.pageSize);
    } else {
      await this.loadDataWithSearch(this.searchKeyword, e.pageIndex, e.pageSize);
    }

  }

  async loadORData(pageIdx: number, pageSize: number): Promise<void> {
    this.commonService.showSpinner(true);
    await this.paymentService.getORAllWithCustomerInfo(pageIdx, pageSize).then((response: IAPIResponse) => {
      if(response.result !== null) {
        const result: any = response.result;
        console.log('PAGINATOR: ', this.paginator);
        this.dataSource.data = result.data;
        this.paginator.pageIndex = result.paginator.pageNumber;
        this.paginator.pageSize = result.paginator.pageSize;
        this.paginator.length =  result.paginator.totalRecordCount;
      }
    })
    .catch(async (error: Error) => {
      console.error('Error fetching OR list:', error);
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

  async loadDataWithSearch(keyword: string, pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    await this.paymentService.getORAllPaymentWithSearch(keyword, pageIdx, pageSize).then((response:IAPIResponse) => {
      if(response.result !== null) {
        const result: any = response.result;

        this.dataSource.data = result.data;
        this.paginator.pageIndex = result.paginator.pageNumber;
        this.paginator.pageSize = result.paginator.pageSize;
        this.paginator.length =  result.paginator.totalRecordCount;
        this.pageIdx = result.paginator.pageNumber;
        this.pageSize = result.paginator.pageSize;
      }
    })
    .catch(async (error: Error) => {
      console.error('Error fetching customer list with search:', error);
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

  onSearchInputChanged(keyword: string): void {
    this.subjectKeyword.next(keyword);
    this.paginator.pageIndex = 0;
  }

  async handleVoidRecord(orId: string) {

    const isConfirm = confirm('Are you sure you want to VOID this record?');
    if(!isConfirm) return;

    try {
      this.commonService.showSpinner(true);
      const response = await this.paymentService.voidRecord(orId);
      console.log('RESPONSE: ', response);
      this.toast.success(`${ToastrMessage.SUCCESS_UPDATE}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      await this.loadORData(this.pageIdx, this.pageSize);
    } catch (err) {
      console.error('ERROR VOIDING OTHER PAYMENT RECORD: ', err);
      this.toast.error(`${ToastrMessage.ERROR_UPDATE}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
    }
    

  }

  async handleDeleteRecord(orId: string) {

    const isConfirm = confirm('Are you sure you want to DELETE this record?');
    if(!isConfirm) return;
    
    try {
      const response = await this.paymentService.deleteRecord(orId);
      console.log('RESPONSE: ', response);
      this.toast.success(`${ToastrMessage.SUCCESS_DELETE}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      await this.loadORData(this.pageIdx, this.pageSize);
    } catch (err) {
      console.error('ERROR DELETING OTHER PAYMENT RECORD: ', err);
      this.toast.error(`${ToastrMessage.ERROR_DELETE}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    }
  }

  async handlePrintReceipt(orId: string) {
    
    await this.printPdf(orId);

  }

  async handleDownloadExcel(orId: string) {

    await this.printExcel(orId);
  }

  async printPdf(orId: string) {

    this.commonService.showSpinner(true);
    await this.paymentService.printORPdf(orId).then((response:ArrayBuffer) => {
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

  async printExcel(orId: string) {
    this.commonService.showSpinner(true);
    await this.paymentService.printORExcel(orId).then((response:ArrayBuffer) => {
      
      if(response !== null) {

        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `OfficialReceipt_${orId}.xlsx`;   // filename
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

}
