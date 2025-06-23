import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOtherPaymentDetails } from '../../../../models/interfaces/IOtherPayments';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { MatDialog } from '@angular/material/dialog';
import { AddDetailsModalComponent } from '../add-details-modal/add-details-modal.component';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { CustomerService } from '../../../../services/customer.service';
import { PaymentService } from '../../../../services/payment.service';
import { Utils } from '../../../../common/util';
import { IOfficialReceipt, IOfficialReceiptDetail } from '../../../../models/interfaces/IOfficialReceipt';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-other-payment-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatTableModule
  ],
  templateUrl: './other-payment-create.component.html',
  styleUrl: './other-payment-create.component.css'
})
export class OtherPaymentCreateComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private customerService: CustomerService,
    private paymentService: PaymentService
  ) {}


  dataSource!: MatTableDataSource<IOtherPaymentDetails>;
  tableColumns: string[] = [
    'Parts',
    'Item Name',
    'Remarks',
    'Total Amount'
  ]

  currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-PH');
  selectedCustomerInfo!: any;
  orDetails: IOfficialReceiptDetail[] = []; 
  isOutsideCollection: boolean = false;

  formatAmount = Utils.formatCurrency;
  sanitizeAmount = Utils.sanitizeAmount;
  numberFormat = Utils.formatNumber;
  public fg = new FormGroup({
    isOutsideCollection: new FormControl<boolean>(false),
    accountNo: new FormControl<string>({value:'', disabled:true}, Validators.required),
    customerName: new FormControl<string>({value:'', disabled:true}, Validators.required),
    address: new FormControl<string>({value:'', disabled:true}, Validators.required),
    orNo: new FormControl<string>('', Validators.required),
    orDate: new FormControl<string>(this.currentDate),
    entryDate: new FormControl<string>(this.currentDate),
    createdBy: new FormControl<string>(''),
    totalAmountPay: new FormControl<string>('0.00'),
    checkNo: new FormControl<string>(''),
    checkBank: new FormControl<string>(''),
    checkDate: new FormControl<string|null>(null),
  })

  ngOnInit(): void {
    this.paymentService.generateNewORno().then((response: IAPIResponse) => {
      if(response.result) {
        this.fg.patchValue({
          orNo: response.result.toString()
        })
      }
    })
  }

  onSubmit = () => {


    if(!this.fg.valid) {
      alert('Invalid Inputs. Please try again.');
      return;
    }
    
    const frm = this.fg.getRawValue();
    console.log('FORM: ', frm);
    return;

    const paymentDetails: IOfficialReceipt = {
      header: {
        orNo: frm.orNo!,
        customerId: this.selectedCustomerInfo.id,
        orDate: frm.orDate!,
        totalAmountPay: this.sanitizeAmount(frm.totalAmountPay ?? '0'),
        entryDate: frm.entryDate!,
        createdBy: frm.createdBy!,
        checkNo: frm.checkNo ?? '',
        checkBank: frm.checkBank ?? '', 
        checkDate: frm.checkDate ?? '',
        status: 1, //1 = complete
      },
      details: this.orDetails,
    }
    
    console.log('OR PAYLOAD: ', paymentDetails);

    this.paymentService.createORPayment(paymentDetails).then((response: IAPIResponse) => {
      alert('SUCCESS PAYMENT!');
      console.log('PAYMENT RESPONSE:', response);
    })
    .catch((error: Error) => {
      alert('EROR CREATING PAYMENT: ' + error.message);
      console.error("ERROR CREATING PAYMENT: ", error);
    })
    .finally(() => {
      
    });
  }

  openDetailFormDialog(): void {
    this.dialog.open(AddDetailsModalComponent, {
      width: '90%',
      height: '90%'
    });
  }

  onCheckChanged(e: any): void {

    if (e.target.checked) {
      console.log('CHECKED!')
      this.fg.patchValue({
        accountNo: '000000',
        customerName: '',
        address: ''
      })

      this.fg.get('customerName')?.enable();
      this.fg.get('address')?.enable();

      this.isOutsideCollection = true
    } else {
      this.fg.patchValue({
        accountNo: '',
        customerName: '',
        address: ''
      })
      this.fg.get('customerName')?.disable();
      this.fg.get('address')?.disable();
      this.isOutsideCollection = false;
    }


  }

}
