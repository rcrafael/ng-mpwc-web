import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOtherPaymentDetails } from '../../../../models/interfaces/IOtherPayments';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-details-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule
  ],
  templateUrl: './add-details-modal.component.html',
  styleUrl: './add-details-modal.component.css'
})
export class AddDetailsModalComponent {
  readonly dialogRef = inject(MatDialogRef<AddDetailsModalComponent>);

  dialog = inject(MatDialog)

  datasource: MatTableDataSource<IOtherPaymentDetails> = new MatTableDataSource<IOtherPaymentDetails>();
  tableCols: string[] = [
    'Parts',
    'Other Description',
    'Remarks',
    'Total Amount'
  ]

  onClose(): void {
    this.dialogRef.close();
  }

  handleSubmit(e: Event) {
    console.log('form submitted',e);
    e.preventDefault();
  }

}
