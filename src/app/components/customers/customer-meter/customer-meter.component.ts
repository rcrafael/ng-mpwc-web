import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomerService } from '../../../services/customer.service';
import { CommonService } from '../../../services/common.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { IMeterDetails } from '../../../models/interfaces/IMeter';
import { Utils } from '../../../common/util';

@Component({
  selector: 'app-customer-meter',
  standalone: true,
  imports: [
      MatTableModule,
      MatExpansionModule,
      MatIcon,
    ],
  templateUrl: './customer-meter.component.html',
  styleUrl: './customer-meter.component.css'
})
export class CustomerMeterComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private customerService: CustomerService
  ) {}

  @Input() customerId: string = '';

  tableCols: string[] = ['Meter No', 'Alias', 'Previous', 'Present', 'Status'];
  dataSource: MatTableDataSource<IMeterDetails> = new MatTableDataSource<IMeterDetails>();

  getStatus = Utils.getStatusName;

  ngOnInit(): void {
      this.loadData();
  }

  loadData(): void {
    this.customerService.getMeterNoByCustomerId(this.customerId).then((response: IAPIResponse) => {
      const data: IMeterDetails[] = response.result as IMeterDetails[];
      this.dataSource = new MatTableDataSource<IMeterDetails>(data);;
    })
  }

}
