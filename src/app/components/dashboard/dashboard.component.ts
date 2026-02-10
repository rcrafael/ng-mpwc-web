import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardCardComponent } from "./dashboard-card/dashboard-card.component";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartType } from 'chart.js';
import 'chart.js/auto';
import { DefaultValuesService } from '../../services/default-values.service';
import { CommonService } from '../../services/common.service';
import { ToastrMessage, ToastrTitle } from '../../common/constants';
import { IDefaultValues } from '../../models/interfaces/IDefaultValues';
import { ReportsService } from '../../services/reports.service';
import { IApiCall } from '../../models/interfaces/ICommon';
import { IDashboardDataCards } from '../../models/interfaces/ireports';
import { Utils } from '../../common/util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardCardComponent,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private defaultValuesService: DefaultValuesService,
    private toast: ToastrService,
    private commonService: CommonService,
    private reportsService: ReportsService
  ) {

  }

  toastTitlePrefix = 'Dashboard - ';

  totalCustomers: number = 0;
  totalUnpaiadBillingAmount: number = 0;
  totalActiveMeters: number = 0;
  totalCubicMeterUsage: number = 0;
  totalOfficialReceiptAmount: number = 0;
  totalOtherCollectionAmount: number = 0;
  totalShareCapAmount: number = 0;
  totalCbuAmount: number = 0;
  // startDate = Utils.dateFormatter(new Date().toISOString().split('T')[0], 'yyyy-MM-dd');
  // endDate = Utils.dateFormatter(new Date().toISOString().split('T')[0], 'yyyy-MM-dd');

  startDate = Utils.dateFormatter('2025-01-01', 'yyyy-MM-dd');
  endDate = Utils.dateFormatter('2025-12-31', 'yyyy-MM-dd');

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: 'easeOutBounce',
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  barChartData = {
    labels: this.barChartLabels,
    datasets: [
      { data: [120, 150, 180, 90, 200, 350, 400, 500, 600, 700, 800, 900], label: '2024' },
      { data: [130, 150, 200, 100, 250, 350, 380, 550, 630, 750, 0, 0], label: '2025' },
    ]
  };
  barChartType: ChartType = 'bar';

  amountFormatter = Utils.formatCurrency;
  numberFormatter = Utils.formatNumber;

  async ngOnInit(): Promise<void> {
    console.log('DASHBOARD INITIALIZED');
    try {
      
      const apiCalls: IApiCall[] = [];
      const defaultVal = this.defaultValuesService.getDefaultValuesFromSession();
      if(!defaultVal) {
        apiCalls.push({
          name: 'getDefaultValues', 
          apiCall: this.defaultValuesService.getDefaultValues()
        });
      }

      apiCalls.push({
        name: 'getDashboardData', 
        apiCall: this.reportsService.getDashboardData(this.startDate, this.endDate)
      });

      this.commonService.showSpinner(true);

      for(let api of apiCalls) {
        console.log('API CALLED: ', api.name);
        if(api.name === 'getDefaultValues') {
          const response = await api.apiCall;
          if(response) {
            const data = response.result as IDefaultValues;
            this.defaultValuesService.setDefaultValuesToSession(data);
          }
        }

        if(api.name === 'getDashboardData') {
          const response = await api.apiCall;
          if(response) {
            const data = response.result as IDashboardDataCards;
            this.totalCustomers = data.userCount;
            this.totalUnpaiadBillingAmount = data.totalUnpaidBillingAmount;
            this.totalActiveMeters = data.activeMeterCount;
            this.totalCubicMeterUsage = data.totalCubicMeterUsage;
            this.totalOfficialReceiptAmount = data.totalOfficialReceiptAmount;
            this.totalOtherCollectionAmount = data.totalOtherCollectionAmount;
            this.totalShareCapAmount = data.totalShareCapAmount;
            this.totalCbuAmount = data.totalCbuAmount;
          }
        }
        console.log('DONE PROCESSING API: ', api.name);
      }
      

    } catch (error) {
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${error}`, this.toastTitlePrefix + ToastrTitle.ERROR);
      console.error('ERROR DATA: ',error);
    } finally {
      this.commonService.showSpinner(false);
    }

  }
}

