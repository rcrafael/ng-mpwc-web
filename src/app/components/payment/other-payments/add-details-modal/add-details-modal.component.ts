import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOtherPaymentTableDetails } from '../../../../models/interfaces/IOtherPayments';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PartsService } from '../../../../services/parts.service';
import { IPartItem, IPartsList } from '../../../../models/interfaces/IParts';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { Utils } from '../../../../common/util';
import { A11yModule } from "@angular/cdk/a11y";
import { MatIcon } from "@angular/material/icon";
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';

@Component({
  selector: 'app-add-details-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    A11yModule,
    MatIcon
],
  templateUrl: './add-details-modal.component.html',
  styleUrl: './add-details-modal.component.css'
})
export class AddDetailsModalComponent implements OnInit {

  constructor(
    private partsSvc: PartsService,
    private toast: ToastrService
  ) { }

  toastTitlePrefix = 'Add Details - ';

  readonly dialogRef = inject(MatDialogRef<AddDetailsModalComponent>);
  readonly modalData = inject<MatDialog>(MAT_DIALOG_DATA);
  dialog = inject(MatDialog)

  datasource: MatTableDataSource<IOtherPaymentTableDetails> = new MatTableDataSource<IOtherPaymentTableDetails>();
  tableCols: string[] = [
    'Description',
    'Remarks',
    'Amount',
    'Action'
  ];

  partsList: IPartsList[] = [];
  userParts: IPartItem[] = [];


  fg = new FormGroup({
    partId: new FormControl<string | null>(null, Validators.required),
    sellingPrice: new FormControl<string>('0.00', Validators.required),
    remarks: new FormControl<string>(''),
  })

  sanitizeAmount = Utils.sanitizeAmount;
  formatNumber = Utils.formatNumber;

  ngOnInit(): void {
    this.getPartsList();   
  }

  handleDoneButton(): void {
    this.dialogRef.close(this.userParts);
  }

  handleCancelButton(): void {
    this.dialogRef.close();
  }

  handleSubmit(e: Event) {
    const data = this.fg.value;

    if(!this.fg.valid) {
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.INVALID_INPUT);
      return;
    }

    const part: IPartItem = {
      id: data.partId!,
      description: this.getPartDescription(data.partId!),
      amount: this.sanitizeAmount(data.sellingPrice ?? '0.00').toString(),
      remarks: data.remarks!
    }

    this.userParts.push(part);
    this.datasource.data = this.userParts;

    this.handleReset();
  }

  getPartsList(): void {
    this.partsSvc.getPartsListing().then((response: IAPIResponse) => {
      this.partsList = response.result as IPartsList[];
    })
    .catch((err: Error) => {
      console.log('ERROR FETCHING PARTS LIST: ', err.message);
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA + ': ' + err.message, this.toastTitlePrefix + ToastrTitle.ERROR);  
    })
    .finally(() => {
      
    });
  } 

  handlePartChange(e: Event): void {
    const partId = (e.target as HTMLInputElement).value;
    const part = this.partsList.find((part) => part.id === partId);
    if(part) {
      this.fg.get('sellingPrice')?.setValue(this.formatNumber(this.sanitizeAmount(part.sellingPrice.toString())) ?? '0.00');
    }
  }

  getPartDescription(partId: string): string {
    const part = this.partsList.find((part) => part.id === partId);
    return part ? part.description : '';
  }
  
  handleReset(): void {
    this.fg.reset({
      partId: null,
      sellingPrice: '0.00',
      remarks: ''
    });  
  }

  handleAmountOnBlur(e: any): void {
    const input = e.target as HTMLInputElement;
    this.fg.get('sellingPrice')?.setValue(this.formatNumber(this.sanitizeAmount(input.value) ?? '0.00')); 
  }

  handleRowDelete(e: any): void {
    this.userParts = this.userParts.filter((part) => part.id !== e.id);
    this.datasource.data = this.userParts;
  }

}
