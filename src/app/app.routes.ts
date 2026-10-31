import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { pageAccessGuard } from './guard/page-access.guard';

export const routes: Routes = [

     {
          path: '',
          loadComponent: () => import('./components/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
          canActivate: [authGuard],
          children: [
               { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
               { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [pageAccessGuard], data: { page: 'dashboard' } },
               { path: 'customer', loadComponent: () => import('./components/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent), canActivate: [pageAccessGuard], data: { page: 'customer' } },
               { path: 'customer/create', loadComponent: () => import('./components/customers/customer-create/customer-create.component').then(m => m.CustomerCreateComponent), canActivate: [pageAccessGuard], data: { page: 'customer' } },
               { path: 'customer/:customerId', loadComponent: () => import('./components/customers/customer-edit/customer-edit.component').then(m => m.CustomerEditComponent), canActivate: [pageAccessGuard], data: { page: 'customer' } },
               { path: 'billing', loadComponent: () => import('./components/billing/billing-list/billing-list.component').then(m => m.BillingListComponent), canActivate: [pageAccessGuard], data: { page: 'billing' } },
               { path: 'billing/create', loadComponent: () => import('./components/billing/billing-create/billing-create.component').then(m => m.BillingCreateComponent), canActivate: [pageAccessGuard], data: { page: 'billing' } },
               { path: 'billing/:readingId', loadComponent: () => import('./components/billing/billing-view/billing-view.component').then(m => m.BillingViewComponent), canActivate: [pageAccessGuard], data: { page: 'billing' } },
               { path: 'payment/official-receipt', loadComponent: () => import('./components/payment/official-receipt/payment-official-receipt-list/payment-official-receipt-list.component').then(m => m.PaymentOfficialReceiptListComponent), canActivate: [pageAccessGuard], data: { page: 'payment_or' } },
               { path: 'payment/official-receipt/create', loadComponent: () => import('./components/payment/official-receipt/payment-official-receipt-create/payment-official-receipt-create.component').then(m => m.PaymentOfficialReceiptCreateComponent), canActivate: [pageAccessGuard], data: { page: 'payment_or' } },
               { path: 'payment/official-receipt/create/:customerId', loadComponent: () => import('./components/payment/official-receipt/payment-official-receipt-create/payment-official-receipt-create.component').then(m => m.PaymentOfficialReceiptCreateComponent), canActivate: [pageAccessGuard], data: { page: 'payment_or' } },
               { path: 'payment/official-receipt/:orId', loadComponent: () => import('./components/payment/official-receipt/payment-official-receipt-view/payment-official-receipt-view.component').then(m => m.PaymentOfficialReceiptViewComponent), canActivate: [pageAccessGuard], data: { page: 'payment_or' } },
               { path: 'payment/other-receipt', loadComponent: () => import('./components/payment/other-payments/other-payment-list/other-payment-list.component').then(m => m.OtherPaymentListComponent), canActivate: [pageAccessGuard], data: { page: 'payment_other' } },
               { path: 'payment/other-receipt/create', loadComponent: () => import('./components/payment/other-payments/other-payment-create/other-payment-create.component').then(m => m.OtherPaymentCreateComponent), canActivate: [pageAccessGuard], data: { page: 'payment_other' } },
               { path: 'payment/other-receipt/:orId', loadComponent: () => import('./components/payment/other-payments/other-payment-view/other-payment-view.component').then(m => m.OtherPaymentViewComponent), canActivate: [pageAccessGuard], data: { page: 'payment_other' } },

               { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent), canActivate: [pageAccessGuard], data: { page: 'settings' } },
               { path: 'settings/water-rates', loadComponent: () => import('./components/settings/water-rates/water-rates.component').then(m => m.WaterRatesComponent), canActivate: [pageAccessGuard], data: { page: 'settings' } },
               { path: 'settings/parts', loadComponent: () => import('./components/settings/parts/parts-list/parts-list.component').then(m => m.PartsListComponent), canActivate: [pageAccessGuard], data: { page: 'settings' } },
               { path: 'settings/default-values', loadComponent: () => import('./components/settings/default-values/default-values.component').then(m => m.DefaultValuesComponent), canActivate: [pageAccessGuard], data: { page: 'settings' } },

               { path: 'reports', loadComponent: () => import('./components/report/report.component').then(m => m.ReportComponent), canActivate: [pageAccessGuard], data: { page: 'reports' } },
               { path: 'reports/collection', redirectTo: 'reports', pathMatch: 'full' },

               { path: 'admin/users', loadComponent: () => import('./components/administration/users/users-list/users-list.component').then(m => m.UsersListComponent), canActivate: [pageAccessGuard], data: { page: 'admin_users' } },
               { path: 'admin/users/create', loadComponent: () => import('./components/administration/users/users-create/users-create.component').then(m => m.UsersCreateComponent), canActivate: [pageAccessGuard], data: { page: 'admin_users' } },
               { path: 'admin/users/:userId', loadComponent: () => import('./components/administration/users/users-update/users-update.component').then(m => m.UsersUpdateComponent), canActivate: [pageAccessGuard], data: { page: 'admin_users' } },
               { path: 'admin/page-access', loadComponent: () => import('./components/administration/page-access/page-access.component').then(m => m.PageAccessComponent), canActivate: [pageAccessGuard], data: { page: 'admin_users' } },
          ]
     },
     {
          path: 'auth',
          loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent),
          children: [
               { path: '', redirectTo: 'login', pathMatch: 'full' },
               { path: 'login', loadComponent: () => import('./components/auth/auth-login/auth-login.component').then(m => m.AuthLoginComponent) },
          ]
     },
     { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },

];
