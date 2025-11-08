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
import { FormsModule, NgModel } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterModule,
    FormsModule,
    NgIf,
    MatIconModule
],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {

  constructor(
    private router: Router,
    private customerService: CustomerService,
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

  toastTitlePrefix = 'Customer List - ';

  dataSource = new MatTableDataSource([]);
  tableCols: string[] = [
    'Account No', 
    'Last Name', 
    'First Name', 
    'Middle Name', 
    'Address', 
    'Birth Date',
    'Gender',
    'Actions',
  ];

  pageIdx:number = 0;
  pageSize: number = 50;
  pageLength: number = 0;
  totalRecordCount: number = 0;
  searchKeyword: string = '';


  getCustomerType = Utils.getCustomerType;
  getBranchCode = Utils.getBranchCode;
  getGender = Utils.getGender;

  private subjectKeyword = new Subject<string>();
  private subscription: Subscription;

  async ngOnInit(): Promise<void> {
    await this.loadData(this.pageIdx,this.pageSize)
  }

  onCreateNewClick(): void {
    this.router.navigateByUrl('/customer/create');
  }
  
  async handlePageChange(e: PageEvent): Promise<void> {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    
    this.pageIdx = e.pageIndex;
    this.pageSize = e.pageSize;

    if(this.searchKeyword.trim() === '') {
      await this.loadData(e.pageIndex, e.pageSize);
    } else {
      await this.loadDataWithSearch(this.searchKeyword, e.pageIndex, e.pageSize);
    }
    
  }


  async loadData(pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    await this.customerService.getCustomerList(pageIdx, pageSize).then((response: IAPIResponse) => {
      if(response.result !== null) {
        const result: any = response.result;

        this.dataSource.data = result.data;
        this.paginator.pageIndex = result.paginator.pageNumber;
        this.paginator.pageSize = result.paginator.pageSize;
        this.paginator.length =  result.paginator.totalRecordCount;
      }
    })
    .catch(async (error: Error) => {
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA + ': ' + error.message, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.error('Error fetching customer list:', error);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

  async loadDataWithSearch(keyword: string, pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    await this.customerService.getCustomerWithSearch(keyword, pageIdx, pageSize).then((response:IAPIResponse) => {
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
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA + ': ' + error.message, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.error('Error fetching customer list with search:', error);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });
  }

  onSearchInputChanged(keyword: string): void {
    this.subjectKeyword.next(keyword);
    this.paginator.pageIndex = 0;
  }

}
