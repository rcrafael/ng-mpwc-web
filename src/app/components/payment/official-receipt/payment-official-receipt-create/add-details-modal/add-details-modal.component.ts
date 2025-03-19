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
  billingAmount: number = 0;

  fg = new FormGroup({
    readingNo: new FormControl<string>('', Validators.required),
    meterNo: new FormControl<string>('',),
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
    penalty: new FormControl<number>(0),
    totalAmount: new FormControl<number>(0,),
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

    let billingStatus: number = 0;

    const data = this.fg.value;
    
    if (this.billingAmount >= (data.readingAmount ?? 0)) {
      billingStatus = 1; //complete
    } else {
      billingStatus = 2; //incomplete
    }

    let orDetails: IOfficialReceiptDetail = {
      readingNo: data.readingNo!,
      meterNo: data.meterNo!,
      readingAmountPaid: data.readingAmount ?? 0,
      parts: data.parts ?? 0,
      maintenanceFee: data.maintenanceFee ?? 0,
      septageFee: data.septageFee ?? 0,
      membership: data.membershipFee ?? 0,
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
      billingStatus: billingStatus,
    }

    this.billingList.push(orDetails);
    console.log('DETAILS ADDED:', orDetails);
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
        this.billingAmount = data.readingAmount;
        this.fg.patchValue({
          readingNo: data.readingNo,
          meterNo: data.meterNo,
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
