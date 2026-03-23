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
  ) { }

  menus: ISideBarMenu[] = [
    {
      id: 1,
      name: 'dashboard',
      url: '/dashboard',
      label: 'Dashboard',
      icon: '/assets/icons/chart-pie.svg',
      visible: true,
    },
    {
      id: 2,
      name: 'customers',
      url: '/customer',
      label: 'Customer',
      icon: '/assets/icons/group.svg',
      visible: true,
    },
    {
      id: 3,
      name: 'or-payment',
      url: '/payment/official-receipt',
      label: 'OR Payment',
      icon: '/assets/icons/payments.svg',
      visible: true,
    },
    {
      id: 4,
      name: 'other-payment',
      url: '/payment/other-receipt',
      label: 'Other Payment',
      icon: '/assets/icons/bank-notes.svg',
      visible: true,
    },
    {
      id: 5,
      name: 'billing',
      url: '/billing',
      label: 'Billing',
      icon: '/assets/icons/newspaper.svg',
      visible: true,
    },
    {
      id: 6,
      name: 'other-transaction',
      url: '/other-transaction',
      label: 'Others',
      icon: '/assets/icons/dynamic-feed.svg',
      visible: true,
    },
    {
      id: 7,
      name: 'reports',
      url: '/reports',
      label: 'Reports',
      icon: '/assets/icons/reports.svg',
      visible: true,
    },
    {
      id: 8,
      name: 'settings',
      url: '/settings',
      label: 'Settings',
      icon: '/assets/icons/settings-gear.svg',
      visible: true,
    }
  ]

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }


}
