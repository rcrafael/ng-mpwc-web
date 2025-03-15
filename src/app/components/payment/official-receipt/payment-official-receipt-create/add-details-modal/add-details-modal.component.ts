import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOfficialReceiptDetail } from '../../../../../models/interfaces/IOfficialReceipt';
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
})
export class AddDetailsModalComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<AddDetailsModalComponent>);
  readonly modalData:any = inject<MatDialog>(MAT_DIALOG_DATA);
  dialog = inject(MatDialog)

  billingList: IOfficialReceiptDetail[] = []; //
  datasource: MatTableDataSource<IOfficialReceiptDetail> = new MatTableDataSource<IOfficialReceiptDetail>();
  tableCols: string[] = [
    'Reading No',
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

  customerId: string = '';

  fg = new FormGroup({
    readingNo: new FormControl<string>('', Validators.required),
    readingAmount: new FormControl<number>(0),
    parts: new FormControl<number>(0),
    maintenanceFee: new FormControl<number>(0),
    membershipFee: new FormControl<number>(0),
    subReceivable: new FormControl<number>(0),
    tapping: new FormControl<number>(0),
    reconnection: new FormControl<number>(0),
    calibration: new FormControl<number>(0),
    septageFee: new FormControl<number>(0),
    otherCollection: new FormControl<number>(0),
    otherDescription: new FormControl<string>(''),
    seniorDiscount: new FormControl<number>(0),
    penalty: new FormControl<number>({value: 0, disabled: true}),
    totalAmount: new FormControl<number>({value: 0, disabled: true}),
    remarks: new FormControl<string>(''),
  })

  ngOnInit(): void {
    this.customerId = this.modalData.customerId;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onDoneClick(): void {
    this.dialogRef.close(this.billingList);
  }

  handleSubmit() {

    if(!this.fg.valid) {
      alert("Invalid Input. Please try again.");
      return;
    }

    const data = this.fg.value;
    let orDetails: IOfficialReceiptDetail = {
      readingNo: data.readingNo!,
      readingAmount: data.readingAmount ?? 0,
      parts: data.parts ?? 0,
      maintenanceFee: data.maintenanceFee ?? 0,
      septageFee: data.septageFee ?? 0,
      membershipFee: data.membershipFee ?? 0,
      tapping: data.tapping ?? 0,
      calibration: data.calibration ?? 0,
      reconnection: data.reconnection ?? 0,
      subReceivable: data.subReceivable ?? 0,
      penalty: data.penalty ?? 0,
      otherCollection: data.otherCollection ?? 0,
      otherDescription: data.otherDescription ?? '',
      seniorDiscount: data.seniorDiscount ?? 0,
      remarks: data.remarks ?? '',
      totalAmount: data.totalAmount ?? 0,
    }

    this.billingList.push(orDetails);
    this.datasource = new MatTableDataSource<IOfficialReceiptDetail>(this.billingList);
  }

  openBillingListDialog(): void {
    const dialogRef = this.dialog.open(SelectBillingModalComponent, {
      data: {customerId: this.customerId},
      width: '60%',
      height: '60%'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.fg.patchValue({
          readingNo: data.readingNo,
          readingAmount: data.readingAmount,
          parts: data.parts,
          maintenanceFee: data.maintenanceFee,
          septageFee: data.septageFee,
          totalAmount: data.totalAmount,
        })
      }
    });
  }

}


