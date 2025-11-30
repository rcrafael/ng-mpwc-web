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
import { IBranchCode, ICustomerType, IPhase } from '../../../models/interfaces/ICommon';
import { branchCodeData, customerTypeData, phaseData } from '../../../common/enum';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { MatTooltip } from '@angular/material/tooltip';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-meter',
  standalone: true,
  imports: [
      MatTableModule,
      MatExpansionModule,
      MatIcon,
      NgIf,
      ReactiveFormsModule,
      MatTooltip
    ],
  templateUrl: './customer-meter.component.html',
  styleUrl: './customer-meter.component.css'
})
export class CustomerMeterComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private customerService: CustomerService,
    private toast: ToastrService
  ) {}

  @Input() customerId: string = '';

  toastTitlePrefix: string = 'Customer Meter List - ';

  tableCols: string[] = ['Meter No', 'Meter Type', 'Alias', 'Branch Code', 'Phase', 'Location', 'Previous', 'Present', 'Status', 'Actions'];
  dataSource: MatTableDataSource<IMeterDetails> = new MatTableDataSource<IMeterDetails>();
  branchCodes: IBranchCode[] = branchCodeData;
  customerTypes: ICustomerType[] = customerTypeData;
  phase: IPhase[] = phaseData;

  getStatus = Utils.getStatusName;
  getBranchCode = Utils.getBranchCode;
  getPhase = Utils.getPhase;
  getCustomerType = Utils.getCustomerType;

  isFieldsVisible = false;
  isUpdate = false;

  fg = new FormGroup({
    meterNo: new FormControl<string>('', Validators.required),
    serialNo: new FormControl<string>('',Validators.required),
    alias: new FormControl<string>(''),
    previous: new FormControl<number>(0),
    present: new FormControl<number>(0),
    branchCode: new FormControl<number>(-1, Validators.required),
    phase: new FormControl<number>(-1, Validators.required),
    meterType: new FormControl<number>(-1, Validators.required),
    location: new FormControl<string>('')
  })

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    await this.customerService.getMeterNoByCustomerId(this.customerId).then((response: IAPIResponse) => {
      const data: IMeterDetails[] = response.result as IMeterDetails[];
      this.dataSource = new MatTableDataSource<IMeterDetails>(data);;
    });
  }

  onAddNewClick(): void {
    this.isFieldsVisible = true;
  }
  
  async onSaveClick(): Promise<void> {
    // Save the new meter data
    this.isFieldsVisible = false;

    if(!this.fg.valid) {
      this.toast.error(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.ERROR);
      event?.preventDefault();
      return;
    }

    await this.createNew();
    event?.preventDefault();
  }

  onCancelClick():void {
    this.fg.reset();
    this.isFieldsVisible = false;
  }


  async createNew(): Promise<void> {
    const params: any = {
      customerId: this.customerId,
      meterNo: this.fg.value.meterNo!,
      serialNo: this.fg.value.serialNo!,
      alias: this.fg.value.alias!,
      branchCode: this.fg.value.branchCode!,
      phase: this.fg.value.phase!,
      customerType: this.fg.value.meterType!,
      location: this.fg.value.location!,
      previous: this.fg.value.previous!,
      present: this.fg.value.present!,
      status: 6, //6 = active
      createdBy: ''
    }

    this.commonService.showSpinner(true);
    await this.customerService.createMeterNo(params).then(async (response) => {
      console.log('respose', response);
      if(!response.result) {
        this.toast.error(`${ToastrMessage.ERROR_CREATE} : ${params.meterNo}`, this.toastTitlePrefix + ToastrTitle.ERROR);
        return;
      }

      this.toast.success(`${ToastrMessage.SUCCESS_CREATE} : ${params.meterNo}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
      await this.loadData();
    })
    .catch(err => {

      if(err instanceof HttpErrorResponse) {
        this.toast.error(`${ToastrMessage.ERROR_CREATE} : ${err.error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
      } else {
        this.toast.error(`${ToastrMessage.ERROR_CREATE} : ${params.meterNo}`, this.toastTitlePrefix + ToastrTitle.ERROR);
        console.log('Error:', err);
      }

    })
    .finally(() => {
      this.commonService.showSpinner(false);
    });

  }


}
