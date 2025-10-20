import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthLoginComponent } from './components/auth/auth-login/auth-login.component';
import { authGuard } from './guard/auth.guard';
import { CustomerCreateComponent } from './components/customers/customer-create/customer-create.component';
import { CustomerEditComponent } from './components/customers/customer-edit/customer-edit.component';
import { CustomerListComponent } from './components/customers/customer-list/customer-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AuthComponent } from './components/auth/auth.component';
import { BillingListComponent } from './components/billing/billing-list/billing-list.component';
import { BillingCreateComponent } from './components/billing/billing-create/billing-create.component';
import { BillingViewComponent } from './components/billing/billing-view/billing-view.component';
import { OtherPaymentListComponent } from './components/payment/other-payments/other-payment-list/other-payment-list.component';
import { OtherPaymentCreateComponent } from './components/payment/other-payments/other-payment-create/other-payment-create.component';
import { OtherPaymentViewComponent } from './components/payment/other-payments/other-payment-view/other-payment-view.component';
import { PaymentOfficialReceiptCreateComponent } from './components/payment/official-receipt/payment-official-receipt-create/payment-official-receipt-create.component';
import { PaymentOfficialReceiptListComponent } from './components/payment/official-receipt/payment-official-receipt-list/payment-official-receipt-list.component';
import { PaymentOfficialReceiptViewComponent } from './components/payment/official-receipt/payment-official-receipt-view/payment-official-receipt-view.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WaterRatesComponent } from './components/settings/water-rates/water-rates.component';

export const routes: Routes = [

     {
          path: '',
          component: AppLayoutComponent,
          canActivate: [authGuard],
          children: [
               { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
               { path: 'dashboard', component: DashboardComponent,},
               { path: 'customer', component: CustomerListComponent},
               { path: 'customer/create', component: CustomerCreateComponent},
               { path: 'customer/:customerId', component: CustomerEditComponent,},
               { path: 'billing', component: BillingListComponent},
               { path: 'billing/create', component: BillingCreateComponent},
               { path: 'billing/:readingId', component: BillingViewComponent},
               { path: 'payment/official-receipt', component: PaymentOfficialReceiptListComponent},
               { path: 'payment/official-receipt/create', component: PaymentOfficialReceiptCreateComponent},
               { path: 'payment/official-receipt/create/:customerId', component: PaymentOfficialReceiptCreateComponent},
               { path: 'payment/official-receipt/:orId', component: PaymentOfficialReceiptViewComponent},
               { path: 'payment/other-receipt', component: OtherPaymentListComponent},
               { path: 'payment/other-receipt/create', component: OtherPaymentCreateComponent},
               { path: 'payment/other-receipt/:orId', component: OtherPaymentViewComponent},

               { path: 'settings', component: SettingsComponent},
               { path: 'settings/water-rates', component: WaterRatesComponent},
               { path: 'settings/parts', loadComponent: () => import('./components/settings/parts/parts-list/parts-list.component').then(m => m.PartsListComponent)},
          ]
     },
     { 
          path:'auth',
          component: AuthComponent,
          children: [
               { path: '', redirectTo: 'login', pathMatch: 'full' },
               { path:'login', component: AuthLoginComponent,},
          ]
     },
     { path: '**', component: NotFoundComponent },
    
];
 