import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  rates: Rates[] = [
    {
      order: 1,
      from: 0,
      to: 5,
      value: 165,
      isBaseAmount: true
    },
    {
      order: 2,
      from: 6,
      to: 10,
      value: 26,
      isBaseAmount: false
    },
    {
      order: 3,
      from: 11,
      to: 20,
      value: 27.1,
      isBaseAmount: false
    },
    {
      order: 4,
      from: 21,
      to: 30,
      value: 29.20,
      isBaseAmount: false
    },
    {
      order: 5,
      from: 31,
      to: 40,
      value: 31,
      isBaseAmount: false
    },
    {
      order: 6,
      from: 41,
      to: 50,
      value: 32.80,
      isBaseAmount: false
    },
    {
      order: 7,
      from: 51,
      to: 70,
      value: 35,
      isBaseAmount: false
    },
    {
      order: 8,
      from: 71,
      to: 90,
      value: 37.40,
      isBaseAmount: false
    },
    {
      order: 9,
      from: 91,
      to: null,
      value: 40,
      isBaseAmount: false
    },
  ]

  present: number = 123;
  previous: number = 0;
  used: number = this.present - this.previous;
  // billingAmount: number = 0;
  baseAmount: number = 0;

  calculate() {
    let currentAmount:number = 0;
    let previousCeiling: number | null = 0;
    let currentCeiling: number | null = 0;

    let idx: number = 0;

    for (let r of this.rates) {
      
      if(r.to !== null) {
      
        if(r.isBaseAmount) {
          this.baseAmount = r.value;
          currentAmount = this.baseAmount;
        } else {
          if (this.used >= r.to) {
            console.log('M3used: ', this.used, 'rate.To: ', r.to)
            previousCeiling = this.rates[idx-1].to ? this.rates[idx-1].to : 0 ;
            currentCeiling = r.to ? r.to : 0;
            currentAmount = ((currentCeiling - (previousCeiling ? previousCeiling : 0)) * r.value) + this.baseAmount;
            this.baseAmount = currentAmount;
          } else {
            console.log('M3used: ', this.used, 'rate.To: ', r.to)
            previousCeiling = this.rates[idx-1].to ? this.rates[idx-1].to : 0 ;
            currentAmount = ((this.used - (previousCeiling ? previousCeiling : 0)) * r.value) + this.baseAmount;
            this.baseAmount = currentAmount;
            break;
          }
          
        }

      } else {
        previousCeiling = this.rates[idx-1].to ? this.rates[idx-1].to : 0 ;
        currentCeiling = r.to ? r.to : 0;
        currentAmount = ((this.used - (previousCeiling ? previousCeiling : 0)) * r.value) + this.baseAmount;
        this.baseAmount = currentAmount;
      }

      console.log('from: ', r.from , 'to: ', r.to, 'rate: ', r.value, 'baseAmount: ', this.baseAmount, 'reading Amount: ', currentAmount);
      idx += 1;
    };

    console.log('Previous: ', this.previous);
    console.log('Present: ', this.present);
    console.log('M3 Used: ', this.used);
    console.log('Reading Amount: ', currentAmount);
  }

}

interface Rates {
  order: number;
  from: number;
  to: number | null;
  value: number;
  isBaseAmount: boolean;
}