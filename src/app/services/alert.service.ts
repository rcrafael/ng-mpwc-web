import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

export interface ConfirmOptions {
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

export interface AlertOptions {
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  confirmButtonColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  /**
   * Displays a standardized SweetAlert2 confirmation dialog.
   * Button placement: Confirm on left, Cancel on right.
   */
  confirm(text: string, title: string, options?: ConfirmOptions): Promise<boolean> {
    return AlertService.confirm(text, title, options);
  }

  /**
   * Displays a standardized SweetAlert2 alert dialog.
   * Title is omitted to show the message straightforwardly.
   */
  alert(text: string, options?: AlertOptions): Promise<SweetAlertResult> {
    return AlertService.alert(text, options);
  }

  static confirm(text: string, title: string, options?: ConfirmOptions): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: text,
      icon: options?.icon ?? 'warning',
      showCancelButton: true,
      confirmButtonText: options?.confirmButtonText ?? 'Confirm',
      cancelButtonText: options?.cancelButtonText ?? 'Cancel',
      confirmButtonColor: options?.confirmButtonColor ?? '#2381e0',
      cancelButtonColor: options?.cancelButtonColor ?? '#6c757d',
      reverseButtons: false,
      focusCancel: false,
    }).then((result) => result.isConfirmed);
  }

  static alert(text: string, options?: AlertOptions): Promise<SweetAlertResult> {
    return Swal.fire({
      text: text,
      icon: options?.icon ?? 'info',
      confirmButtonText: options?.confirmButtonText ?? 'OK',
      confirmButtonColor: options?.confirmButtonColor ?? '#2381e0',
    });
  }
}

