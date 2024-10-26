import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-details-modal',
  standalone: true,
  imports: [
    MatDialogModule
  ],
  templateUrl: './add-details-modal.component.html',
  styleUrl: './add-details-modal.component.css'
})
export class AddDetailsModalComponent {

}
