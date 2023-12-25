import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss']
})
export class EmailVerifyComponent {
  verificationCode: string = '';

  constructor(
    public dialogRef: MatDialogRef<EmailVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: any,
    private userSvc: UserService,
    private dialog: MatDialog,
    private router: Router,
    private loadingSvc: LoadingService
  ) { }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.verificationCode) {
      this.loadingSvc.showLoading();
      this.userSvc.verifyAndRegisterUser(this.userData, Number(this.verificationCode)).subscribe({
        next: () => {
          this.loadingSvc.hideLoading();
          this.dialog.open(MessageDialogComponent, {
            data: 'User is created successfully.'
          });
          // this.dialogRef.close(this.verificationCode);
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error(error.error.error);
          this.loadingSvc.hideLoading();
          let errMsg = '';
          if (error.error.error === 'duplicate email') {
            errMsg = "Email is already used."
            this.dialogRef.close();
            this.openMessageDialog(errMsg);
          } else if (error.error.error === 'duplicate name') {
            errMsg = "Username is already used."
            this.dialogRef.close();
            this.openMessageDialog(errMsg);
          } else if (error.error.error === 'invalid code') {
            errMsg = "Invalid code! Try agian."
            this.dialogRef.close();
            this.openMessageDialog(errMsg);
          } else {
            errMsg = "Cannot register the user."
            this.dialogRef.close();
            this.openMessageDialog(errMsg);
          }
  
        }
      });
    }
  }
  closeVerifyDialog(){
    this.dialogRef.close();
  }
  openMessageDialog(errMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: { errorMessage: errMsg }
    });
  }
}
