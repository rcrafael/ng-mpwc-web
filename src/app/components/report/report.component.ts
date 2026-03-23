import { Component } from '@angular/core';
import { ReportCardsComponent } from "./report-cards/report-cards.component";
import { IReportNav } from '../../models/interfaces/IReports';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReportCardsComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  reportNav: IReportNav[] = [
    {
      title: 'Collection',
      icon: '/assets/icons/payments.svg',
      route: '/reports/collection'
    },
    {
      title: 'Billing',
      icon: '/assets/icons/newspaper.svg',
      route: '/reports/billing'
    },
    {
      title: 'Customer',
      icon: '/assets/icons/group.svg',
      route: '/reports/customer'
    },
    {
      title: 'Parts',
      icon: '/assets/icons/handyman.svg',
      route: '/reports/parts'
    },
  ]


  handleReportOnClick(url: string) {
    console.log('navigating to: ', this.route + url);
    this.router.navigate([url],);
  }

}
