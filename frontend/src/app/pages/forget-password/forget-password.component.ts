import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
import { PasswordVerifyComponent } from 'src/app/components/password-verify/password-verify.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  forgetForm: FormGroup | any;

  constructor(
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private userSvc: UserService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private loadingSvc: LoadingService) { }

    ngOnInit() {
      this.forgetForm = this.formBuilder.group({
        email: ['', [Validators.required, this.utilService.emailValidator]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      }, {
        validators: this.utilService.passwordMatchValidator
      });
    }

    submitForm() {
      if (this.forgetForm.valid) {
        this.loadingSvc.showLoading();
        this.userSvc.sendEmailForgetPw(this.forgetForm.value).subscribe({
          next: () => {
            this.loadingSvc.hideLoading();
            const dialogRef = this.dialog.open(PasswordVerifyComponent, {
              data: this.forgetForm.value,
              disableClose: true
            });
  
            dialogRef.afterClosed().subscribe(result => {
              // You can handle the dialog close here if needed
            });
            // this.router.navigate(['/']);
          },
          error: (error: any) => {
            console.error(error);
            this.loadingSvc.hideLoading();
            this.dialog.open(ErrorDialogComponent, {
              data: { errorMessage: 'Cannot chnage password.' }
            });
          }
        });
      }
    }
}
