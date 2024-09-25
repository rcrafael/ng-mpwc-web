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
import { PaymentOfficialReceiptListComponent } from './components/payment/payment-official-receipt-list/payment-official-receipt-list.component';
import { PaymentOfficialReceiptCreateComponent } from './components/payment/payment-official-receipt-create/payment-official-receipt-create.component';
import { PaymentOfficialReceiptViewComponent } from './components/payment/payment-official-receipt-view/payment-official-receipt-view.component';

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
               { path: 'customer/:accountNo', component: CustomerEditComponent,},
               { path: 'billing', component: BillingListComponent},
               { path: 'billing/create', component: BillingCreateComponent},
               { path: 'billing/:readingNo', component: BillingViewComponent},
               { path: 'payment/official-receipt', component: PaymentOfficialReceiptListComponent},
               { path: 'payment/official-receipt', component: PaymentOfficialReceiptCreateComponent},
               { path: 'payment/official-receipt/:receiptNo', component: PaymentOfficialReceiptViewComponent}
               
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
 