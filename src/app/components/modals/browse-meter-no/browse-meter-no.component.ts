import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IMeterDetails } from '../../../models/interfaces/IMeter';
import { CustomerService } from '../../../services/customer.service';
import { Utils } from '../../../common/util';

@Component({
  selector: 'app-browse-meter-no',
  standalone: true,
  imports: [
    MatTableModule,
    MatDialogModule,
  ],
  templateUrl: './browse-meter-no.component.html',
  styleUrl: './browse-meter-no.component.css'
})
export class BrowseMeterNoComponent implements OnInit {

  constructor(
    private customerService: CustomerService
  ) {}

  readonly dialogRef = inject(MatDialogRef<BrowseMeterNoComponent>);
  readonly customerInfo:any =  inject<MatDialog>(MAT_DIALOG_DATA)
  dialog = inject(MatDialog)
  
  tableCols: string[] = [
    'Meter No',
    'Alias',
    'Status',
  ]

  data!: any;
  dataSource: MatTableDataSource<IMeterDetails> = new MatTableDataSource<IMeterDetails>();

  getStatus = Utils.getStatusName;


  ngOnInit(): void {
    this.customerService.getMeterNoByCustomerId(this.customerInfo.id).then((response:any) => {
      this.data = response;
      this.dataSource = this.data.result;
    });
   
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSelectMeter(e: IMeterDetails) {
    this.dialogRef.close(e)
  }

}
