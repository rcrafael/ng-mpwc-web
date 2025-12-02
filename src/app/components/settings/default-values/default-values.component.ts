import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DefaultValuesService } from '../../../services/default-values.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Utils } from '../../../common/util';
import { IDefaultValues } from '../../../models/interfaces/IDefaultValues';

@Component({
  selector: 'app-default-values',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './default-values.component.html',
  styleUrl: './default-values.component.css'
})
export class DefaultValuesComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private defaultValuesService: DefaultValuesService,
    private toast: ToastrService

  ) { }

  toastTitlePrefix = 'Default Values - ';

  fg = new FormGroup({
    maintenanceFee: new FormControl<string>('0.00', Validators.required),
    reconnectionFee: new FormControl<string>('0.00', Validators.required),
    penaltyPercentage: new FormControl<string>('0.00', Validators.required),
  })

  oldDefaultValues: IDefaultValues = {
    id: 0,
    maintenanceFee: 0,
    reconnectionFee: 0,
    penaltyPercentage: 0
  }

  formatNumber = Utils.formatNumber
  sanitizeAmount = Utils.sanitizeAmount


  async ngOnInit(): Promise<void> {
    try {
      this.commonService.showSpinner(true);
      const resp = (await this.defaultValuesService.getDefaultValues());
      
      if(resp.result) {
        const data = resp.result as IDefaultValues;
        this.defaultValuesService.setDefaultValuesToSession(data);
        this.fg.patchValue({
          maintenanceFee: this.formatNumber(this.sanitizeAmount(data.maintenanceFee.toString())),
          reconnectionFee: this.formatNumber(this.sanitizeAmount(data.reconnectionFee.toString())),
          penaltyPercentage: this.formatNumber(this.sanitizeAmount(data.penaltyPercentage.toString())),
        })

        this.oldDefaultValues = {...data};
        console.log('OLD DEFAULT VALUES: ', this.oldDefaultValues);
      }

    } catch (error) {
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${error}`, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.error('ERROR FETCHING DEFAULT VALUES: ',error);
    } finally {
      this.commonService.showSpinner(false);
    }
  }

  async handleSubmit(): Promise<void> {
    try {
      
      const formValues = this.fg.value;
      if(!this.fg.valid) {
        this.toast.warning(ToastrMessage.INVALID_INPUT, this.toastTitlePrefix + ToastrTitle.INVALID_INPUT);
        return;
      }

      this.commonService.showSpinner(true);
      const dataFromSession: IDefaultValues = this.defaultValuesService.getDefaultValuesFromSession() as IDefaultValues;
      
      const params: IDefaultValues = {
        id: dataFromSession.id || 1, //always 1 OR the id in the database
        maintenanceFee: this.sanitizeAmount(formValues.maintenanceFee ?? '0.00'),
        reconnectionFee: this.sanitizeAmount(formValues.reconnectionFee ?? '0.00'),
        penaltyPercentage: this.sanitizeAmount(formValues.penaltyPercentage ?? '0.00'),
      }

      await this.defaultValuesService.updateDefaultValues(params);
      this.defaultValuesService.setDefaultValuesToSession(params); //update the sessionStorage
      this.oldDefaultValues = {...params}; //update the old default values for reset function
      this.toast.success(ToastrMessage.SUCCESS_UPDATE, this.toastTitlePrefix + ToastrTitle.SUCCESS);

    } catch (error) {
      this.toast.error(`${ToastrMessage.ERROR_UPDATE}: ${error}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
    }
  }

  handleReset(): void {
    this.fg.reset({
      maintenanceFee: this.formatNumber(this.sanitizeAmount(this.oldDefaultValues.maintenanceFee.toString())),
      reconnectionFee: this.formatNumber(this.sanitizeAmount(this.oldDefaultValues.reconnectionFee.toString())),
      penaltyPercentage: this.formatNumber(this.sanitizeAmount(this.oldDefaultValues.penaltyPercentage.toString())),
    });
  }
  //add format number in onBlur
  handleOnBlur(e: any, frmCtrlName: string): void {
    const value = e.target.value;
    const field = this.fg.get(frmCtrlName) as FormControl<string>;
    field.setValue(this.formatNumber(this.sanitizeAmount(value)));
  }

}
