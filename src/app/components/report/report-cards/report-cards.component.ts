import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-report-cards',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './report-cards.component.html',
  styleUrl: './report-cards.component.css'
})
export class ReportCardsComponent {

  @Input() icon: string = '/assets/icons/reports.svg';
  @Input() title: string = 'Reports';
  @Input() isSelected: boolean = false;

}
