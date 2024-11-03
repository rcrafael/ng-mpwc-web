import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IOtherPaymentDetails } from '../../../../models/interfaces/IOtherPayments';
import { IBranchCode } from '../../../../models/interfaces/ICommon';
import { MatDialog } from '@angular/material/dialog';
import { AddDetailsModalComponent } from '../add-details-modal/add-details-modal.component';

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
export class OtherPaymentCreateComponent {

  constructor() {}

  dialog = inject(MatDialog)

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

  dataSource!: MatTableDataSource<IOtherPaymentDetails>;
  tableColumns: string[] = [
    'Parts',
    'Item Name',
    'Remarks',
    'Total Amount'
  ]

  public gf = new FormGroup({

  })

  onSubmit = () => {
  
  }

  openDetailFormDialog(): void {
    this.dialog.open(AddDetailsModalComponent, {
      width: '90%',
      height: '90%'
    });
  }

}
