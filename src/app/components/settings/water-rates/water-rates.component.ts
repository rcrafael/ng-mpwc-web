import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ResidentialComponent } from "./residential/residential.component";
import { CommercialComponent } from "./commercial/commercial.component";
import { AddDetailsModalComponent } from "../../payment/other-payments/add-details-modal/add-details-modal.component";
import { SeptageFeesComponent } from "./septage-fees/septage-fees.component";

@Component({
  selector: 'app-water-rates',
  standalone: true,
  imports: [
    MatTabsModule,
    ResidentialComponent,
    CommercialComponent,
    SeptageFeesComponent
],
  templateUrl: './water-rates.component.html',
  styleUrl: './water-rates.component.css'
})
export class WaterRatesComponent {

}
