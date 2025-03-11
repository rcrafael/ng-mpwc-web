import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICustomerList } from '../../../../models/interfaces/ICustomer';

@Component({
  selector: 'app-customer-list-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule
  ],
  templateUrl: './customer-list-modal.component.html',
  styleUrl: './customer-list-modal.component.css'
})
export class CustomerListModalComponent {
  readonly dialog = inject(MatDialogRef<CustomerListModalComponent>)

  constructor() {}

  dataSource!: MatTableDataSource<ICustomerList>;
  tableCols: string[] = [
    'Customer No',
    'Account No', 
    'Meter No',
    'Last Name', 
    'First Name', 
    'Middle Name', 
    'Branch Code', 
    'Address', 
    'Customer Type'
  ];


  onClose(): void {
    this.dialog.close();
  }

}
