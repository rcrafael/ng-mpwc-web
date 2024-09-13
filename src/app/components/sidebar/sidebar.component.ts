import { Component } from '@angular/core';
import { ISideBarMenu } from '../../models/interfaces/common';
import { BankNotesComponent } from '../../../assets/icons/bank-notes/bank-notes.component';
import { ChartPieComponent } from '../../../assets/icons/chart-pie/chart-pie.component';
import { NewspaperComponent } from '../../../assets/icons/newspaper/newspaper.component';
import { GroupComponent } from '../../../assets/icons/group/group.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  menus: ISideBarMenu[] = [
    {
      id: 1,
            name: 'dashboard',
            url: '/dashboard',
            label:'Dashboard',
            icon: ChartPieComponent
    },
    {
        id: 2,
        name: 'payment',
        url: '/payment/official-receipt',
        label:'Payment',
        icon: BankNotesComponent
    },
    {
        id: 3,
        name: 'billing',
        url: '/billing',
        label:'Billing',
        icon: NewspaperComponent
    },
    {
        id: 4,
        name: 'customers',
        url: '/customer',
        label:'Customer',
        icon: GroupComponent
    },
    {
        id: 5,
        name:'settings',
        url: '/settings',
        label:'Settings',
        icon: NewspaperComponent
    }
  ]


}
