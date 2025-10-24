import { Component } from '@angular/core';
import { ISideBarMenu } from '../../../models/interfaces/ICommon';
import { naviMenus } from '../../../common/enum';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  logo: string = '/assets/img/mpwc-logo.svg';

  openSubmenus: { [key: string]: boolean } = {};

  toggleSubmenu(menuLabel: string): void {
    this.openSubmenus[menuLabel] = !this.openSubmenus[menuLabel];
  }

  menuItems: ISideBarMenu[] = naviMenus;

}
