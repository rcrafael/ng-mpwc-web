import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [

     {
          path: '',
          loadComponent: () => import('./components/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
          canActivate: [authGuard],
          children: [
               { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
               { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
               { path: 'customer', loadComponent: () => import('./components/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent) },
               { path: 'customer/create', loadComponent: () => import('./components/customers/customer-create/customer-create.component').then(m => m.CustomerCreateComponent) },
               { path: 'customer/:customerId', loadComponent: () => import('./components/customers/customer-edit/customer-edit.component').then(m => m.CustomerEditComponent) },
               { path: 'billing', loadComponent: () => import('./components/billing/billing-list/billing-list.component').then(m => m.BillingListComponent) },
               { path: 'billing/create', loadComponent: () => import('./components/billing/billing-create/billing-create.component').then(m => m.BillingCreateComponent) },
               { path: 'billing/:readingId', loadComponent: () => import('./components/billing/billing-view/billing-view.component').then(m => m.BillingViewComponent) },
               { path: 'payment/official-receipt', loadComponent: () => import('./components/payment/official-receipt/payment-official-receipt-list/payment-official-receipt-list.component').then(m => m.PaymentOfficialReceiptListComponent) },
               { path: 'payment/official-receipt/create', loadComponent: () => import('./components/payment/official-receipt/payment-official-receipt-create/payment-official-receipt-create.component').then(m => m.PaymentOfficialReceiptCreateComponent) },
               { path: 'payment/official-receipt/create/:customerId', loadComponent: () => import('./components/payment/official-receipt/payment-official-receipt-create/payment-official-receipt-create.component').then(m => m.PaymentOfficialReceiptCreateComponent) },
               { path: 'payment/official-receipt/:orId', loadComponent: () => import('./components/payment/official-receipt/payment-official-receipt-view/payment-official-receipt-view.component').then(m => m.PaymentOfficialReceiptViewComponent) },
               { path: 'payment/other-receipt', loadComponent: () => import('./components/payment/other-payments/other-payment-list/other-payment-list.component').then(m => m.OtherPaymentListComponent) },
               { path: 'payment/other-receipt/create', loadComponent: () => import('./components/payment/other-payments/other-payment-create/other-payment-create.component').then(m => m.OtherPaymentCreateComponent) },
               { path: 'payment/other-receipt/:orId', loadComponent: () => import('./components/payment/other-payments/other-payment-view/other-payment-view.component').then(m => m.OtherPaymentViewComponent) },

               { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
               { path: 'settings/water-rates', loadComponent: () => import('./components/settings/water-rates/water-rates.component').then(m => m.WaterRatesComponent) },
               { path: 'settings/parts', loadComponent: () => import('./components/settings/parts/parts-list/parts-list.component').then(m => m.PartsListComponent) },
               { path: 'settings/default-values', loadComponent: () => import('./components/settings/default-values/default-values.component').then(m => m.DefaultValuesComponent) },

               { path: 'reports', loadComponent: () => import('./components/report/report.component').then(m => m.ReportComponent) },
               { path: 'reports/collection', loadComponent: () => import('./components/report/collection/collection.component').then(m => m.CollectionComponent) },

               { path: 'admin/users', loadComponent: () => import('./components/administration/users/users-list/users-list.component').then(m => m.UsersListComponent) },
               { path: 'admin/users/create', loadComponent: () => import('./components/administration/users/users-create/users-create.component').then(m => m.UsersCreateComponent) },
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
