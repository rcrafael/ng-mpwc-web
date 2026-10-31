import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { IAPIResponse } from '../../../models/interfaces/IApiResponse';
import { IUserUpdate } from '../../../models/interfaces/IUser';
import { ALL_PAGE_DEFINITIONS, IPageDefinition } from '../../../common/enum';
import { ToastrMessage, ToastrTitle } from '../../../common/constants';
import { NoDataToDisplayComponent } from '../../common/no-data-to-display/no-data-to-display.component';

@Component({
  selector: 'app-page-access',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    NoDataToDisplayComponent
  ],
  templateUrl: './page-access.component.html',
  styleUrl: './page-access.component.css'
})
export class PageAccessComponent implements OnInit {

  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private toast: ToastrService
  ) { }

  toastTitlePrefix = 'Page Access - ';

  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';

  dataSource = new MatTableDataSource<any>([]);
  tableCols: string[] = ['Username', 'Name', 'Role', 'AccessCount'];

  selectedUser: any = null;
  pageDefinitions: IPageDefinition[] = ALL_PAGE_DEFINITIONS;

  selectedPageCodes: Set<string> = new Set<string>();
  originalPageCodes: Set<string> = new Set<string>();

  isSaving: boolean = false;

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadPageDefinitions(),
      this.loadUsers()
    ]);
  }

  async loadPageDefinitions(): Promise<void> {
    try {
      const response: IAPIResponse = await this.userService.getPageDefinitions();
      if (response && response.result && Array.isArray(response.result)) {
        this.pageDefinitions = response.result as IPageDefinition[];
      } else {
        this.pageDefinitions = ALL_PAGE_DEFINITIONS;
      }
    } catch {
      // Fallback to local definitions if backend endpoint fails
      this.pageDefinitions = ALL_PAGE_DEFINITIONS;
    }
  }

  async loadUsers(): Promise<void> {
    try {
      this.commonService.showSpinner(true);
      const response: IAPIResponse = await this.userService.getAllUser();
      if (response && response.result) {
        this.users = (response.result as any[]) || [];
        this.filteredUsers = [...this.users];
        this.dataSource.data = this.filteredUsers;

        // Auto-select first user if available and no user currently selected
        if (this.users.length > 0 && !this.selectedUser) {
          this.selectUser(this.users[0]);
        } else if (this.selectedUser) {
          // Re-sync selected user from the freshly fetched list
          const updated = this.users.find(u => u.id === this.selectedUser.id);
          if (updated) {
            this.selectUser(updated);
          }
        }
      }
    } catch (error: any) {
      this.toast.error(`${ToastrMessage.ERROR_FETCHING_DATA}: ${error?.message || error}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.commonService.showSpinner(false);
    }
  }

  onSearchChange(): void {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(u => {
        const username = (u.username || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const fullName = `${u.fname || ''} ${u.lname || ''}`.toLowerCase();
        const role = this.getRoleName(u).toLowerCase();
        return username.includes(term) || email.includes(term) || fullName.includes(term) || role.includes(term);
      });
    }
    this.dataSource.data = this.filteredUsers;
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    const initialPages: string[] = Array.isArray(user.pageAccess) ? user.pageAccess : [];
    this.selectedPageCodes = new Set<string>(initialPages);
    this.originalPageCodes = new Set<string>(initialPages);
  }

  getRoleName(user: any): string {
    if (!user) return '';
    if (typeof user.role === 'string') return user.role;
    if (user.role && typeof user.role === 'object') {
      if (user.role.role) return user.role.role;
      if (Array.isArray(user.role) && user.role.length > 0) return user.role[0];
    }
    return 'User';
  }

  isUserSuperAdmin(user: any): boolean {
    return this.getRoleName(user).toLowerCase() === 'superadmin';
  }

  getUserPageCount(user: any): number {
    if (this.isUserSuperAdmin(user)) {
      return this.pageDefinitions.length;
    }
    return Array.isArray(user?.pageAccess) ? user.pageAccess.length : 0;
  }

  isPageSelected(code: string): boolean {
    if (this.isUserSuperAdmin(this.selectedUser)) {
      return true;
    }
    return this.selectedPageCodes.has(code);
  }

  togglePage(code: string): void {
    if (this.isUserSuperAdmin(this.selectedUser)) {
      return;
    }
    if (this.selectedPageCodes.has(code)) {
      this.selectedPageCodes.delete(code);
    } else {
      this.selectedPageCodes.add(code);
    }
  }

  selectAll(): void {
    if (this.isUserSuperAdmin(this.selectedUser)) {
      return;
    }
    this.pageDefinitions.forEach(p => this.selectedPageCodes.add(p.code));
  }

  deselectAll(): void {
    if (this.isUserSuperAdmin(this.selectedUser)) {
      return;
    }
    this.selectedPageCodes.clear();
  }

  resetAccess(): void {
    if (this.isUserSuperAdmin(this.selectedUser)) {
      return;
    }
    this.selectedPageCodes = new Set<string>(this.originalPageCodes);
  }

  get hasChanges(): boolean {
    if (!this.selectedUser || this.isUserSuperAdmin(this.selectedUser)) {
      return false;
    }
    if (this.selectedPageCodes.size !== this.originalPageCodes.size) {
      return true;
    }
    for (const code of this.selectedPageCodes) {
      if (!this.originalPageCodes.has(code)) {
        return true;
      }
    }
    return false;
  }

  async saveAccess(): Promise<void> {
    if (!this.selectedUser || this.isUserSuperAdmin(this.selectedUser)) {
      return;
    }

    try {
      this.isSaving = true;
      this.commonService.showSpinner(true);

      const roleId = this.selectedUser.role?.id || this.selectedUser.roleId || '';
      const payload: IUserUpdate = {
        id: this.selectedUser.id,
        username: this.selectedUser.username,
        email: this.selectedUser.email,
        fname: this.selectedUser.fname,
        lname: this.selectedUser.lname,
        mname: this.selectedUser.mname || '',
        roleId: roleId,
        pageAccess: Array.from(this.selectedPageCodes)
      };

      const resp: IAPIResponse = await this.userService.updateUser(payload);
      this.toast.success('Page access permissions updated successfully.', this.toastTitlePrefix + ToastrTitle.SUCCESS);

      // Update local state
      this.selectedUser.pageAccess = Array.from(this.selectedPageCodes);
      this.originalPageCodes = new Set<string>(this.selectedPageCodes);

      // Update in user list table as well
      const inList = this.users.find(u => u.id === this.selectedUser.id);
      if (inList) {
        inList.pageAccess = Array.from(this.selectedPageCodes);
      }
    } catch (error: any) {
      this.toast.error(`${ToastrMessage.ERROR_UPDATE}: ${error?.message || error}`, this.toastTitlePrefix + ToastrTitle.ERROR);
    } finally {
      this.isSaving = false;
      this.commonService.showSpinner(false);
    }
  }

}
