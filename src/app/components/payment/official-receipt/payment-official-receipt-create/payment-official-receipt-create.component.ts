import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { IOfficialReceiptDetail } from '../../../../models/interfaces/IOfficialReceipt';
import { AddDetailsModalComponent } from '../add-details-modal/add-details-modal.component';
import { CustomerListModalComponent } from '../../../common/search/customer-list-modal/customer-list-modal.component';

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

  constructor() {}

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
  ]

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
  ]

  dialogDetails = inject(MatDialog);
  dialogCustomer = inject(MatDialog);

  public gf = new FormGroup({

  });

  onSubmit = () => {
  
  }

  openDetailFormDialog(): void {
    this.dialogDetails.open(AddDetailsModalComponent, {
      width: '90%',
      height: '90%'
    });
  }

  openCustomerDialog(): void {
    this.dialogCustomer.open(CustomerListModalComponent, {
      width: '70%',
      height: '60%'
    });
  }

}
 
