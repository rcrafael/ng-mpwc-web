import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private toast: ToastrService
  ) {

  }

  openToast() {
    this.toast.success('Hello world!', 'Toastr fun!');
  }

}

