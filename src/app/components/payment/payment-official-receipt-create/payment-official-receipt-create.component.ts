import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IBranchCode } from '../../../models/interfaces/ICommon';
import { MatDivider } from '@angular/material/divider';
import { IOfficialReceiptDetail } from '../../../models/interfaces/IOfficialReceipt';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddDetailsModalComponent } from './add-details-modal/add-details-modal.component';
import { BrowseMeterNoComponent } from '../../modals/browse-meter-no/browse-meter-no.component';
import { BrowseCustomersComponent } from '../../modals/browse-customers/browse-customers.component';
import { ICustomerProfile } from '../../../models/interfaces/ICustomer';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentOfficialReceiptCreateComponent {
  
  constructor(
    private dialog: MatDialog
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

  selectedCustomerInfo!: any;
  selectedMeterNo! : any;

  public gf = new FormGroup({

  })

  onSubmit = () => {
  
  }

  openDetailFormDialog(): void {
    const dialogRef = this.dialog.open(AddDetailsModalComponent, {
      width: '90%',
      height: '90%'
    });
  }

  openMeterDialog(): void {
    const dialogRef = this.dialog.open(BrowseMeterNoComponent, {
      data: {customerId: this.selectedCustomerInfo.id},
      width: '90%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== null) {
        console.log('RECEIVED FROM DIALOG: ', data)
        this.selectedMeterNo = data
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
        console.log('RECEIVED FROM DIALOG: ', data)
        this.selectedCustomerInfo = data
      }
    })
  }

}
  
