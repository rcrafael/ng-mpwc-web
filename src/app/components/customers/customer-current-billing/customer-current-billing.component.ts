import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-customer-current-billing',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIcon,
  ],
  templateUrl: './customer-current-billing.component.html',
  styleUrl: './customer-current-billing.component.css'
})
export class CustomerCurrentBillingComponent {

}
