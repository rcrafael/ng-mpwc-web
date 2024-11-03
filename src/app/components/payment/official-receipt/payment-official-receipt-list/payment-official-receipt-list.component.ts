import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { IOfficialReceiptList } from '../../../../models/interfaces/IOfficialReceipt';

@Component({
  selector: 'app-payment-official-receipt-list',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule
  ],
  templateUrl: './payment-official-receipt-list.component.html',
  styleUrl: './payment-official-receipt-list.component.css'
})
export class PaymentOfficialReceiptListComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}


  dataSource!: MatTableDataSource<IOfficialReceiptList>;

  tableCols: string[] = [
    'Official Receipt No', 
    'OR Date', 
    'Meter No',
    'Customer No', 
    'Customer Name', 
    'Total Billing Amount', 
    'Total Share Amount', 
    'Total Amount To Pay', 
    'Status'
  ];
  
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IOfficialReceiptList>(dummyDataOR);
  }


  onCreateNewClick() {
    this.router.navigateByUrl('/payment/official-receipt/create');
  }

}


export const dummyDataOR: IOfficialReceiptList[] = [
  {
    id: 1,
    orNo: 'OR123',
    orDate: '2022-12-01',
    customerId: 1,
    meterNo: 'ABC123',
    accountNo: '123456',
    customerName: 'John Doe',
    totalBillingAmount: 1000,
    totalShareAmount: 500,
    totalAmountToPay: 500,
    status: 'Pending'
  },
  {
    id: 2,
    orNo: 'OR456',
    orDate: '2022-12-05',
    customerId: 2,
    meterNo: 'DEF789',
    accountNo: '654321',
    customerName: 'Jane Smith',
    totalBillingAmount: 1500,
    totalShareAmount: 750,
    totalAmountToPay: 750,
    status: 'Pending'
  },
  {
    id: 3,
    orNo: 'OR789',
    orDate: '2022-12-08',
    customerId: 3,
    meterNo: 'GHI901',
    accountNo: '1234567',
    customerName: 'Michael Johnson',
    totalBillingAmount: 2000,
    totalShareAmount: 1000,
    totalAmountToPay: 1000,
    status: 'Pending'
  },
  {
    id: 4,
    orNo: 'OR123',
    orDate: '2022-12-01',
    customerId: 4,
    meterNo: 'ABC123',
    accountNo: '123456',
    customerName: 'John Doe',
    totalBillingAmount: 1000,
    totalShareAmount: 500,
    totalAmountToPay: 500,
    status: 'Pending'
  },
  {
    id: 5,
    orNo: 'OR456',
    orDate: '2022-12-05',
    customerId: 5,
    meterNo: 'DEF789',
    accountNo: '654321',
    customerName: 'Jane Smith',
    totalBillingAmount: 1500,
    totalShareAmount: 750,
    totalAmountToPay: 750,
    status: 'Pending'
  }
]

