import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ResidentialComponent } from "./residential/residential.component";
import { CommercialComponent } from "./commercial/commercial.component";

@Component({
  selector: 'app-water-rates',
  standalone: true,
  imports: [
    MatTabsModule,
    ResidentialComponent,
    CommercialComponent
],
  templateUrl: './water-rates.component.html',
  styleUrl: './water-rates.component.css'
})
export class WaterRatesComponent {

}
