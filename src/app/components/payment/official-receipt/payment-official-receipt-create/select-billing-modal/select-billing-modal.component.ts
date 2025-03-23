import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IBillingInfo } from '../../../../../models/interfaces/IBilling';
import { BillingService } from '../../../../../services/billing.service';
import { IAPIResponse } from '../../../../../models/interfaces/IApiResponse';
import { Utils } from '../../../../../common/util';

@Component({
  selector: 'app-select-billing-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule
  ],
  templateUrl: './select-billing-modal.component.html',
  styleUrl: './select-billing-modal.component.css'
})
export class SelectBillingModalComponent implements OnInit {

  constructor (
    private billingService: BillingService
  ) {}

  readonly dialogRef = inject(MatDialogRef<SelectBillingModalComponent>);
  readonly modalData:any = inject<MatDialog>(MAT_DIALOG_DATA);

  dataSource!: MatTableDataSource<IBillingInfo>; 
  tableCols: string[] =[
    "Reading No",
    "Meter No",
    "Month Of",
    "Date From",
    "Date To",
    "Due Date",
    "Previous",
    "Present",
    "M3 Used",
    "Remarks",
    "Reading Amount",
    "Parts",
    "Maintenance Fee",
    "Septage Fee",
    "Less",
    "Total Amount"
  ]

  customerId: string = '';
  
  getMonth = Utils.getMonth;
  formatAmount = Utils.formatCurrency;
  
  ngOnInit(): void {
    this.customerId = this.modalData.customerId;
    this.billingService.getUnpaidBillsByCustomerId(this.customerId).then((response:IAPIResponse) => {
      const result: any = response.result;
      this.dataSource = result;
    })
  }

  onSelectRow(e: Event): void {
    this.dialogRef.close(e);
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
