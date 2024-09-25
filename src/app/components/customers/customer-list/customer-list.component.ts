import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICustomerList } from '../../../models/interfaces/ICustomer';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  dataSource!: MatTableDataSource<ICustomerList>;
  tableCols: string[] = ['Customer No', 'Last Name', 'First Name', 'Middle Name', 'Branch Code', 'Address', 'Customer Type'];

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ICustomerList>(dummyData);
    console.log('DATASOURCE: ', this.dataSource)
  }

  onCreateNewClick(): void {
    this.router.navigateByUrl('/customer/create');
  }
  
}

export const dummyData: ICustomerList[] = [
  {
    customerId: 1,
    nationalId: 'n1',
    accountNo: 'a1',
    meterNo: 'm1',
    alias: 'alias1',
    lastName: 'Dela Cruz',
    firstName: 'Juan',
    middleName: '',
    branchCode: 1,
    address: 'address1',
    customerType: 1
  },
  {
    customerId: 2,
    nationalId: 'n2',
    accountNo: 'a2',
    meterNo: 'm2',
    alias: 'alias2',
    lastName: 'San Pedro',
    firstName: 'Pedro',
    middleName: '',
    branchCode: 1,
    address: 'address2',
    customerType: 1
  },
  {
    customerId: 3,
    nationalId: 'n3',
    accountNo: 'a3',
    meterNo: 'm3',
    alias: 'alias3',
    lastName: 'Batute',
    firstName: 'Jose',
    middleName: '',
    branchCode: 1,
    address: 'address3',
    customerType: 2
  },
  {
    customerId: 4,
    nationalId: 'n4',
    accountNo: 'a4',
    meterNo: 'm4',
    alias: 'alias4',
    lastName: 'Rizal',
    firstName: 'Jose',
    middleName: '',
    branchCode: 1,
    address: 'address4',
    customerType: 3
  },
  {
    customerId: 5,
    nationalId: 'n5',
    accountNo: 'a5',
    meterNo: 'm5',
    alias: 'alias5',
    lastName: 'Mabini',
    firstName: 'Apolinario',
    middleName: '',
    branchCode: 1,
    address: 'address5',
    customerType: 4
  },
  {
    customerId: 6,
    nationalId: 'n6',
    accountNo: 'a6',
    meterNo: 'm6',
    alias: 'alias6',
    lastName: 'Bonifacio',
    firstName: 'Andres',
    middleName: '',
    branchCode: 3,
    address: 'address6',
    customerType: 2
  },
  {
    customerId: 1,
    nationalId: 'n7',
    accountNo: 'a1',
    meterNo: 'm1',
    alias: 'alias1',
    lastName: 'Dela Cruz',
    firstName: 'Juan',
    middleName: '',
    branchCode: 1,
    address: 'address1',
    customerType: 1
  },
  {
    customerId: 2,
    nationalId: 'n8',
    accountNo: 'a2',
    meterNo: 'm2',
    alias: 'alias2',
    lastName: 'San Pedro',
    firstName: 'Pedro',
    middleName: '',
    branchCode: 1,
    address: 'address2',
    customerType: 1
  },
  {
    customerId: 3,
    nationalId: 'n9',
    accountNo: 'a3',
    meterNo: 'm3',
    alias: 'alias3',
    lastName: 'Batute',
    firstName: 'Jose',
    middleName: '',
    branchCode: 1,
    address: 'address3',
    customerType: 2
  },
  {
    customerId: 4,
    nationalId: 'n10',
    accountNo: 'a4',
    meterNo: 'm4',
    alias: 'alias4',
    lastName: 'Rizal',
    firstName: 'Jose',
    middleName: '',
    branchCode: 1,
    address: 'address4',
    customerType: 3
  },
  {
    customerId: 5,
    nationalId: 'n11',
    accountNo: 'a5',
    meterNo: 'm5',
    alias: 'alias5',
    lastName: 'Mabini',
    firstName: 'Apolinario',
    middleName: '',
    branchCode: 1,
    address: 'address5',
    customerType: 4
  },
  {
    customerId: 6,
    nationalId: 'n12',
    accountNo: 'a6',
    meterNo: 'm6',
    alias: 'alias6',
    lastName: 'Bonifacio',
    firstName: 'Andres',
    middleName: '',
    branchCode: 3,
    address: 'address6',
    customerType: 2
  },
  {
    customerId: 1,
    nationalId: 'n13',
    accountNo: 'a1',
    meterNo: 'm1',
    alias: 'alias1',
    lastName: 'Dela Cruz',
    firstName: 'Juan',
    middleName: '',
    branchCode: 1,
    address: 'address1',
    customerType: 1
  },
  {
    customerId: 2,
    nationalId: 'n14',
    accountNo: 'a2',
    meterNo: 'm2',
    alias: 'alias2',
    lastName: 'San Pedro',
    firstName: 'Pedro',
    middleName: '',
    branchCode: 1,
    address: 'address2',
    customerType: 1
  },
  {
    customerId: 3,
    nationalId: 'n15',
    accountNo: 'a3',
    meterNo: 'm3',
    alias: 'alias3',
    lastName: 'Batute',
    firstName: 'Jose',
    middleName: '',
    branchCode: 1,
    address: 'address3',
    customerType: 2
  },
  {
    customerId: 4,
    nationalId: 'n16',
    accountNo: 'a4',
    meterNo: 'm4',
    alias: 'alias4',
    lastName: 'Rizal',
    firstName: 'Jose',
    middleName: '',
    branchCode: 1,
    address: 'address4',
    customerType: 3
  },
  {
    customerId: 5,
    nationalId: 'n17',
    accountNo: 'a5',
    meterNo: 'm5',
    alias: 'alias5',
    lastName: 'Mabini',
    firstName: 'Apolinario',
    middleName: '',
    branchCode: 1,
    address: 'address5',
    customerType: 4
  },
  {
    customerId: 6,
    nationalId: 'n18',
    accountNo: 'a6',
    meterNo: 'm6',
    alias: 'alias6',
    lastName: 'Bonifacio',
    firstName: 'Andres',
    middleName: '',
    branchCode: 3,
    address: 'address6',
    customerType: 2
  },
  {
    customerId: 1,
    nationalId: 'n19',
    accountNo: 'a1',
    meterNo: 'm1',
    alias: 'alias1',
    lastName: 'Dela Cruz',
    firstName: 'Juan',
    middleName: '',
    branchCode: 1,
    address: 'address1',
    customerType: 1
  },
  {
    customerId: 2,
    nationalId: 'n20',
    accountNo: 'a2',
    meterNo: 'm2',
    alias: 'alias2',
    lastName: 'San Pedro',
    firstName: 'Pedro',
    middleName: '',
    branchCode: 1,
    address: 'address2',
    customerType: 1
  },
  {
    customerId: 3,
    nationalId: 'n21',
    accountNo: 'a3',
    meterNo: 'm3',
    alias: 'alias3',
    lastName: 'Batute',
    firstName: 'Jose',
    middleName: '',
    branchCode: 1,
    address: 'address3',
    customerType: 2
  },
  {
    customerId: 4,
    nationalId: 'n22',
    accountNo: 'a4',
    meterNo: 'm4',
    alias: 'alias4',
    lastName: 'Rizal',
    firstName: 'Jose',
    middleName: '',
    branchCode: 1,
    address: 'address4',
    customerType: 3
  },
  {
    customerId: 5,
    nationalId: 'n23',
    accountNo: 'a5',
    meterNo: 'm5',
    alias: 'alias5',
    lastName: 'Mabini',
    firstName: 'Apolinario',
    middleName: '',
    branchCode: 1,
    address: 'address5',
    customerType: 4
  },
  {
    customerId: 6,
    nationalId: 'n23',
    accountNo: 'a6',
    meterNo: 'm6',
    alias: 'alias6',
    lastName: 'Bonifacio',
    firstName: 'Andres',
    middleName: '',
    branchCode: 3,
    address: 'address6',
    customerType: 2
  }
  
]