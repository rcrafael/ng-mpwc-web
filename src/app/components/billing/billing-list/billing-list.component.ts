import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { IBillingList } from '../../../models/interfaces/IBilling';

@Component({
  selector: 'app-billing-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './billing-list.component.html',
  styleUrl: './billing-list.component.css'
})
export class BillingListComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}


  dataSource!: MatTableDataSource<IBillingList>;
  tableCols: string[] = ['Reading No', 'Customer Id', 'Meter No', 'Customer Name', 'Alias', 'Branch Code', 'Address', 'Month', 'Billing Period', 'Due Date', 'Amount'];
  
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IBillingList>(dummyData);
  }


  onCreateNewClick() {
    this.router.navigateByUrl('/billing/create');
  }

}

export const dummyData: IBillingList[] = [
  {
    readingNo: '123',
    meterNo: 'ABC123',
    customerId: '1',
    accountId: '123456',
    firstName: 'John',
    middleName: 'Doe',
    lastName: 'Smith',
    alias: 'Johnny',
    branchCode: 1234,
    address: '123 Main St',
    billingMonth: 'January',
    billingStart: '2022-01-01',
    billingEnd: '2022-01-31',
    billingDueDate: '2022-01-25',
    totalAmount: 100.00,
  },
  {
    readingNo: '456',
    meterNo: 'XYZ789',
    customerId: '2',
    accountId: '654321',
    firstName: 'Jane',
    middleName: '',
    lastName: 'Doe',
    alias: 'Jane',
    branchCode: 1234,
    address: '456 Elm St',
    billingMonth: 'February',
    billingStart: '2022-02-01',
    billingEnd: '2022-02-28',
    billingDueDate: '2022-02-25',
    totalAmount: 150.00,
  },
  {
    readingNo: '789',
    meterNo: 'PQR901',
    customerId: '3',
    accountId: '789012',
    firstName: 'Michael',
    middleName: '',
    lastName: 'Johnson',
    alias: 'Michael',
    branchCode: 1234,
    address: '789 Oak St',
    billingMonth: 'March',
    billingStart: '2022-03-01',
    billingEnd: '2022-03-31',
    billingDueDate: '2022-03-25',
    totalAmount: 200.00,
  },
  {
    readingNo: '1011',
    meterNo: 'STU567',
    customerId: '4',
    accountId: '321654',
    firstName: 'Sarah',
    middleName: '',
    lastName: 'Williams',
    alias: 'Sarah',
    branchCode: 1234,
    address: '1011 Pine St',
    billingMonth: 'April',
    billingStart: '2022-04-01',
    billingEnd: '2022-04-30',
    billingDueDate: '2022-04-25',
    totalAmount: 250.00,
  },
  {
    readingNo: '1234',
    meterNo: 'VWX890',
    customerId: '5',
    accountId: '543210',
    firstName: 'David',
    middleName: '',
    lastName: 'Brown',
    alias: 'David',
    branchCode: 1234,
    address: '1234 Maple St',
    billingMonth: 'May',
    billingStart: '2022-05-01',
    billingEnd: '2022-05-31',
    billingDueDate: '2022-05-25',
    totalAmount: 300.00,
  }
]
