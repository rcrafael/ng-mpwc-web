import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-customer-share-cap',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIcon,
  ],
  templateUrl: './customer-share-cap.component.html',
  styleUrl: './customer-share-cap.component.css'
})
export class CustomerShareCapComponent {

}
