import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';

@Component({
  selector: 'app-password-verify',
  templateUrl: './password-verify.component.html',
  styleUrls: ['./password-verify.component.scss']
})
export class PasswordVerifyComponent {
  verificationCode: string = '';

  constructor(
    public dialogRef: MatDialogRef<PasswordVerifyComponent>,
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
      this.userSvc.verifyAndChangePw(this.userData, Number(this.verificationCode)).subscribe({
        next: () => {
          this.loadingSvc.hideLoading();
          this.dialog.open(MessageDialogComponent, {
            data: 'Password is changed successfully.'
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
