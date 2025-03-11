import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { CustomerService } from '../../../services/customer.service';
import { Utils } from '../../../common/util';

@Component({
  selector: 'app-browse-customers',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule
  ],
  templateUrl: './browse-customers.component.html',
  styleUrl: './browse-customers.component.css'
})
export class BrowseCustomersComponent implements OnInit {
  constructor(private customerService: CustomerService) {}
  readonly dialogRef = inject(MatDialogRef<BrowseCustomersComponent>);

  dialog = inject(MatDialog)
  data!: any;
  tableCols: string[] = [
    'Account No', 
    'First Name', 
    'Middle Name', 
    'Last Name', 
    'Branch Code', 
    'Address', 
    'Phase', 
    'Account Type'
  ];

  dataSource: MatTableDataSource<ICustomerProfile> = new MatTableDataSource<ICustomerProfile>();


  getStatus = Utils.getStatusName;

  ngOnInit(): void {
    this.customerService.getCustomerList().then((response:any) => {
      this.data = response;
      this.dataSource = this.data.result;
    });
   
  }

  onClose(): void {
    this.dialogRef.close();
  }

  selectRow(e: Event) {
    this.dialogRef.close(e);
  }
}
