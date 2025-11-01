import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../../../services/billing.service';
import { CommonService } from '../../../../services/common.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISeptageFeeRates } from '../../../../models/interfaces/ISeptageFeeRates';
import { Utils } from '../../../../common/util';
import { SeptageFeeService } from '../../../../services/septage-fee.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';

@Component({
  selector: 'app-rate-septage-fees',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './septage-fees.component.html',
  styleUrl: './septage-fees.component.css'
})
export class SeptageFeesComponent implements OnInit {
constructor(
    private septageFeeService: SeptageFeeService,
    private commonService: CommonService,
    private toast: ToastrService
  ) {}

  toastTitlePrefix = 'Septage Fee Update - ';

  fg = new FormGroup({
    minimumZeroTo10: new FormControl<string>('0.00', Validators.required),
    m3To11: new FormControl<string>('0.00', Validators.required),
    m3To12: new FormControl<string>('0.00', Validators.required),
    m3To13: new FormControl<string>('0.00', Validators.required),
    m3To14: new FormControl<string>('0.00', Validators.required),
    m3To15: new FormControl<string>('0.00', Validators.required),
    m3To16: new FormControl<string>('0.00', Validators.required),
    m3To17: new FormControl<string>('0.00', Validators.required),
    m3To18: new FormControl<string>('0.00', Validators.required),
    m3To19: new FormControl<string>('0.00', Validators.required),
    m3To20: new FormControl<string>('0.00', Validators.required),
    m3To21: new FormControl<string>('0.00', Validators.required),
    m3To22: new FormControl<string>('0.00', Validators.required),
    m3To23: new FormControl<string>('0.00', Validators.required),
    m3To24: new FormControl<string>('0.00', Validators.required),
    m3To25: new FormControl<string>('0.00', Validators.required),
    m3To26: new FormControl<string>('0.00', Validators.required),
    m3To27: new FormControl<string>('0.00', Validators.required),
    m3To28: new FormControl<string>('0.00', Validators.required),
    m3To29: new FormControl<string>('0.00', Validators.required),
    m3To30: new FormControl<string>('0.00', Validators.required),
  })

  septageFees!: ISeptageFeeRates;
  oldSeptageFees!: ISeptageFeeRates;

  sanitizeNumber = Utils.sanitizeAmount;
  formatNumber = Utils.formatNumber;

  async ngOnInit(): Promise<void> {
    await this.loadRates();
  }

  async handleSubmit(): Promise<void> {
    const formData = this.fg.value;
    console.log('form', this.fg);
    if(!this.fg.valid) {
      this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.INVALID_INPUT);
      return;
    }

    console.log('FORM: ', formData);

    (Object.keys(formData) as Array<keyof ISeptageFeeRates>).forEach((key) => {
      this.septageFees[key] = this.sanitizeNumber(formData[key] as any ?? '0');
    });


    console.table(this.septageFees); 

    this.commonService.showSpinner(true);
    await this.septageFeeService.updateSeptageFeeRates(this.septageFees).then((response) => {
      const resp = response.result as ISeptageFeeRates;
      this.oldSeptageFees = structuredClone(resp);
      this.septageFees = structuredClone(resp);
      this.updateForm();
      this.toast.success(ToastrMessage.SUCCESS_UPDATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);
    })
    .catch((error: Error) => {
      console.log(error);
      this.toast.error(`${ToastrMessage.ERROR_UPDATE}: ${error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    })
    .finally(() => {
      this.commonService.showSpinner(false);
    });

  }

  async loadRates(): Promise<void> {
    this.commonService.showSpinner(true);
    this.septageFeeService.getSeptageFees().then((response) => {
      
      const resp = response.result as ISeptageFeeRates;
      this.oldSeptageFees = structuredClone(resp);
      this.septageFees = structuredClone(resp);
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
    this.fg.patchValue({
        minimumZeroTo10: this.formatNumber(this.septageFees.minimumZeroTo10),
        m3To11: this.formatNumber(this.septageFees.m3To11),
        m3To12: this.formatNumber(this.septageFees.m3To12),
        m3To13: this.formatNumber(this.septageFees.m3To13),
        m3To14: this.formatNumber(this.septageFees.m3To14),
        m3To15: this.formatNumber(this.septageFees.m3To15),
        m3To16: this.formatNumber(this.septageFees.m3To16),
        m3To17: this.formatNumber(this.septageFees.m3To17),
        m3To18: this.formatNumber(this.septageFees.m3To18),
        m3To19: this.formatNumber(this.septageFees.m3To19),
        m3To20: this.formatNumber(this.septageFees.m3To20),
        m3To21: this.formatNumber(this.septageFees.m3To21),
        m3To22: this.formatNumber(this.septageFees.m3To22),
        m3To23: this.formatNumber(this.septageFees.m3To23),
        m3To24: this.formatNumber(this.septageFees.m3To24),
        m3To25: this.formatNumber(this.septageFees.m3To25),
        m3To26: this.formatNumber(this.septageFees.m3To26),
        m3To27: this.formatNumber(this.septageFees.m3To27),
        m3To28: this.formatNumber(this.septageFees.m3To28),
        m3To29: this.formatNumber(this.septageFees.m3To29),
        m3To30: this.formatNumber(this.septageFees.m3To30),
      });
  }

  handleInputOnBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = this.formatNumber(this.sanitizeNumber(inputElement.value));
  }

  handleReset(): void {
    this.fg.reset({
      minimumZeroTo10: this.formatNumber(this.oldSeptageFees.minimumZeroTo10),
      m3To11: this.formatNumber(this.oldSeptageFees.m3To11),
      m3To12: this.formatNumber(this.oldSeptageFees.m3To12),
      m3To13: this.formatNumber(this.oldSeptageFees.m3To13),
      m3To14: this.formatNumber(this.oldSeptageFees.m3To14),
      m3To15: this.formatNumber(this.oldSeptageFees.m3To15),
      m3To16: this.formatNumber(this.oldSeptageFees.m3To16),
      m3To17: this.formatNumber(this.oldSeptageFees.m3To17),
      m3To18: this.formatNumber(this.oldSeptageFees.m3To18),
      m3To19: this.formatNumber(this.oldSeptageFees.m3To19),
      m3To20: this.formatNumber(this.oldSeptageFees.m3To20),
      m3To21: this.formatNumber(this.oldSeptageFees.m3To21),
      m3To22: this.formatNumber(this.oldSeptageFees.m3To22),
      m3To23: this.formatNumber(this.oldSeptageFees.m3To23),
      m3To24: this.formatNumber(this.oldSeptageFees.m3To24),
      m3To25: this.formatNumber(this.oldSeptageFees.m3To25),
      m3To26: this.formatNumber(this.oldSeptageFees.m3To26),
      m3To27: this.formatNumber(this.oldSeptageFees.m3To27),
      m3To28: this.formatNumber(this.oldSeptageFees.m3To28),
      m3To29: this.formatNumber(this.oldSeptageFees.m3To29),
      m3To30: this.formatNumber(this.oldSeptageFees.m3To30),
    });
  }

}
