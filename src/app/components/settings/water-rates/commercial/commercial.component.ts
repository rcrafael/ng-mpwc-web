import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Utils } from '../../../../common/util';
import { IWaterRates } from '../../../../models/interfaces/IWaterRates';
import { BillingService } from '../../../../services/billing.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';

@Component({
  selector: 'app-rate-commercial',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './commercial.component.html',
  styleUrl: './commercial.component.css'
})
export class CommercialComponent implements OnInit {


  constructor(
    private billingService: BillingService,
    private commonService: CommonService,
    private toast: ToastrService
  ) { }

  toastTitlePrefix = 'Water Rates Update - ';

  // fg = new FormGroup({
  //   zeroToFifteen: new FormControl<string>('0.00', Validators.required),
  //   sixteenToThirty: new FormControl<string>('0.00', Validators.required),
  //   thirtyOneToFiveHundred: new FormControl<string>('0.00', Validators.required),
  //   OverFiveHundredOne: new FormControl<string>('0.00', Validators.required),
  // });

  fg = new FormGroup({
    zeroToFifteen: new FormControl<string>('0.00', Validators.required),
    sixteenToThirty: new FormControl<string>('0.00', Validators.required),
    thirtyOneToFiveHundred: new FormControl<string>('0.00', Validators.required),
    fiveHundredOneToOneThousand: new FormControl<string>('0.00', Validators.required),
    overOneThousand: new FormControl<string>('0.00', Validators.required),
  });

  waterRates: IWaterRates[] = [];
  oldWaterRates: IWaterRates[] = [];

  sanitizeNumber = Utils.sanitizeAmount;
  formatNumber = Utils.formatNumber;

  async ngOnInit(): Promise<void> {
    await this.loadRates();
  }

  async handleSubmit(): Promise<void> {
    const formDate = this.fg.value;
    console.log('form', this.fg);
    if (!this.fg.valid) {
      alert('Please provide valid inputs.');
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.INVALID_INPUT);
      return;
    }

    console.log('FORM: ', formDate);
    // this.waterRates[0].ratingValue = this.sanitizeNumber(formDate.zeroToFifteen ?? '0');
    // this.waterRates[1].ratingValue = this.sanitizeNumber(formDate.sixteenToThirty ?? '0');
    // this.waterRates[2].ratingValue = this.sanitizeNumber(formDate.thirtyOneToFiveHundred ?? '0');
    // this.waterRates[3].ratingValue = this.sanitizeNumber(formDate.OverFiveHundredOne ?? '0');

    this.waterRates[0].ratingValue = this.sanitizeNumber(formDate.zeroToFifteen ?? '0');
    this.waterRates[1].ratingValue = this.sanitizeNumber(formDate.sixteenToThirty ?? '0');
    this.waterRates[2].ratingValue = this.sanitizeNumber(formDate.thirtyOneToFiveHundred ?? '0');
    this.waterRates[3].ratingValue = this.sanitizeNumber(formDate.fiveHundredOneToOneThousand ?? '0');
    this.waterRates[4].ratingValue = this.sanitizeNumber(formDate.overOneThousand ?? '0');

    console.table(this.waterRates);

    this.commonService.showSpinner(true);
    await this.billingService.updateWaterRatesCommercial(this.waterRates).then((response) => {
      const resp = response.result as IWaterRates[];
      this.oldWaterRates = structuredClone(resp);
      this.waterRates = structuredClone(resp);
      this.updateForm();
      this.toast.success(ToastrMessage.SUCCESS_UPDATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
    })
      .catch((error) => {
        console.log(error);
        this.toast.error(ToastrMessage.ERROR_UPDATE, this.toastTitlePrefix + ToastrTitle.ERROR);
      })
      .finally(() => {
        this.commonService.showSpinner(false);
      });

  }

  async loadRates(): Promise<void> {
    this.commonService.showSpinner(true);
    await this.billingService.getActiveWaterRatesCommercial().then((response) => {

      const resp = response.result as IWaterRates[];
      this.oldWaterRates = structuredClone(resp);
      this.waterRates = structuredClone(resp);
      this.updateForm();

    })
      .catch((error: Error) => {
        console.log(error);
        this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
      })
      .finally(() => {
        this.commonService.showSpinner(false);
      });

  }

  updateForm(): void {
    // this.fg.patchValue({
    //   zeroToFifteen: this.formatNumber(this.waterRates[0].ratingValue),
    //   sixteenToThirty: this.formatNumber(this.waterRates[1].ratingValue),
    //   thirtyOneToFiveHundred: this.formatNumber(this.waterRates[2].ratingValue),
    //   OverFiveHundredOne: this.formatNumber(this.waterRates[3].ratingValue),
    // });

    this.fg.patchValue({
      zeroToFifteen: this.formatNumber(this.waterRates[0].ratingValue),
      sixteenToThirty: this.formatNumber(this.waterRates[1].ratingValue),
      thirtyOneToFiveHundred: this.formatNumber(this.waterRates[2].ratingValue),
      fiveHundredOneToOneThousand: this.formatNumber(this.waterRates[3].ratingValue),
      overOneThousand: this.formatNumber(this.waterRates[4].ratingValue),
    });
  }

  handleInputOnBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = this.formatNumber(this.sanitizeNumber(inputElement.value));
  }

  handleReset(): void {
    // this.fg.reset({
    //   zeroToFifteen: this.formatNumber(this.oldWaterRates[0].ratingValue),
    //   sixteenToThirty: this.formatNumber(this.oldWaterRates[1].ratingValue),
    //   thirtyOneToFiveHundred: this.formatNumber(this.oldWaterRates[2].ratingValue),
    //   OverFiveHundredOne: this.formatNumber(this.oldWaterRates[3].ratingValue),
    // });

    this.fg.reset({
      zeroToFifteen: this.formatNumber(this.oldWaterRates[0].ratingValue),
      sixteenToThirty: this.formatNumber(this.oldWaterRates[1].ratingValue),
      thirtyOneToFiveHundred: this.formatNumber(this.oldWaterRates[2].ratingValue),
      fiveHundredOneToOneThousand: this.formatNumber(this.oldWaterRates[3].ratingValue),
      overOneThousand: this.formatNumber(this.oldWaterRates[4].ratingValue),
    });
  }

}
