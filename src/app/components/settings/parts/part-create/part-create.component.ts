import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Utils } from '../../../../common/util';

@Component({
  selector: 'app-part-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './part-create.component.html',
  styleUrl: './part-create.component.css'
})
export class PartCreateComponent {

  constructor() {

  }

  readonly dialogRef = inject(MatDialogRef<PartCreateComponent>);
  
  formGroup = new FormGroup({
    description: new FormControl<string>('', Validators.required),
    measurement: new FormControl<string>('', Validators.required),
    unitCost: new FormControl<string>('0.00', Validators.required),
    sellingPrice: new FormControl<string>('0.00', Validators.required)
  });

  formatNumber = Utils.formatNumber;
  sanitizeAmount = Utils.sanitizeAmount;

  handleSave():void {
    event?.preventDefault();
    if(!this.formGroup.valid) {
      alert('Please provide valid inputs.');
      return;
    }

    let formValue = this.formGroup.value;
    this.dialogRef.close(formValue);
  }

  handleCloseDialog():void {
    this.dialogRef.close();
  }

  handleOnBlurAmount(): void {
    this.formGroup.get('unitCost')?.setValue(this.formatNumber(this.sanitizeAmount(this.formGroup.get('unitCost')?.value?.toString() ?? '0.00')));
    this.formGroup.get('sellingPrice')?.setValue(this.formatNumber(this.sanitizeAmount(this.formGroup.get('sellingPrice')?.value?.toString() ?? '0.00')));
  }

}
