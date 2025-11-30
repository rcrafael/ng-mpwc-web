import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOfficialReceiptDetail } from '../../../../../models/interfaces/IOfficialReceipt';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SelectBillingModalComponent } from '../select-billing-modal/select-billing-modal.component';
import { Utils } from '../../../../../common/util';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../../common/constants';

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

  constructor(
    private toast: ToastrService
  ) {

  }  
  
  toastTitlePrefix = 'OR Add Details - ';

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

  formatAmount = Utils.formatCurrency;
  formatNumber = Utils.formatNumber;
  sanitizeAmount = Utils.sanitizeAmount;

  fg = new FormGroup({
    readingNo: new FormControl<string>('', Validators.required),
    meterNo: new FormControl<string>('',),
    readingAmount: new FormControl<string>('0.00'),
    parts: new FormControl<string>('0.00'),
    maintenanceFee: new FormControl<string>('0.00'),
    membershipFee: new FormControl<string>('0.00'),
    subReceivable: new FormControl<string>('0.00'),
    tapping: new FormControl<string>('0.00'),
    reconnection: new FormControl<string>('0.00'),
    calibration: new FormControl<string>('0.00'),
    septageFee: new FormControl<string>('0.00'),
    otherCollection: new FormControl<string>('0.00'),
    otherDescription: new FormControl<string>(''),
    seniorDiscount: new FormControl<string>('0.00'),
    penalty: new FormControl<string>('0.00'),
    totalAmount: new FormControl<string>('0.00'),
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
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.INVALID_INPUT);
      return;
    }

    let billingStatus: number = 0;

    const data = this.fg.value;
    
    if (this.billingAmount >= this.sanitizeAmount(data.readingAmount ?? '0')) {
      billingStatus = 1; //complete
    } else {
      billingStatus = 2; //incomplete
    }

    let orDetails: IOfficialReceiptDetail = {
      readingNo: data.readingNo!,
      meterNo: data.meterNo!,
      readingAmountPaid: this.sanitizeAmount(data.readingAmount ?? '0'),
      parts: this.sanitizeAmount(data.parts ?? '0'),
      maintenanceFee: this.sanitizeAmount(data.maintenanceFee ?? '0'),
      septageFee: this.sanitizeAmount(data.septageFee ?? '0'),
      membership: this.sanitizeAmount(data.membershipFee ?? '0'),
      tapping: this.sanitizeAmount(data.tapping ?? '0'),
      calibration: this.sanitizeAmount(data.calibration ?? '0'),
      reconnection: this.sanitizeAmount(data.reconnection ?? '0'),
      subReceivable: this.sanitizeAmount(data.subReceivable ?? '0'),
      penalty: this.sanitizeAmount(data.penalty ?? '0'),
      otherCollection: this.sanitizeAmount(data.otherCollection ?? '0'),
      otherDescription: data.otherDescription ?? '',
      seniorDiscount: this.sanitizeAmount(data.seniorDiscount ?? '0'),
      remarks: data.remarks ?? '',
      totalAmount: this.sanitizeAmount(data.totalAmount ?? '0'),
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
        console.log('SELECTED BILLING DATA: ', data);
        this.billingAmount = data.readingAmount;
        this.fg.patchValue({
          readingNo: data.readingNo ,
          meterNo: data.meterNo,
          readingAmount: this.formatNumber(data.readingAmount ?? 0),
          parts: this.formatNumber(data.parts ?? 0),
          maintenanceFee: this.formatNumber(data.maintenanceFee ?? 0),
          septageFee: this.formatNumber(data.septageFee ?? 0),
          totalAmount: this.formatNumber(data.totalAmount ?? 0),
        }, {emitEvent: false});
        this.computeTotalAmount();
      }
    });
  }

  computeTotalAmount(): void {

    const frm = this.fg.value;
    const billAmount = this.sanitizeAmount(frm.readingAmount ?? '0');
    const parts = this.sanitizeAmount(frm.parts ?? '0');
    const maintenanceFee = this.sanitizeAmount(frm.maintenanceFee ?? '0');
    const memberShipFee = this.sanitizeAmount(frm.membershipFee ?? '0');
    const subReceivable = this.sanitizeAmount(frm.subReceivable ?? '0');
    const tapping = this.sanitizeAmount(frm.tapping ?? '0');
    const reconnection = this.sanitizeAmount(frm.reconnection ?? '0');
    const calibration = this.sanitizeAmount(frm.calibration ?? '0');
    const septageFee = this.sanitizeAmount(frm.septageFee ?? '0');
    const others = this.sanitizeAmount(frm.otherCollection ?? '0');
    const penalty = this.sanitizeAmount(frm.penalty ?? '0');
    const discount = this.sanitizeAmount(frm.seniorDiscount ?? '0');

    let totalAmount = 0;
    totalAmount = (billAmount + parts + maintenanceFee + memberShipFee + subReceivable + tapping + reconnection + calibration + septageFee + others + penalty) - discount

    this.fg.patchValue({
      totalAmount: this.formatNumber(totalAmount ?? 0)
    })

  }

  addPenalty(e:any): void {

    if(e.target.checked) {
      const billAmount = this.sanitizeAmount(this.fg.get('readingAmount')?.value ?? '0');
      const penalty = billAmount * 0.1

      this.fg.patchValue({
        penalty: this.formatNumber(penalty ?? 0)
      })

    } else {
      this.fg.patchValue({
        penalty: this.formatNumber(0)
      })
    }

    this.computeTotalAmount();
  }

  handleOnBlur(e:any, fieldName: string) : void {
    e = this.formatNumber(e.target.value ?? '0');
    
    this.fg.get(fieldName)?.setValue(e);

  }

}
