import { Component, OnInit } from '@angular/core';
import { MatDivider } from "@angular/material/divider";
import { branchCodeData } from '../../../../common/enum';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Utils } from '../../../../common/util';
import { IOtherPaymentTableDetails, IOtherPaymenttWithDetails } from '../../../../models/interfaces/IOtherPayments';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { PaymentService } from '../../../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';

@Component({
  selector: 'app-other-payment-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './other-payment-view.component.html',
  styleUrl: './other-payment-view.component.css'
})
export class OtherPaymentViewComponent implements OnInit {

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private activedRoute: ActivatedRoute,
    private toast: ToastrService
  ) { }

  toastTitlePrefix = 'Other Payment - ';

  branchCodes:IBranchCode[] = branchCodeData;
  dataSource!: MatTableDataSource<IOtherPaymentTableDetails>;
  currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-PH');
  
  tableColumns: string[] = [
    'Description',
    'Remarks',
    'Amount'
  ]

  fg = new FormGroup({
    isOutsideCollection: new FormControl<boolean>(false),
    accountNo: new FormControl<string>('', Validators.required),
    customerName: new FormControl<string | null>('', Validators.required),
    address: new FormControl<string>('', Validators.required),
    orNo: new FormControl<string>('', Validators.required),
    orDate: new FormControl<string>(this.currentDate),
    entryDate: new FormControl<string>(this.currentDate),
    createdBy: new FormControl<string>(''),
    totalBillingAmount: new FormControl<string>('0.00'),
    totalAmountPay: new FormControl<string>('0.00'),
    checkNo: new FormControl<string>(''),
    checkBank: new FormControl<string>(''),
    checkDate: new FormControl<string | null>(null),
  });

  buildCustomerName = Utils.buildCustomerName;
  sanitizeAmount = Utils.sanitizeAmount;
  numberFormat = Utils.formatNumber;

  async ngOnInit(): Promise<void> {
    
    this.activedRoute.paramMap.subscribe(async (params): Promise<void> => {

      const id = params.get('orId');
      if(id) {
        await this.paymentService.getOtherPaymentWithCustomerInfoById(id).then(async (res) => {
          const response = res as any;
          const result = response.result as IOtherPaymenttWithDetails;
          const header = result.header;
          const details = result.details;

          const customerName = header.customerId ? this.buildCustomerName(header.customer.firstName, header.customer.middleName, header.customer.lastName) : header.outsideCustomerName;
          const address = header.customerId ? header.customer.address : header.outsideCustomerAddress;

          let username = '';
          try {
            await this.authService.getUsernameById(header.createdBy).then((res) => {
              username = res.result as any;
            })
          } catch(err) {
            console.error('ERROR FETCHING USERNAME BY ID: ', err);
            this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}(Username): ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
          }
          

          this.fg.patchValue({
            isOutsideCollection: header.isOutsideCollection ?? false,
            accountNo: header.customer.accountNo ?? '',
            customerName: customerName,
            address: address,
            orNo: header.orNo ?? '',
            orDate: header.orDate ?? this.currentDate,
            entryDate: header.entryDate ?? this.currentDate,
            createdBy: username ?? '', //change to actual user created
            totalBillingAmount: header.totalBillingAmount ? this.numberFormat(header.totalBillingAmount) : '0.00',
            totalAmountPay: header.totalAmountPay ? this.numberFormat(header.totalAmountPay) : '0.00',
            checkNo: header.checkNo ?? '',
            checkBank: header.checkBank ?? '',
            checkDate: header.checkDate ?? null,
          });

          let tableDetails: IOtherPaymentTableDetails[] = [];
          for(const d of details) {
            tableDetails.push({
              id: d.id ?? '',
              description: d.otherDescription ?? '',
              remarks: d.remarks ?? '',
              amount: d.totalAmount ? this.numberFormat(d.totalAmount) : '0.00'
            })
          }

          this.dataSource = new MatTableDataSource<IOtherPaymentTableDetails>(tableDetails);

        })
        .catch(err => {
          console.log(err);
          this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${err}`, this.toastTitlePrefix + ToastrTitle.ERROR);
        })
        .finally(() => {
          
        })
      }
    });

  }

}
