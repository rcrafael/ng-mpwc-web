import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOfficialReceiptDetail } from '../../../../models/interfaces/IOfficialReceipt';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectBillingModalComponent } from '../select-billing-modal/select-billing-modal.component';

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
  styleUrl: './add-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDetailsModalComponent {
  readonly dialogRef = inject(MatDialogRef<AddDetailsModalComponent>);

  dialog = inject(MatDialog)

  datasource: MatTableDataSource<IOfficialReceiptDetail> = new MatTableDataSource<IOfficialReceiptDetail>(dummyData);
  tableCols: string[] = [
    'Reading No',
    'Mobile Reading No',
    'Reading Amount Paid',
    'Parts',
    'Maintenance Fee',
    'Septage Fee',
    'Membership Fee',
    'Tapping',
    'Calibration',
    'Reconnection',
    'Sub Receivable',
    'Penalty',
    'Other Collection',
    'Other Description',
    'Senior Discount',
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

  openDetailFormDialog(): void {
    this.dialog.open(SelectBillingModalComponent, {
      width: '60%',
      height: '60%'
    });
  }

}


const dummyData: IOfficialReceiptDetail[] = [
  {
    id: 1,
    readingNo: 1,
    mobileReadingNo: 1,
    readingAmount: 1,
    parts: 1,
    maintenanceFee: 1,
    septageFee: 1,
    membershipFee: 1,
    tapping: 1,
    calibration: 1,
    reconnection: 1,
    subReceivable: 1,
    penalty: 1,
    otherCollection: 1,
    otherDescription: '',
    seniorDiscount: 1,
    remarks: '',
    totalAmount: 1
  },
  {
    id: 2,
    readingNo: 2,
    mobileReadingNo: 2,
    readingAmount: 2,
    parts: 2,
    maintenanceFee: 2,
    septageFee: 2,
    membershipFee: 2,
    tapping: 2,
    calibration: 2,
    reconnection: 2,
    subReceivable: 2,
    penalty: 2,
    otherCollection: 2,
    otherDescription: '',
    seniorDiscount: 2,
    remarks: '',
    totalAmount: 2
  },
  {
    id: 3,
    readingNo: 3,
    mobileReadingNo: 3,
    readingAmount: 3,
    parts: 3,
    maintenanceFee: 3,
    septageFee: 3,
    membershipFee: 3,
    tapping: 3,
    calibration: 3,
    reconnection: 3,
    subReceivable: 3,
    penalty: 3,
    otherCollection: 3,
    otherDescription: '',
    seniorDiscount: 3,
    remarks: '',
    totalAmount: 3
  },
  {
    id: 2,
    readingNo: 2,
    mobileReadingNo: 2,
    readingAmount: 2,
    parts: 2,
    maintenanceFee: 2,
    septageFee: 2,
    membershipFee: 2,
    tapping: 2,
    calibration: 2,
    reconnection: 2,
    subReceivable: 2,
    penalty: 2,
    otherCollection: 2,
    otherDescription: '',
    seniorDiscount: 2,
    remarks: '',
    totalAmount: 2
  },
  {
    id: 3,
    readingNo: 3,
    mobileReadingNo: 3,
    readingAmount: 3,
    parts: 3,
    maintenanceFee: 3,
    septageFee: 3,
    membershipFee: 3,
    tapping: 3,
    calibration: 3,
    reconnection: 3,
    subReceivable: 3,
    penalty: 3,
    otherCollection: 3,
    otherDescription: '',
    seniorDiscount: 3,
    remarks: '',
    totalAmount: 3
  },
  {
    id: 2,
    readingNo: 2,
    mobileReadingNo: 2,
    readingAmount: 2,
    parts: 2,
    maintenanceFee: 2,
    septageFee: 2,
    membershipFee: 2,
    tapping: 2,
    calibration: 2,
    reconnection: 2,
    subReceivable: 2,
    penalty: 2,
    otherCollection: 2,
    otherDescription: '',
    seniorDiscount: 2,
    remarks: '',
    totalAmount: 2
  },
  {
    id: 3,
    readingNo: 3,
    mobileReadingNo: 3,
    readingAmount: 3,
    parts: 3,
    maintenanceFee: 3,
    septageFee: 3,
    membershipFee: 3,
    tapping: 3,
    calibration: 3,
    reconnection: 3,
    subReceivable: 3,
    penalty: 3,
    otherCollection: 3,
    otherDescription: '',
    seniorDiscount: 3,
    remarks: '',
    totalAmount: 3
  },
  {
    id: 2,
    readingNo: 2,
    mobileReadingNo: 2,
    readingAmount: 2,
    parts: 2,
    maintenanceFee: 2,
    septageFee: 2,
    membershipFee: 2,
    tapping: 2,
    calibration: 2,
    reconnection: 2,
    subReceivable: 2,
    penalty: 2,
    otherCollection: 2,
    otherDescription: '',
    seniorDiscount: 2,
    remarks: '',
    totalAmount: 2
  },
  {
    id: 3,
    readingNo: 3,
    mobileReadingNo: 3,
    readingAmount: 3,
    parts: 3,
    maintenanceFee: 3,
    septageFee: 3,
    membershipFee: 3,
    tapping: 3,
    calibration: 3,
    reconnection: 3,
    subReceivable: 3,
    penalty: 3,
    otherCollection: 3,
    otherDescription: '',
    seniorDiscount: 3,
    remarks: '',
    totalAmount: 3
  }
]
