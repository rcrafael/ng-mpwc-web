import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IWaterRates } from '../../../../models/interfaces/IWaterRates';
import { Utils } from '../../../../common/util';
import { BillingService } from '../../../../services/billing.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';

@Component({
  selector: 'app-rate-residential',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './residential.component.html',
  styleUrl: './residential.component.css'
})
export class ResidentialComponent implements OnInit {

  constructor(
    private billingService: BillingService,
    private commonService: CommonService,
    private toast: ToastrService
  ) { }

  toastTitlePrefix = 'Water Rates Update - '

  // fg = new FormGroup({
  //   lessEqualToFive: new FormControl<string>('0.00', Validators.required),
  //   sixToTen: new FormControl<string>('0.00', Validators.required),
  //   elevenToTwenty: new FormControl<string>('0.00', Validators.required),
  //   twentyOneToThirty: new FormControl<string>('0.00', Validators.required),
  //   thirtyOneToFourty: new FormControl<string>('0.00', Validators.required),
  //   fourtyOneToFifty: new FormControl<string>('0.00', Validators.required),
  //   fiftyOneToSeventy: new FormControl<string>('0.00', Validators.required),
  //   seventyOneToNinety: new FormControl<string>('0.00', Validators.required),
  //   greaterThanNinetyOne: new FormControl<string>('0.00', Validators.required),
  // })

  fg = new FormGroup({
    lessEqualToFive: new FormControl<string>('0.00', Validators.required),
    sixToTen: new FormControl<string>('0.00', Validators.required),
    elevenToTwenty: new FormControl<string>('0.00', Validators.required),
    twentyOneToThirty: new FormControl<string>('0.00', Validators.required),
    thirtyOneToFourty: new FormControl<string>('0.00', Validators.required),
    greaterThanFourtyOne: new FormControl<string>('0.00', Validators.required),
  })


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
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.INVALID_INPUT);
      return;
    }

    console.log('FORM: ', formDate);
    // this.waterRates[0].ratingValue = this.sanitizeNumber(formDate.lessEqualToFive ?? '0');
    // this.waterRates[1].ratingValue = this.sanitizeNumber(formDate.sixToTen ?? '0');
    // this.waterRates[2].ratingValue = this.sanitizeNumber(formDate.elevenToTwenty ?? '0');
    // this.waterRates[3].ratingValue = this.sanitizeNumber(formDate.twentyOneToThirty ?? '0');
    // this.waterRates[4].ratingValue = this.sanitizeNumber(formDate.thirtyOneToFourty ?? '0');
    // this.waterRates[5].ratingValue = this.sanitizeNumber(formDate.fourtyOneToFifty ?? '0');
    // this.waterRates[6].ratingValue = this.sanitizeNumber(formDate.fiftyOneToSeventy ?? '0');
    // this.waterRates[7].ratingValue = this.sanitizeNumber(formDate.seventyOneToNinety ?? '0');
    // this.waterRates[8].ratingValue = this.sanitizeNumber(formDate.greaterThanNinetyOne ?? '0');


    this.waterRates[0].ratingValue = this.sanitizeNumber(formDate.lessEqualToFive ?? '0');
    this.waterRates[1].ratingValue = this.sanitizeNumber(formDate.sixToTen ?? '0');
    this.waterRates[2].ratingValue = this.sanitizeNumber(formDate.elevenToTwenty ?? '0');
    this.waterRates[3].ratingValue = this.sanitizeNumber(formDate.twentyOneToThirty ?? '0');
    this.waterRates[4].ratingValue = this.sanitizeNumber(formDate.thirtyOneToFourty ?? '0');
    this.waterRates[5].ratingValue = this.sanitizeNumber(formDate.greaterThanFourtyOne ?? '0');

    console.table(this.waterRates);

    this.commonService.showSpinner(true);
    await this.billingService.updateWaterRatesResidential(this.waterRates).then((response) => {
      const resp = response.result as IWaterRates[];
      this.oldWaterRates = structuredClone(resp);
      this.waterRates = structuredClone(resp);
      this.updateForm();
      // alert('Water rates successfully updated.');
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
    await this.billingService.getActiveWaterRatesResidential().then((response) => {

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
    //   lessEqualToFive: this.formatNumber(this.waterRates[0].ratingValue),
    //   sixToTen: this.formatNumber(this.waterRates[1].ratingValue),
    //   elevenToTwenty: this.formatNumber(this.waterRates[2].ratingValue),
    //   twentyOneToThirty: this.formatNumber(this.waterRates[3].ratingValue),
    //   thirtyOneToFourty: this.formatNumber(this.waterRates[4].ratingValue),
    //   fourtyOneToFifty: this.formatNumber(this.waterRates[5].ratingValue),
    //   fiftyOneToSeventy: this.formatNumber(this.waterRates[6].ratingValue),
    //   seventyOneToNinety: this.formatNumber(this.waterRates[7].ratingValue),
    //   greaterThanNinetyOne: this.formatNumber(this.waterRates[8].ratingValue),
    // });

    this.fg.patchValue({
      lessEqualToFive: this.formatNumber(this.waterRates[0].ratingValue),
      sixToTen: this.formatNumber(this.waterRates[1].ratingValue),
      elevenToTwenty: this.formatNumber(this.waterRates[2].ratingValue),
      twentyOneToThirty: this.formatNumber(this.waterRates[3].ratingValue),
      thirtyOneToFourty: this.formatNumber(this.waterRates[4].ratingValue),
      greaterThanFourtyOne: this.formatNumber(this.waterRates[5].ratingValue),
    });

  }

  handleInputOnBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = this.formatNumber(this.sanitizeNumber(inputElement.value));
  }

  handleReset(): void {
    // this.fg.reset({
    //   lessEqualToFive: this.formatNumber(this.oldWaterRates[0].ratingValue),
    //   sixToTen: this.formatNumber(this.oldWaterRates[1].ratingValue),
    //   elevenToTwenty: this.formatNumber(this.oldWaterRates[2].ratingValue),
    //   twentyOneToThirty: this.formatNumber(this.oldWaterRates[3].ratingValue),
    //   thirtyOneToFourty: this.formatNumber(this.oldWaterRates[4].ratingValue),
    //   fourtyOneToFifty: this.formatNumber(this.oldWaterRates[5].ratingValue),
    //   fiftyOneToSeventy: this.formatNumber(this.oldWaterRates[6].ratingValue),
    //   seventyOneToNinety: this.formatNumber(this.oldWaterRates[7].ratingValue),
    //   greaterThanNinetyOne: this.formatNumber(this.oldWaterRates[8].ratingValue),
    // })

    this.fg.reset({
      lessEqualToFive: this.formatNumber(this.oldWaterRates[0].ratingValue),
      sixToTen: this.formatNumber(this.oldWaterRates[1].ratingValue),
      elevenToTwenty: this.formatNumber(this.oldWaterRates[2].ratingValue),
      twentyOneToThirty: this.formatNumber(this.oldWaterRates[3].ratingValue),
      thirtyOneToFourty: this.formatNumber(this.oldWaterRates[4].ratingValue),
      greaterThanFourtyOne: this.formatNumber(this.oldWaterRates[5].ratingValue),
    })

  }

}
