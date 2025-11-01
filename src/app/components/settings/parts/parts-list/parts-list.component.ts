import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { IPaginator } from '../../../../models/interfaces/IPaginator';
import { PartsService } from '../../../../services/parts.service';
import { IAPIResponse } from '../../../../models/interfaces/IApiResponse';
import { Utils } from '../../../../common/util';
import { MatDialog } from '@angular/material/dialog';
import { PartCreateComponent } from '../part-create/part-create.component';
import { IPartDetails } from '../../../../models/interfaces/IParts';
import { PartsViewComponent } from '../parts-view/parts-view.component';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrMessage, ToastrTitle } from '../../../../common/constants';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    RouterModule,
    MatIcon,
    MatPaginatorModule,
    MatTooltip
  ],
  templateUrl: './parts-list.component.html',
  styleUrl: './parts-list.component.css'
})
export class PartsListComponent implements OnInit {

  constructor(
    private partService: PartsService,
    private router: Router,
    private commonService: CommonService,
    private toast: ToastrService
  ) { }

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  
  toastTitlePrefix = 'Parts List - '

  tableCols = ['Description','Measurement','Unit Cost', 'Selling Price', 'Actions'];
  dataSource = new MatTableDataSource([]);

  dialog = inject(MatDialog);

  formatAmount = Utils.formatCurrency


  async ngOnInit(): Promise<void> {
      await this.loadData(0, 50);
  }

  onCreateNewClick() {

    const dialogRef = this.dialog.open(PartCreateComponent, {
      width: '50%',
      height: '50%'
    });

    dialogRef.afterClosed().subscribe(async data => {
      
      if(data){
        let params: IPartDetails = data;
        await this.partService.createPart(params).then(async (response: IAPIResponse) => {
          if(response.result !== null){
            await this.loadData(0, 50);
          }
          this.toast.success(`${ToastrMessage.SUCCESS_CREATE} : ${params.description}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
        })
        .catch(async (error: Error) => {
          this.toast.error(`${ToastrMessage.ERROR_CREATE} : ${params.description} - ${error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
          console.error('Error creating part:', error);
        })
        .finally(async () => {
          console.log('finally');
        });
      }

    });

  }

  handleEditRecord(id: string) {
    const dialogRef = this.dialog.open(PartsViewComponent, {
      width: '50%',
      height: '55%',
      data: id
    });

    dialogRef.afterClosed().subscribe(async data => {
      if(data){
        let params: IPartDetails = data;
        params.id = id;
        await this.partService.updatePart(params).then(async (response: IAPIResponse) => {
          if(response.result !== null){
            await this.loadData(0, 50);
          }
          this.toast.success(`${ToastrMessage.SUCCESS_UPDATE} : ${params.description}`, this.toastTitlePrefix + ToastrTitle.SUCCESS);
        })
        .catch(async (error: Error) => {
          this.toast.error(`${ToastrMessage.ERROR_UPDATE} : ${params.description} - ${error.message}`, this.toastTitlePrefix + ToastrTitle.ERROR);
          console.error('Error updating part:', error);
        })
        .finally(async () => {
          console.log('finally');
        });
      }
    })
  }


  handleDeleteRecord(arg0: any) {
    throw new Error('Method not implemented.');
  }

  async handlePageChange(e: PageEvent): Promise<void> {
    this.paginator.pageIndex = e.pageIndex;
    this.paginator.pageSize = e.pageSize;
    this.paginator.length = e.length;
    await this.loadData(e.pageIndex, e.pageSize);
  }

  async loadData(pageIdx: number, pageSize: number) {
    this.commonService.showSpinner(true);
    await this.partService.getParts(pageIdx, pageSize).then((response: IAPIResponse) => {
      if(response.result !== null) {
        const result: any = response.result;
        this.dataSource.data = result.data;
        this.paginator.pageIndex = result.paginator.pageNumber;
        this.paginator.pageSize = result.paginator.pageSize;
        this.paginator.length =  result.paginator.totalRecordCount;
      }
    })
    .catch(async (error: Error) => {
      this.toast.error(ToastrMessage.ERROR_FETCHING_DATA + ': ' + error.message, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.error('Error fetching parts list:', error);
    })
    .finally(async () => {
      this.commonService.showSpinner(false);
    });

  }

}