// const dummyData: IOfficialReceiptDetail[] = [
//   {
//     id: 1,
//     readingNo: 1,
//     mobileReadingNo: 1,
//     readingAmount: 1,
//     parts: 1,
//     maintenanceFee: 1,
//     septageFee: 1,
//     membershipFee: 1,
//     tapping: 1,
//     calibration: 1,
//     reconnection: 1,
//     subReceivable: 1,
//     penalty: 1,
//     otherCollection: 1,
//     otherDescription: '',
//     seniorDiscount: 1,
//     remarks: '',
//     totalAmount: 1
//   },
//   {
//     id: 2,
//     readingNo: 2,
//     mobileReadingNo: 2,
//     readingAmount: 2,
//     parts: 2,
//     maintenanceFee: 2,
//     septageFee: 2,
//     membershipFee: 2,
//     tapping: 2,
//     calibration: 2,
//     reconnection: 2,
//     subReceivable: 2,
//     penalty: 2,
//     otherCollection: 2,
//     otherDescription: '',
//     seniorDiscount: 2,
//     remarks: '',
//     totalAmount: 2
//   },
//   {
//     id: 3,
//     readingNo: 3,
//     mobileReadingNo: 3,
//     readingAmount: 3,
//     parts: 3,
//     maintenanceFee: 3,
//     septageFee: 3,
//     membershipFee: 3,
//     tapping: 3,
//     calibration: 3,
//     reconnection: 3,
//     subReceivable: 3,
//     penalty: 3,
//     otherCollection: 3,
//     otherDescription: '',
//     seniorDiscount: 3,
//     remarks: '',
//     totalAmount: 3
//   },
//   {
//     id: 2,
//     readingNo: 2,
//     mobileReadingNo: 2,
//     readingAmount: 2,
//     parts: 2,
//     maintenanceFee: 2,
//     septageFee: 2,
//     membershipFee: 2,
//     tapping: 2,
//     calibration: 2,
//     reconnection: 2,
//     subReceivable: 2,
//     penalty: 2,
//     otherCollection: 2,
//     otherDescription: '',
//     seniorDiscount: 2,
//     remarks: '',
//     totalAmount: 2
//   },
//   {
//     id: 3,
//     readingNo: 3,
//     mobileReadingNo: 3,
//     readingAmount: 3,
//     parts: 3,
//     maintenanceFee: 3,
//     septageFee: 3,
//     membershipFee: 3,
//     tapping: 3,
//     calibration: 3,
//     reconnection: 3,
//     subReceivable: 3,
//     penalty: 3,
//     otherCollection: 3,
//     otherDescription: '',
//     seniorDiscount: 3,
//     remarks: '',
//     totalAmount: 3
//   },
//   {
//     id: 2,
//     readingNo: 2,
//     mobileReadingNo: 2,
//     readingAmount: 2,
//     parts: 2,
//     maintenanceFee: 2,
//     septageFee: 2,
//     membershipFee: 2,
//     tapping: 2,
//     calibration: 2,
//     reconnection: 2,
//     subReceivable: 2,
//     penalty: 2,
//     otherCollection: 2,
//     otherDescription: '',
//     seniorDiscount: 2,
//     remarks: '',
//     totalAmount: 2
//   },
//   {
//     id: 3,
//     readingNo: 3,
//     mobileReadingNo: 3,
//     readingAmount: 3,
//     parts: 3,
//     maintenanceFee: 3,
//     septageFee: 3,
//     membershipFee: 3,
//     tapping: 3,
//     calibration: 3,
//     reconnection: 3,
//     subReceivable: 3,
//     penalty: 3,
//     otherCollection: 3,
//     otherDescription: '',
//     seniorDiscount: 3,
//     remarks: '',
//     totalAmount: 3
//   },
//   {
//     id: 2,
//     readingNo: 2,
//     mobileReadingNo: 2,
//     readingAmount: 2,
//     parts: 2,
//     maintenanceFee: 2,
//     septageFee: 2,
//     membershipFee: 2,
//     tapping: 2,
//     calibration: 2,
//     reconnection: 2,
//     subReceivable: 2,
//     penalty: 2,
//     otherCollection: 2,
//     otherDescription: '',
//     seniorDiscount: 2,
//     remarks: '',
//     totalAmount: 2
//   },
//   {
//     id: 3,
//     readingNo: 3,
//     mobileReadingNo: 3,
//     readingAmount: 3,
//     parts: 3,
//     maintenanceFee: 3,
//     septageFee: 3,
//     membershipFee: 3,
//     tapping: 3,
//     calibration: 3,
//     reconnection: 3,
//     subReceivable: 3,
//     penalty: 3,
//     otherCollection: 3,
//     otherDescription: '',
//     seniorDiscount: 3,
//     remarks: '',
//     totalAmount: 3
//   }
// ]
