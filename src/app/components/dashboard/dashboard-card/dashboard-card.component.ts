import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent implements OnInit {

  @Input() title: string = '';
  @Input() value!: any;
  @Input() icon: string = '';
  @Input() iconColor: string = '';
  @Input() iconBackgroundColor: string = '';

  classes: string = '';
  cardClasses: string = '';

  constructor() { 
   
  }

  ngOnInit(): void {
     if (this.iconColor === '') {
      this.iconColor = 'bg-black';
    }
    console.log('ICON: ', this.icon);

    this.classes = `w-12 h-12 rounded-lg ${this.iconColor} `;
    this.cardClasses = `flex items-center justify-center ${this.iconBackgroundColor} ring-0 rounded-lg`

  }

}
