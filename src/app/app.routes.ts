import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthLoginComponent } from './components/auth/auth-login/auth-login.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
     { path: '', component: DashboardComponent, canActivate: [authGuard] },
     { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
     { path:'login', component:AuthLoginComponent}
];
