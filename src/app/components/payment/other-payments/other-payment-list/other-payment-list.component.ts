import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IOtherPaymentList } from '../../../../models/interfaces/IOtherPayments';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { PaymentService } from '../../../../services/payment.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Utils } from '../../../../common/util';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';
import { NoDataToDisplayComponent } from "../../../common/no-data-to-display/no-data-to-display.component";
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-other-payment-list',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    NgIf,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    NoDataToDisplayComponent
],
  templateUrl: './other-payment-list.component.html',
  styleUrl: './other-payment-list.component.css'
})
export class OtherPaymentListComponent implements OnInit {

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private toast: ToastrService
  ) {
    this.subscription = this.subjectKeyword.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(keyword => {
      if(keyword.trim() === '') {
        this.getOtherPaymentList(this.paginator.pageIndex, this.paginator.pageSize);
      } else {
        this.getOtherPaymentListWithSearch(keyword, this.paginator.pageIndex, this.paginator.pageSize);
      }
    })
  }

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  toastTitlePrefix = 'Other Payment List - ';

  pageIdx:number = 0;
  pageSize: number = 50;
  pageLength: number = 0;
  totalRecordCount: number = 0;
  searchKeyword: string = '';

  dataSource = new MatTableDataSource([]);
  tableCols: string[] = [
    'Official Receipt No', 
    'OR Date', 
    'Account No', 
    'Customer Name', 
    'Address',
    'Total Amount To Pay', 
    'Status',
    'Action'
  ];

  buildCustName = Utils.buildCustomerName;
  getStatus = Utils.getStatusName;
  formatCurrency = Utils.formatCurrency;
  formatDate = Utils.dateFormatter;
  
  private subjectKeyword = new Subject<string>();
  private subscription: Subscription;
  
  async ngOnInit(): Promise<void> {
    await this.getOtherPaymentList(this.pageIdx, this.pageSize);
  }
  
  onCreateNewClick() {
    this.router.navigateByUrl('/payment/other-receipt/create');
  }

  async handlePageChange(e: PageEvent) : Promise<void> {
    console.log('PAGINATOR: ', e)
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    
    this.pageIdx = e.pageIndex;
    this.pageSize = e.pageSize;

    if(this.searchKeyword.trim() === '') {
      await this.getOtherPaymentList(e.pageIndex, e.pageSize);
    } else {
      await this.getOtherPaymentListWithSearch(this.searchKeyword, e.pageIndex, e.pageSize);
    }
    
  }

  async getOtherPaymentList(pageIdx: number, pageSize: number): Promise<void> {

    try {
      this.commonService.showSpinner(true);
      const response = await this.paymentService.getAllOtherPaymentsWithCustomerInfo(pageIdx, pageSize);
      if(response.result === null) return;

      console.log('RESPONSE: ', response);
      console.log('PAGINATOR: ', this.paginator);
      const result = response.result as any
      this.dataSource.data = result.data;
      
      console.log("DATA SOURCE: ", this.dataSource.data);
    
      this.paginator.pageIndex = result.paginator.pageNumber;
      this.paginator.pageSize = result.paginator.pageSize;
      this.paginator.length =  result.paginator.totalRecordCount;
      
    } catch (err) {
      console.error('ERROR FETCHING OTHER PAYMENT LIST: ', err);
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
      console.log('FINISHED FETCHING OTHER PAYMENT LIST');
    }
    
  }

  async getOtherPaymentListWithSearch(keyword: string, pageIdx: number, pageSize: number) {
    try {
      this.commonService.showSpinner(true);
      const response = await this.paymentService.getAllOtherPaymentWithSearch(keyword, pageIdx, pageSize);
      if(response.result === null) return;

      const result = response.result as any
      this.dataSource.data = result.data;
      
      this.paginator.pageIndex = result.paginator.pageNumber;
      this.paginator.pageSize = result.paginator.pageSize;
      this.paginator.length =  result.paginator.totalRecordCount;
      this.pageIdx = result.paginator.pageNumber;
      this.pageSize = result.paginator.pageSize;

    } catch (err) {
      console.error('ERROR FETCHING OTHER PAYMENT LIST: ', err);
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
      console.log('FINISHED FETCHING OTHER PAYMENT LIST');
    }
  }
  
  onSearchInputChanged(keyword: string): void {
    this.subjectKeyword.next(keyword);
    this.paginator.pageIndex = 0;
  }


  async handleVoidRecord(orId: string) {

    const isConfirm = await AlertService.confirm('Are you sure you want to VOID this record?', 'Void Payment Record');
    if(!isConfirm) return;

    const VOID_STATUS_ID = 4;
    try {
      this.commonService.showSpinner(true);
      const response = await this.paymentService.updateStatus(orId, VOID_STATUS_ID);
      console.log('RESPONSE: ', response);
      await this.getOtherPaymentList(this.pageIdx, this.pageSize);
    } catch (err) {
      console.error('ERROR VOIDING OTHER PAYMENT RECORD: ', err);
      this.toast.error(`${ToastrMessage.ERROR_UPDATE}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
    }
    

  }

  async handleDeleteRecord(orId: string) {

    const isConfirm = await AlertService.confirm('Are you sure you want to DELETE this record?', 'Delete Payment Record');
    if(!isConfirm) return;
    
    try {
      this.commonService.showSpinner(true);
      const response = await this.paymentService.deleteRecord(orId);
      console.log('RESPONSE: ', response);
      await this.getOtherPaymentList(this.pageIdx, this.pageSize);
    } catch (err) {
      console.error('ERROR DELETING OTHER PAYMENT RECORD: ', err);
      this.toast.error(`${ToastrMessage.ERROR_DELETE}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
    }
  }
    
  async handlePrintReceipt(orId: string) {
    
    this.commonService.showSpinner(true);
    await this.paymentService.printORPdf(orId).then((response:ArrayBuffer) => {
      if(response !== null) {
        console.log('OR RECEIPT: ', response)
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

}
