import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICustomerList } from '../../../models/interfaces/ICustomer';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorDefaultOptions, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CustomerService } from '../../../services/customer.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { SpinnerComponent } from "../../common/spinner/spinner.component";
import { CommonService } from '../../../services/common.service';
import { Utils } from '../../../common/util';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterModule,
    SpinnerComponent
],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private commonService: CommonService
  ) {}

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  dataSource = new MatTableDataSource([]);
  tableCols: string[] = [
    'Account No', 
    'Last Name', 
    'First Name', 
    'Middle Name', 
    'Branch Code', 
    'Address', 
    'Customer Type'
  ];

  pageIdx:number = 0;
  pageSize: number = 50;
  pageLength: number = 0;
  totalRecordCount: number = 0;
  isSpinnerVisible!: boolean;
  
  getCustomerType = Utils.getCustomerType;
  getBranchCode = Utils.getBranchCode;

  async ngOnInit(): Promise<void> {
    this.commonService.getShowSpinnerVisibility().subscribe(spinnerVisibility => {
      this.isSpinnerVisible = spinnerVisibility
    });
    this.loadData(this.pageIdx,this.pageSize)
  }

  onCreateNewClick(): void {
    this.router.navigateByUrl('/customer/create');
  }
  
  handlePageChange(e: PageEvent) {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    this.loadData(e.pageIndex, e.pageSize);
  }


  loadData(pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    this.customerService.getCustomerList(pageIdx, pageSize).then((response: IAPIResponse) => {
      if(response.result !== null) {
        const result: any = response.result;

        this.dataSource.data = result.data;
        this.paginator.pageIndex = result.paginator.pageNumber;
        this.paginator.pageSize = result.paginator.pageSize;
        this.paginator.length =  result.paginator.totalRecordCount;
      }
    })
    .catch(async (error: Error) => {
      console.error('Error fetching customer list:', error);
      this.commonService.showSpinner(false);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

}
