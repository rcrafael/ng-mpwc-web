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
    NgIf
],
  templateUrl: './billing-list.component.html',
  styleUrl: './billing-list.component.css'
})
export class BillingListComponent implements OnInit {

  constructor(
    private router: Router,
    private billingService: BillingService,
    private commonService: CommonService
  ) {}

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

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

  getBranchCode = Utils.getBranchCode;
  getStatus = Utils.getStatusName;
  getMonth = Utils.getMonth;
  formatAmount = Utils.formatCurrency;
  formatDate = Utils.dateFormatter;
  
  ngOnInit(): void {
    this.commonService.getShowSpinnerVisibility().subscribe(spinnerVisibility => {
      this.isSpinnerVisible = spinnerVisibility
    });
    this.loadData(this.pageIdx,this.pageSize)
  }

  handlePageChange(e: PageEvent) {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    this.loadData(e.pageIndex, e.pageSize);
  }
  

  onCreateNewClick() {
    this.router.navigateByUrl('/billing/create');
  }

  loadData(pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    this.billingService.getBillings(pageIdx, pageSize).then((response: IAPIResponse) => {
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
      this.commonService.showSpinner(false);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

    async handleVoidRecord(orId: string) {

    const isConfirm = confirm('Are you sure you want to VOID this record?');
    if(!isConfirm) return;

    const VOID_STATUS_ID = 4;
    try {
      // const response = await this.paymentService.updateStatus(orId, VOID_STATUS_ID);
      // console.log('RESPONSE: ', response);
      // await this.loadORData(this.pageIdx, this.pageSize);
    } catch (err) {
      console.error('ERROR VOIDING OTHER PAYMENT RECORD: ', err);
    }
    

  }

  async handleDeleteRecord(orId: string) {

    const isConfirm = confirm('Are you sure you want to DELETE this record?');
    if(!isConfirm) return;
    
    try {
      // const response = await this.paymentService.deleteRecord(orId);
      // console.log('RESPONSE: ', response);
      // await this.loadORData(this.pageIdx, this.pageSize);
    } catch (err) {
      console.error('ERROR DELETING OTHER PAYMENT RECORD: ', err);
    }
  }

}
