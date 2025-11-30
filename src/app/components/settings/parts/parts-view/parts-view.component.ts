import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Utils } from '../../../../common/util';
import { PartsService } from '../../../../services/parts.service';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-parts-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule],
  templateUrl: './parts-view.component.html',
  styleUrl: './parts-view.component.css'
})
export class PartsViewComponent implements OnInit {

  constructor(
    private partsService: PartsService,
    private toast: ToastrService,
    private commonService: CommonService
  ) {
    
  }

  toastTitlePrefix = 'Parts Update - ';

  readonly dialogRef = inject(MatDialogRef<PartsViewComponent>);
  readonly modalData = inject<MatDialog>(MAT_DIALOG_DATA);
  
  formGroup = new FormGroup({
    description: new FormControl<string>('', Validators.required),
    measurement: new FormControl<string>('', Validators.required),
    unitCost: new FormControl<string>('0.00', Validators.required),
    sellingPrice: new FormControl<string>('0.00', Validators.required)
  });

  resp!:any;
  itemId: string = '';

  formatNumber = Utils.formatNumber;
  sanitizeAmount = Utils.sanitizeAmount;


  async ngOnInit(): Promise<void> {
    this.itemId = this.modalData.toString();
    
    this.commonService.showSpinner(true);
    await this.partsService.getPartByid(this.itemId).then((response: IAPIResponse) => {
      if(response.result !== null){
        this.resp = response.result;
        this.formGroup.patchValue({
          description: this.resp.description.toString(),
          measurement: this.resp.measurement,
          unitCost: this.formatNumber(this.sanitizeAmount(this.resp.unitCost?.toString() ?? '0.00')),
          sellingPrice: this.formatNumber(this.sanitizeAmount(this.resp.sellingPrice?.toString() ?? '0.00'))
        });
      }
    }).catch((error: Error) => {
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.log('ERROR FETCHING PARTS: ', error.message);
    }).finally(() => {
      this.commonService.showSpinner(false);
    });

  }  
    
  handleSave():void {
    event?.preventDefault();
    if(!this.formGroup.valid) {
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.ERROR);
      return;
    }

    let formValue = this.formGroup.value;
    this.dialogRef.close(formValue);
  }

  handleRest():void {
    if(this.resp !== null) {
      this.formGroup.reset({
        description: this.resp.description.toString(),
        measurement: this.resp.measurement,
        unitCost: this.formatNumber(this.sanitizeAmount(this.resp.unitCost?.toString() ?? '0.00')),
        sellingPrice: this.formatNumber(this.sanitizeAmount(this.resp.sellingPrice?.toString() ?? '0.00'))
      });
    }
  }

  handleCloseDialog():void {
    this.dialogRef.close();
  }

  handleOnBlurAmount(): void {
    this.formGroup.get('unitCost')?.setValue(this.formatNumber(this.sanitizeAmount(this.formGroup.get('unitCost')?.value?.toString() ?? '0.00')));
    this.formGroup.get('sellingPrice')?.setValue(this.formatNumber(this.sanitizeAmount(this.formGroup.get('sellingPrice')?.value?.toString() ?? '0.00')));
  }

}
