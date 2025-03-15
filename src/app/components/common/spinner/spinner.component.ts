import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

  constructor(private commonService: CommonService) {}

  isSpinnerVisible: boolean = false;

  ngOnInit(): void {
    this.commonService.getShowSpinnerVisibility().subscribe((isLoading:boolean) => {
      this.isSpinnerVisible = isLoading
    });
  }

}
