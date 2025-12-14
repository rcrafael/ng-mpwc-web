import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { PaymentService } from '../../../services/payment.service';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Utils } from '../../../common/util';
import { IShareSummary } from '../../../models/interfaces/IShareSummary';

@Component({
  selector: 'app-customer-share-cap',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIcon,
    CommonModule,
    ReactiveFormsModule
],
  templateUrl: './customer-share-cap.component.html',
  styleUrl: './customer-share-cap.component.css'
})
export class CustomerShareCapComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private paymentService: PaymentService,
    private toast: ToastrService
  ) {}

  @Input() customerId: string = '';

  toasterTitlePrefix: string = 'Customer Share Cap - '

  shareSummary: IShareSummary | null = null;
  shareSummaryId: string|null = null;

  btnText: string = "Update";
  isUpdate: boolean = false;

  fg = new FormGroup({
    totalShareCapBeginning: new FormControl<string>('0.00', Validators.required),
    totalCbu: new FormControl<string>('0.00', Validators.required),
    totalDividend: new FormControl<string>('0.00', Validators.required),
    totalSavings: new FormControl<string>('0.00', Validators.required),
    rate: new FormControl<string>('0.00', Validators.required),
    totalPatronageRefundWater: new FormControl<string>('0.00', Validators.required),
    totalPatronageRefundRefilling: new FormControl<string>('0.00', Validators.required),
  })


  sanitizeAmount = Utils.sanitizeAmount;
  formatNumber = Utils.formatNumber;

  async ngOnInit(): Promise<void> {
    
    this.paymentService.getShareSummaryById(this.customerId).then((response: IAPIResponse) => {
      console.log('SHARE SUMMARY: ', response.result);
      const result: any = response.result;
      if(response.result) {
        this.shareSummaryId = result.id;
        this.shareSummary = result;

        this.fg.patchValue({
          totalShareCapBeginning: this.formatNumber(this.sanitizeAmount(result.totalShareCap.toString())),
          totalCbu: this.formatNumber(this.sanitizeAmount(result.totalCbu.toString())),
          totalDividend: this.formatNumber(this.sanitizeAmount(result.totalDividend.toString())),
          totalSavings: this.formatNumber(this.sanitizeAmount(result.totalSavings.toString())),
          rate: this.formatNumber(this.sanitizeAmount(result.rate.toString())),
          totalPatronageRefundWater: this.formatNumber(this.sanitizeAmount(result.totalPatronageRefundWater.toString())),
          totalPatronageRefundRefilling: this.formatNumber(this.sanitizeAmount(result.totalPatronageRefundRefilling.toString())),
        });
      }
    })
    .catch((error: Error) => {
      console.error('Error fetching share summary:', error);
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${error.message}`, this.toasterTitlePrefix + ToastrTitle.ERROR);
    });

  }

  async handleUpdateClick():Promise<void> {
    
    
    if(this.isUpdate) {
      await this.saveData();
    }

    console.log('IS UPDATE BEFORE: ', this.isUpdate);

    this.isUpdate = !this.isUpdate;
    this.btnText = this.isUpdate ? "Save" : "Update";

    console.log('IS UPDATE AFTER: ', this.isUpdate);
  }

  async saveData(): Promise<void> {
    if(this.fg.valid) {
      console.log('FORM VALUE: ', this.fg.value);
      this.commonService.showSpinner(true);

      const formData = this.fg.getRawValue();

      const params: IShareSummary = {
        id: this.shareSummaryId,
        customerId: this.customerId,
        totalShareCap: this.sanitizeAmount(formData.totalShareCapBeginning!),
        totalCbu: this.sanitizeAmount(formData.totalCbu!),
        totalDividend: this.sanitizeAmount(formData.totalDividend!),
        totalSavings: this.sanitizeAmount(formData.totalSavings!),
        rate: this.sanitizeAmount(formData.rate!),
        totalPatronageRefundWater: this.sanitizeAmount(formData.totalPatronageRefundWater!),
        totalPatronageRefundRefilling: this.sanitizeAmount(formData.totalPatronageRefundRefilling!),
        dateCreated: this.shareSummary?.dateCreated || null,
        createdBy: this.shareSummary?.createdBy || null,
      }

      await this.paymentService.updateShareSummary(params).then((response: IAPIResponse) => {
        console.log('RESPONSE: ', response);
        this.toast.success(ToastrMessage.SUCCESS_UPDATE, this.toasterTitlePrefix + ToastrTitle.SUCCESS);
      })
      .catch((error: Error) => {
        console.error('ERROR UPDATING SHARE SUMMARY: ', error);
        this.toast.error(`${ToastrMessage.ERROR_UPDATE}: ${error.message}`, this.toasterTitlePrefix + ToastrTitle.ERROR);
      })
      .finally(() => {
        this.commonService.showSpinner(false);
      })
    } else {
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toasterTitlePrefix + ToastrTitle.ERROR);
    }
  }

  handleBlur(ctrlName: string) {
    
    const ctrl = this.fg.get(ctrlName);

    if(ctrl) {
      ctrl.setValue(this.formatNumber(this.sanitizeAmount(ctrl.value)));
    } 

  }


}
