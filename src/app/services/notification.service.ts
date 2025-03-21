import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    panelClass: ['notification-snackbar']
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Shows a success notification
   * @param message The message to display
   * @param duration Optional duration in milliseconds
   */
  showSuccess(message: string, duration?: number): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      panelClass: ['notification-snackbar', 'success-notification'],
      duration: duration || this.defaultConfig.duration
    };
    this.snackBar.open(message, 'Close', config);
  }

  /**
   * Shows an error notification
   * @param message The message to display
   * @param duration Optional duration in milliseconds
   */
  showError(message: string, duration?: number): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      panelClass: ['notification-snackbar', 'error-notification'],
      duration: duration || this.defaultConfig.duration
    };
    this.snackBar.open(message, 'Close', config);
  }

  /**
   * Shows a warning notification
   * @param message The message to display
   * @param duration Optional duration in milliseconds
   */
  showWarning(message: string, duration?: number): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      panelClass: ['notification-snackbar', 'warning-notification'],
      duration: duration || this.defaultConfig.duration
    };
    this.snackBar.open(message, 'Close', config);
  }

  /**
   * Shows an info notification
   * @param message The message to display
   * @param duration Optional duration in milliseconds
   */
  showInfo(message: string, duration?: number): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      panelClass: ['notification-snackbar', 'info-notification'],
      duration: duration || this.defaultConfig.duration
    };
    this.snackBar.open(message, 'Close', config);
  }

  /**
   * Shows a custom notification with specific configurations
   * @param message The message to display
   * @param action The action text
   * @param config Custom snackbar configuration
   */
  showCustom(message: string, action: string = 'Close', config?: MatSnackBarConfig): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      ...config
    });
  }
}