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

@Component({
  selector: 'app-payment-official-receipt-list',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    SpinnerComponent
  ],
  templateUrl: './payment-official-receipt-list.component.html',
  styleUrl: './payment-official-receipt-list.component.css'
})
export class PaymentOfficialReceiptListComponent implements OnInit {

  constructor(
    private router: Router,
    private commonService: CommonService,
    private paymentService: PaymentService
  ) {}
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  dataSource = new MatTableDataSource([]);

  tableCols: string[] = [
    'Official Receipt No', 
    'OR Date', 
    'Account No', 
    'Customer Name', 
    'Total Billing Amount', 
    'Total Share Amount', 
    'Total Amount To Pay', 
    'Status'
  ];
  
  pageIdx:number = 0;
  pageSize: number = 50;
  pageLength: number = 0;
  totalRecordCount: number = 0;
  isSpinnerVisible!: boolean;


  getStatus = Utils.getStatusName;
  formatAmount = Utils.formatCurrency;
  formatDate = Utils.dateFormatter;
  buildCustName = Utils.buildCustomerName;
  
  ngOnInit(): void {
    this.commonService.getShowSpinnerVisibility().subscribe(spinnerVisibility => {
      this.isSpinnerVisible = spinnerVisibility
    });
    this.loadORData(this.pageIdx,this.pageSize)
  }

  onCreateNewClick() {
    this.router.navigateByUrl('/payment/official-receipt/create');
  }

  handlePageChange(e: PageEvent) {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    this.loadORData(e.pageIndex, e.pageSize);
  }

  loadORData(pageIdx: number, pageSize: number): void {
    this.commonService.showSpinner(true);
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
      this.commonService.showSpinner(false);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

}
