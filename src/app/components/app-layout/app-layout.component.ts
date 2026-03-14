import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../nav/sidebar/sidebar.component";
import { SpinnerComponent } from "../common/spinner/spinner.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    SpinnerComponent
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobile = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkScreenSize();

    // Auto-collapse sidebar on navigation if on mobile
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      if (this.isMobile) {
        this.isSidebarCollapsed = true;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 1024; // Tailwind lg breakpoint
    if (this.isMobile) {
      // Default to collapsed on mobile if not already set (optional, or just enforce)
      // We might want to keep current state if user toggled it, but basic requirement says "collapsed by default"
      // Let's only force collapse on initial load or transition to mobile? 
      // For now, let's just update isMobile. Logic in template/toggle handles the rest.
      // Actually user said "collapsed by default for mobile".
      // If we transition from desktop -> mobile, we should probably collapse.
      if (!this.isSidebarCollapsed) {
        this.isSidebarCollapsed = true;
      }
    } else {
      // Desktop: Enforce expanded
      this.isSidebarCollapsed = false;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }
}
