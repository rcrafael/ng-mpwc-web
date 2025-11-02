import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardCardComponent } from "./dashboard-card/dashboard-card.component";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartType } from 'chart.js';

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
    private toast: ToastrService
  ) {

  }

  totalCustomers: string = '1,234';
  totalBillings: string = '56,789.00';


   barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
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

}

