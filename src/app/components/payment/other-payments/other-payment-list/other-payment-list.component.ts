import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IOtherPaymentList } from '../../../../models/interfaces/IOtherPayments';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-other-payment-list',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule
  ],
  templateUrl: './other-payment-list.component.html',
  styleUrl: './other-payment-list.component.css'
})
export class OtherPaymentListComponent implements OnInit {

    constructor(
      private router: Router,
    ) {}

    dataSource!: MatTableDataSource<IOtherPaymentList>;
    tableCols: string[] = [
      'Official Receipt No', 
      'OR Date', 
      'Meter No',
      'Customer No', 
      'Customer Name', 
      'Total Amount To Pay', 
      'Status'
    ];

    ngOnInit(): void {
      this.dataSource = new MatTableDataSource<IOtherPaymentList>([]);
    }
    
    onCreateNewClick() {
      this.router.navigateByUrl('/payment/other-receipt/create');
    }

    
}
