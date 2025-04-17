import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IWaterRates } from '../../../../models/interfaces/IWaterRates';
import { Utils } from '../../../../common/util';

@Component({
  selector: 'app-rate-residential',
  standalone: true,
  imports: [
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './residential.component.html',
  styleUrl: './residential.component.css'
})
export class ResidentialComponent {

  constructor() {}

  tableCols: string[] = ['Description', 'Heirarchy', 'From', 'To', 'Rating', 'Base Amount'];
  dataSource = new MatTableDataSource<IWaterRates>();

  fg = new FormGroup({
    description: new FormControl<string>('', Validators.required),
    heirarchy: new FormControl<number|null>(null, Validators.required),
    fromM3: new FormControl<string>('0',Validators.required),
    toM3: new FormControl<string>('0',Validators.required),
    rating: new FormControl<string>('0', Validators.required),
    isBaseAmount: new FormControl<boolean>(false)
  })

  waterRates: IWaterRates[] = [];

  sanitizeNumber = Utils.sanitizeAmount;

  handleSubmit():void {
    const frm = this.fg.value;
    console.log('form', this.fg);
    if(!this.fg.valid) {
      alert('Please provide valid inputs.');
      return;
    }

    const waterRate: IWaterRates = {
      description: frm.description!,
      heirarchy: frm.heirarchy!,
      from: this.sanitizeNumber(frm.fromM3!),
      to: this.sanitizeNumber(frm.toM3!),
      ratingValue: this.sanitizeNumber(frm.rating!),
      isBaseAmount: frm.isBaseAmount!,
    }
    
    this.waterRates.push(waterRate);
    this.dataSource = new MatTableDataSource<IWaterRates>(this.waterRates);

  }

}
