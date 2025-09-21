import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IOtherPaymentList } from '../../../../models/interfaces/IOtherPayments';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { PaymentService } from '../../../../services/payment.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Utils } from '../../../../common/util';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-other-payment-list',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    NgIf,
    MatPaginatorModule,
    MatIconModule
],
  templateUrl: './other-payment-list.component.html',
  styleUrl: './other-payment-list.component.css'
})
export class OtherPaymentListComponent implements OnInit {

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  pageIdx:number = 0;
  pageSize: number = 50;
  pageLength: number = 0;
  totalRecordCount: number = 0;

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
  
  async ngOnInit(): Promise<void> {
    await this.getOtherPaymentList(this.pageIdx, this.pageSize);
  }
  
  onCreateNewClick() {
    this.router.navigateByUrl('/payment/other-receipt/create');
  }

  handlePageChange(e: PageEvent) {
    console.log('PAGINATOR: ', e)
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    this.getOtherPaymentList(e.pageIndex, e.pageSize);
  }

  async getOtherPaymentList(pageIdx: number, pageSize: number): Promise<void> {

    try {
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
    } finally {
      console.log('FINISHED FETCHING OTHER PAYMENT LIST');
    }
    
  }

    
}
