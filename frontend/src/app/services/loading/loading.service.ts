import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Headers } from '../httpCommon.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private dialog: MatDialog) { }

  showLoading(): void {
    this.dialog.open(LoadingComponent, {
      disableClose: true,
      panelClass: 'circular-dialog',
    });
  }

  hideLoading(): void {
    this.dialog.closeAll(); // Close all dialogs, including the loading dialog
  }
}
