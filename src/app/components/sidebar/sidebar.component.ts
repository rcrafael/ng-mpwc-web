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
        name: 'payment',
        url: '/payment/official-receipt',
        label:'Payment',
        icon: '/assets/icons/bank-notes.svg'
    },
    {
        id: 3,
        name: 'billing',
        url: '/billing',
        label:'Billing',
        icon: '/assets/icons/newspaper.svg'
    },
    {
        id: 4,
        name: 'customers',
        url: '/customer',
        label:'Customer',
        icon: '/assets/icons/group.svg'
    },
    {
        id: 5,
        name:'settings',
        url: '/settings',
        label:'Settings',
        icon: '/assets/icons/newspaper.svg'
    }
  ]

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }


}
