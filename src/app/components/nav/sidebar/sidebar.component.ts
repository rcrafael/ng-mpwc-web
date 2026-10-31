import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISideBarMenu } from '../../../models/interfaces/ICommon';
import { naviMenus } from '../../../common/enum';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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

  @Input() collapsed: boolean = false;
  @Output() toggleCollapsed = new EventEmitter<void>();

  logo: string = '/assets/img/mpwc-logo.svg';

  openSubmenus: { [key: string]: boolean } = {};
  showProfileMenu: boolean = false;
  user: { name: string; avatar: string } = {
    name: '',
    avatar: '/assets/icons/account_circle.svg'
  };

  constructor(private authService: AuthService, private router: Router) {
    this.user.name = this.authService.getUserName() || 'Account';
  }

  activePopupItem: ISideBarMenu | null = null;
  popupTop: number = 0;

  toggleSubmenu(item: ISideBarMenu, event?: MouseEvent): void {
    if (this.collapsed) {
      if (this.activePopupItem === item) {
        this.closePopup();
      } else {
        this.activePopupItem = item;
        if (event) {
          const target = event.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();
          this.popupTop = rect.top;
        }
      }
    } else {
      this.openSubmenus[item.label] = !this.openSubmenus[item.label];
    }
  }

  closePopup(): void {
    this.activePopupItem = null;
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    // Clear any other stored user data if necessary
    this.router.navigate(['/auth/login']);
  }

  get menuItems(): ISideBarMenu[] {
    return naviMenus
      .filter(item => {
        if (!item.visible) return false;
        if (item.pageCode && !this.authService.hasPageAccess(item.pageCode)) {
          return false;
        }
        return true;
      })
      .map(item => {
        if (!item.subItems) return item;
        const filteredSubs = item.subItems.filter(sub => {
          if (sub.pageCode && !this.authService.hasPageAccess(sub.pageCode)) {
            return false;
          }
          return true;
        });
        return {
          ...item,
          subItems: filteredSubs
        };
      })
      .filter(item => {
        if (item.subItems && item.subItems.length === 0) {
          return false;
        }
        return true;
      });
  }

}
