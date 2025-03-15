import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { IOfficialReceiptDetail } from '../../../../models/interfaces/IOfficialReceipt';
import { BrowseCustomersComponent } from '../../../modals/browse-customers/browse-customers.component';
import { BrowseMeterNoComponent } from '../../../modals/browse-meter-no/browse-meter-no.component';
import { AddDetailsModalComponent } from './add-details-modal/add-details-modal.component';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../../services/customer.service';


@Component({
  selector: 'app-payment-official-receipt-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatTableModule
  ],
  templateUrl: './payment-official-receipt-create.component.html',
  styleUrl: './payment-official-receipt-create.component.css',
})
export class PaymentOfficialReceiptCreateComponent implements OnInit {
  
  constructor(
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private customerService: CustomerService

  ) {}

  branchCodes: IBranchCode[] = [
    {
      id: 1,
      name: 'Patubig'
    },
    {
      id: 2,
      name: 'Mahabang Parang'
    },
    {
      id: 3,
      name:'Santa Rosa'
    },
    {
      id: 4,
      name: 'Duhat'
    }
  ];

  dataSource!: MatTableDataSource<IOfficialReceiptDetail>;
  tableColumns: string[] = [
    'Reading No',
    'Mobile Reading No',
    'Reading Amount Paid',
    'Parts',
    'Maintenance Fee',
    'Septage Fee',
    'Membership Fee',
    'Tapping',
    'Calibration',
    'Reconnection',
    'Sub Receivable',
    'Penalty',
    'Other Collection',
    'Other Description',
    'Senior Discount',
    'Remarks',
    'Total Amount'
  ];

  currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-PH');
  selectedCustomerInfo!: any;
  orDetails: IOfficialReceiptDetail[] = []; //



  public fg = new FormGroup({
    accountNo: new FormControl<string>('', Validators.required),
    customerName: new FormControl<string>('', Validators.required),
    branchCode: new FormControl<number>(0),
    address: new FormControl<string>('', Validators.required),
    orNo: new FormControl<string>('', Validators.required),
    orDate: new FormControl<String>(this.currentDate),
    entryDate: new FormControl<String>(this.currentDate),
    createdBy: new FormControl<String>(''),
    shareCapital: new FormControl<number>(0),
    cbu: new FormControl<number>(0),
    savings: new FormControl<number>(0),
    totalBillingAmount: new FormControl<number>(0),
    totalShareAmount: new FormControl<number>(0),
    shareAsPayment: new FormControl<number>(0),
    seniorDiscount: new FormControl<number>(0),
    totalAmountToPay: new FormControl<number>(0),
    checkNo: new FormControl<string>('', Validators.required),
    checkBankName: new FormControl<string>('', Validators.required),
    checkDate: new FormControl<string>(this.currentDate),
  })

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      const customerId = params.get('customerId');
      if(customerId !== undefined && customerId !== null && customerId !== '') {
        this.customerService.getCustomerById(customerId).then((response) => {
          
          if(response.result) {
            this.selectedCustomerInfo = response.result;
            this.fg.patchValue({
              accountNo: this.selectedCustomerInfo.accountNo,
              customerName: `${this.selectedCustomerInfo.lastName}, ${this.selectedCustomerInfo.firstName} ${this.selectedCustomerInfo.middleName}` ,
              branchCode: this.selectedCustomerInfo.branchCode,
              address: this.selectedCustomerInfo.address
            })
          }
          
        });
      }
    })
  }

  onSubmit = () => {
  
  }

  openDetailFormDialog(): void {
    const dialogRef = this.dialog.open(AddDetailsModalComponent, {
      data: {customerId: this.selectedCustomerInfo.id},
      width: '90%',
      height: '90%'
    });


    dialogRef.afterClosed().subscribe(data => {
      if(data!== null) {
        this.orDetails = data;
        this.dataSource = new MatTableDataSource<IOfficialReceiptDetail>(this.orDetails);
      }
    })
  }

  openCustomerDialog(): void {
    const dialogRef = this.dialog.open(BrowseCustomersComponent, {
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== null) {
        this.selectedCustomerInfo = data
      }
    })
  }

}
  