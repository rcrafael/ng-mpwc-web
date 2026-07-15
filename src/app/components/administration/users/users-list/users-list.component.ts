import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NoDataToDisplayComponent } from "../../../common/no-data-to-display/no-data-to-display.component";
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatTableModule,
    NoDataToDisplayComponent,
    MatPaginatorModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    NgIf,
],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  
  constructor(
    private router: Router,
    private userService: UserService,
    private commonService: CommonService,
    private toast: ToastrService
  ) {
    
  }

  toastTitlePrefix = 'Customer List - ';
  dataSource = new MatTableDataSource([]);
  tableCols: string[] = [
    'Username',
    'Email', 
    'Last Name', 
    'First Name', 
    'Middle Name'
  ];

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.commonService.showSpinner(true);
    await this.userService.getAllUser().then((response: IAPIResponse) => {
      if(response.result !== null) {
        const result: any = response.result;
        this.dataSource.data = result;
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


  onCreateNewClick(): void {
    this.router.navigateByUrl('/admin/user/create');
  }



}
