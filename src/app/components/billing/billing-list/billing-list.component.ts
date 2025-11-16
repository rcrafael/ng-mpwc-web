import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { IBillingList } from '../../../models/interfaces/IBilling';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BillingService } from '../../../services/billing.service';
import { CommonService } from '../../../services/common.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { SpinnerComponent } from "../../common/spinner/spinner.component";
import { Utils } from '../../../common/util';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-billing-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterModule,
    MatTooltip,
    MatIconModule,
    NgIf,
    FormsModule
],
  templateUrl: './billing-list.component.html',
  styleUrl: './billing-list.component.css'
})
export class BillingListComponent implements OnInit {

  constructor(
    private router: Router,
    private billingService: BillingService,
    private commonService: CommonService,
    private toast: ToastrService
  ) {
    this.subscription = this.subjectKeyword.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(keyword => {
      if(keyword.trim() === '') {
        this.loadData(this.paginator.pageIndex, this.paginator.pageSize);
      } else {
        this.loadDataWithSearch(keyword, this.paginator.pageIndex, this.paginator.pageSize);
      }
      
    })
  }

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  toastTitlePrefix = 'Billing List - ';

  dataSource = new MatTableDataSource([]);
  tableCols: string[] = [
    'Reading No', 
    'Account No', 
    'Meter No', 
    'Customer Name', 
    'Alias', 
    'Branch Code', 
    'Address', 
    'Month', 
    'Billing Period', 
    'Due Date', 
    'Amount', 
    'Status', 
    'Actions'
  ];
  
  pageIdx:number = 0;
  pageSize: number = 50;
  pageLength: number = 0;
  totalRecordCount: number = 0;
  isSpinnerVisible!: boolean;
  searchKeyword: string = '';

  private subjectKeyword = new Subject<string>();
  private subscription: Subscription;

  getBranchCode = Utils.getBranchCode;
  getStatus = Utils.getStatusName;
  getMonth = Utils.getMonth;
  formatAmount = Utils.formatCurrency;
  formatDate = Utils.dateFormatter;
  buildCustName = Utils.buildCustomerName;

  ngOnInit(): void {
    this.commonService.getShowSpinnerVisibility().subscribe(spinnerVisibility => {
      this.isSpinnerVisible = spinnerVisibility
    });
    this.loadData(this.pageIdx,this.pageSize)
  }

  async handlePageChange(e: PageEvent) {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    if(this.searchKeyword.trim() === '') {
      await this.loadData(e.pageIndex, e.pageSize);
    } else {
      await this.loadDataWithSearch(this.searchKeyword, e.pageIndex, e.pageSize);
    }
  }
  

  onCreateNewClick() {
    this.router.navigateByUrl('/billing/create');
  }

  async loadData(pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    await this.billingService.getBillings(pageIdx, pageSize).then((response: IAPIResponse) => {
      if(response.result !== null) {
        const result: any = response.result;

        this.dataSource.data = result.data;
        this.paginator.pageIndex = result.paginator.pageNumber;
        this.paginator.pageSize = result.paginator.pageSize;
        this.paginator.length =  result.paginator.totalRecordCount;
      }
    })
    .catch(async (error: Error) => {
      console.error('Error fetching billing list:', error);
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA, this.toastTitlePrefix + ToastrTitle.ERROR);
      this.commonService.showSpinner(false);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

  async loadDataWithSearch(keyword: string, pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    await this.billingService.getBillingSearch(keyword, pageIdx, pageSize).then((response: IAPIResponse) => {
      if(response.result !== null) {
        const result: any = response.result;

        this.dataSource.data = result.data;
        this.paginator.pageIndex = result.paginator.pageNumber;
        this.paginator.pageSize = result.paginator.pageSize;
        this.paginator.length =  result.paginator.totalRecordCount;
      }
    })
    .catch(async (error: Error) => {
      console.error('Error fetching billing list:', error);
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA, this.toastTitlePrefix + ToastrTitle.ERROR);
      this.commonService.showSpinner(false);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

  async handleVoidRecord(billing:any) {

    if(billing.status === 2) { //2 = INCOMPLETE
      const isConfirm = confirm('Are you sure you want to VOID this record?');
      if(!isConfirm) return;

      try {
        this.commonService.showSpinner(true);
        const response = await this.billingService.voidBilling(billing.id);
        console.log('RESPONSE: ', response);
        this.toast.success(`${ToastrMessage.SUCCESS_VOID}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);

        await this.loadData(this.pageIdx, this.pageSize);

      } catch (err) {
        console.error('ERROR VOIDING BILLING RECORD: ', err);
      } finally {
        this.commonService.showSpinner(false);
        this.toast.error(ToastrMessage.ERROR_VOID + ' : ' + billing.readingNo, this.toastTitlePrefix + ToastrTitle.ERROR);
      }
    } else {
      this.toast.warning(`${ToastrMessage.ERROR_VOID} : Cannot be voided.`, this.toastTitlePrefix + ToastrTitle.WARNING);
    }

  }

  async handleDeleteRecord(billing: any) {

    if(billing.status === 2) { //2 = INCOMPLETE
      const isConfirm = confirm('Are you sure you want to DELETE this record?');
      if(!isConfirm) return;
      
      try {
        this.commonService.showSpinner(true);
        const response = await this.billingService.deleteBilling(billing.id);
        console.log('RESPONSE: ', response);
        this.toast.success(`${ToastrMessage.SUCCESS_DELETE}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
        await this.loadData(this.pageIdx, this.pageSize);
      } catch (err) {
        console.error('ERROR DELETING BILLING RECORD: ', err);
      } finally {
        this.commonService.showSpinner(false);
        this.toast.error(ToastrMessage.ERROR_DELETE + ' : ' + billing.readingNo, this.toastTitlePrefix + ToastrTitle.ERROR);
      }
    } else {
      this.toast.warning(`${ToastrMessage.ERROR_DELETE} : Cannot be deleted.`, this.toastTitlePrefix + ToastrTitle.WARNING);
    }

    
  }

  onSearchInputChanged(keyword: string): void {
    this.subjectKeyword.next(keyword);
    this.paginator.pageIndex = 0;
  }

}
