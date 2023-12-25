import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  constructor(
    private dialogRef: MatDialogRef<[LoadingComponent]>
  ){
    // dialogRef.updateSize('35px', '35px')
  }
}
