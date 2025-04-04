import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomerService } from '../../../services/customer.service';
import { CommonService } from '../../../services/common.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { IMeterDetails } from '../../../models/interfaces/IMeter';
import { Utils } from '../../../common/util';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-meter',
  standalone: true,
  imports: [
      MatTableModule,
      MatExpansionModule,
      MatIcon,
      NgIf,
      ReactiveFormsModule
    ],
  templateUrl: './customer-meter.component.html',
  styleUrl: './customer-meter.component.css'
})
export class CustomerMeterComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private customerService: CustomerService
  ) {}

  @Input() customerId: string = '';

  tableCols: string[] = ['Meter No', 'Alias', 'Previous', 'Present', 'Status'];
  dataSource: MatTableDataSource<IMeterDetails> = new MatTableDataSource<IMeterDetails>();

  getStatus = Utils.getStatusName;

  isFieldsVisible = false;
  isUpdate = false;

  fg = new FormGroup({
    meterNo: new FormControl<string>('', Validators.required),
    alias: new FormControl<string>('', Validators.required),
    previous: new FormControl<number>(0),
    present: new FormControl<number>(0),
  })

  ngOnInit(): void {
      this.loadData();
  }

  loadData(): void {
    this.customerService.getMeterNoByCustomerId(this.customerId).then((response: IAPIResponse) => {
      const data: IMeterDetails[] = response.result as IMeterDetails[];
      this.dataSource = new MatTableDataSource<IMeterDetails>(data);;
    })
  }

  onAddNewClick(): void {
    this.isFieldsVisible = true;
  }
  
  onSaveClick(): void {
    // Save the new meter data
    this.isFieldsVisible = false;

    if(!this.fg.valid) {
      alert('Invalid input! Please try again.');
      return;
    }

    this.createNew();

  }


  createNew(): void {
    const params: any = {
      customerId: this.customerId,
      meterNo: this.fg.value.meterNo!,
      alias: this.fg.value.alias!,
      previous: this.fg.value.previous!,
      present: this.fg.value.present!,
      status: 6, //6 = active
      createdBy: ''
    }

    this.customerService.createMeterNo(params).then(() => {
      alert(`METER ${params.meterNo} CREATED.`);
      this.loadData();
    })
    .catch((err: Error) => {
      alert(`ERROR IN CREATING METER: ${params.meterNo}`);
      console.log('Error:', err);
    });

  }


}
