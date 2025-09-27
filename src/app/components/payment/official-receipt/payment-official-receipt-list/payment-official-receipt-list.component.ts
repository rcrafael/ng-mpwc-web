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
import { MatIcon } from '@angular/material/icon';
import { ReceiptComponent } from '../../../receipt/receipt.component';
import { MatDialog } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-payment-official-receipt-list',
  standalone: true,
  imports: [
    MatIcon,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    NgIf,
    MatTooltip
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
  ) {}
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

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

  getStatus = Utils.getStatusName;
  formatAmount = Utils.formatCurrency;
  formatDate = Utils.dateFormatter;
  buildCustName = Utils.buildCustomerName;
  
  ngOnInit(): void {
    this.loadORData(this.pageIdx,this.pageSize)
  }

  onCreateNewClick() {
    this.router.navigateByUrl('/payment/official-receipt/create');
  }

  handlePageChange(e: PageEvent) {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    this.pageIdx = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadORData(e.pageIndex, e.pageSize);
  }

  loadORData(pageIdx: number, pageSize: number): void {
    this.paymentService.getORAllWithCustomerInfo(pageIdx, pageSize).then((response: IAPIResponse) => {
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
    })
    .finally(async () => {
     
    });
  }

  openPrint(): void {
      const dialogRef = this.dialog.open(ReceiptComponent, {
        width: '30%',
        height: '90%'
      });
  
      // dialogRef.afterClosed().subscribe(data => {
      //   if(data !== null) {
      //     this.selectedCustomerInfo = data
      //     this.fg.patchValue({
      //       accountNo: this.selectedCustomerInfo.accountNo,
      //       customerName: `${this.selectedCustomerInfo.lastName}, ${this.selectedCustomerInfo.firstName} ${this.selectedCustomerInfo.middleName}` ,
      //       branchCode: this.selectedCustomerInfo.branchCode,
      //       address: this.selectedCustomerInfo.address
      //     })
      //   }
      // })
    }

      async handleVoidRecord(orId: string) {

    const isConfirm = confirm('Are you sure you want to VOID this record?');
    if(!isConfirm) return;

    const VOID_STATUS_ID = 4;
    try {
      const response = await this.paymentService.updateStatus(orId, VOID_STATUS_ID);
      console.log('RESPONSE: ', response);
      await this.loadORData(this.pageIdx, this.pageSize);
    } catch (err) {
      console.error('ERROR VOIDING OTHER PAYMENT RECORD: ', err);
    }
    

  }

  async handleDeleteRecord(orId: string) {

    const isConfirm = confirm('Are you sure you want to DELETE this record?');
    if(!isConfirm) return;
    
    try {
      const response = await this.paymentService.deleteRecord(orId);
      console.log('RESPONSE: ', response);
      await this.loadORData(this.pageIdx, this.pageSize);
    } catch (err) {
      console.error('ERROR DELETING OTHER PAYMENT RECORD: ', err);
    }
  }

}
