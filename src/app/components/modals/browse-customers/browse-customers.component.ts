import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../../services/customer.service';
import { Utils } from '../../../common/util';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browse-customers',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './browse-customers.component.html',
  styleUrl: './browse-customers.component.css'
})
export class BrowseCustomersComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private customerService: CustomerService,
    private toast: ToastrService
  ) {
    this.subscription = this.subjectKeyword.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(keyword => {
      if (keyword.trim() === '') {
        this.loadData(this.paginator.pageIndex, this.paginator.pageSize);
      } else {
        this.loadDataWithSearch(keyword, this.paginator.pageIndex, this.paginator.pageSize);
      }

    });
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  readonly dialogRef = inject(MatDialogRef<BrowseCustomersComponent>);

  dialog = inject(MatDialog)
  data!: any;
  tableCols: string[] = [
    'Account No',
    'First Name',
    'Middle Name',
    'Last Name',
    'Address',
  ];

  toastTitlePrefix = 'Customer List - ';

  pageIdx: number = 0;
  pageSize: number = 50;
  pageLength: number = 0;
  totalRecordCount: number = 0;
  dataSource: MatTableDataSource<ICustomerProfile> = new MatTableDataSource<ICustomerProfile>();
  searchKeyword: string = '';
  private subjectKeyword = new Subject<string>();
  private subscription: Subscription;


  getStatus = Utils.getStatusName;
  getCustomerType = Utils.getCustomerType;
  getPhase = Utils.getPhase;
  getBranch = Utils.getBranchCode;

  async ngOnInit(): Promise<void> {
    await this.loadData(this.pageIdx, this.pageSize);
  }

  async loadData(pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    await this.customerService.getCustomerList(pageIdx, pageSize).then((response: any) => {
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
    await this.customerService.getCustomerWithSearch(keyword, pageIdx, pageSize).then((response: IAPIResponse) => {
      if (response.result !== null) {
        const result: any = response.result;

        this.dataSource.data = result.data;
        this.paginator.pageIndex = result.paginator.pageNumber;
        this.paginator.pageSize = result.paginator.pageSize;
        this.paginator.length = result.paginator.totalRecordCount;
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

  async handlePageChange(e: PageEvent): Promise<void> {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;

    this.pageIdx = e.pageIndex;
    this.pageSize = e.pageSize;

    if (this.searchKeyword.trim() === '') {
      await this.loadData(e.pageIndex, e.pageSize);
    } else {
      await this.loadDataWithSearch(this.searchKeyword, e.pageIndex, e.pageSize);
    }

  }

  onSearchInputChanged(keyword: string): void {
    this.subjectKeyword.next(keyword);
    this.paginator.pageIndex = 0;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  selectRow(e: Event) {
    this.dialogRef.close(e);
  }
}
