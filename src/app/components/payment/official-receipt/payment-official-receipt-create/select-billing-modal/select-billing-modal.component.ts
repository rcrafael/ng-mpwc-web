import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IBillingInfo } from '../../../../../models/interfaces/IBilling';

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
export class SelectBillingModalComponent {

  readonly dialogRef = inject(MatDialogRef<SelectBillingModalComponent>);

  dataSource!: MatTableDataSource<IBillingInfo>; 
  tableCols: string[] =[
    "Reading No",
    "Mobile Reading No",
    "Meter No",
    "Month Of",
    "Date From",
    "Date To",
    "Due Date",
    "Previous",
    "Present",
    "M3 Used",
    "Rate",
    "Remarks",
    "Reading Amount",
    "Parts",
    "Maintenance Fee",
    "Septage Fee",
    "Less",
    "Total Amount"
  ]

  onClose(): void {
    this.dialogRef.close();
  }

}
