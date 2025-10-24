import { Component } from '@angular/core';
import { ISideBarMenu } from '../../models/interfaces/ICommon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  //this component is no longer used
  //please check components/nav/sidebar

  constructor(
    private router: Router
  ) {}

  menus: ISideBarMenu[] = [
    {
      id: 1,
      name: 'dashboard',
      url: '/dashboard',
      label:'Dashboard',
      icon: '/assets/icons/chart-pie.svg'
    },
    {
      id: 2,
      name: 'customers',
      url: '/customer',
      label:'Customer',
      icon: '/assets/icons/group.svg'
    },
    {
      id: 3,
      name: 'or-payment',
      url: '/payment/official-receipt',
      label:'OR Payment',
      icon: '/assets/icons/payments.svg'
    },
    {
      id: 4,
      name: 'other-payment',
      url: '/payment/other-receipt',
      label:'Other Payment',
      icon: '/assets/icons/bank-notes.svg'
    },
    {
      id: 5,
      name: 'billing',
      url: '/billing',
      label:'Billing',
      icon: '/assets/icons/newspaper.svg'
    },
    {
      id: 6,
      name:'other-transaction',
      url: '/other-transaction',
      label:'Others',
      icon: '/assets/icons/dynamic-feed.svg'
    },
    {
      id: 7,
      name:'reports',
      url: '/reports',
      label:'Reports',
      icon: '/assets/icons/reports.svg'
    },
    {
      id: 8,
      name:'settings',
      url: '/settings',
      label:'Settings',
      icon: '/assets/icons/settings-gear.svg'
    }
  ]

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }


}
