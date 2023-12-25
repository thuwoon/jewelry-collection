import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { UtilService } from 'src/app/services/util.service';
import { MatDialog } from '@angular/material/dialog';
// import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmailVerifyComponent } from 'src/app/components/emailVerify/email-verify.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registrationForm: FormGroup | any;
  userId: number | undefined;
  userTypes = [
    {id: 0, name: 'Admin'},
    {id:1, name: 'Loyal'},
    {id:2, name: 'Normal'}
  ]
  userData = localStorage.getItem('user');
  loggedInUser = JSON.parse(this.userData!);
  
  

  constructor(
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private userSvc: UserService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private loadingSvc: LoadingService) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, this.utilService.emailValidator]],
      type: [2, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, this.utilService.phoneValidator()]]
    }, {
      validators: this.utilService.passwordMatchValidator
    });
    if ((this.loggedInUser && this.loggedInUser.type !== 0) || this.router.url === '/register') {
      this.registrationForm.get('type')?.disable();
    }
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.userSvc.getUserInfo(this.userId).subscribe({
          next: (resp) => {
            this.registrationForm.patchValue({
              username: resp.name,
              email: resp.email,
              password: resp.password,
              confirmPassword: resp.password,
              type: resp.type,
              address: resp.address,
              phone: resp.phone
            })

          },
          error: (error: any) => {
            console.error(error);
            this.loadingSvc.hideLoading();
            this.dialog.open(ErrorDialogComponent, {
              data: { errorMessage: 'Cannot get user info.' }
            });
          }
        })
      }
    });
  }

  createUser() {
    if (this.registrationForm.valid) {
      this.loadingSvc.showLoading();
      this.userSvc.sendEmail(this.registrationForm.value).subscribe({
        next: () => {
          this.loadingSvc.hideLoading();
          // this.dialog.open(EmailVerifyComponent, {
          //   data: this.registrationForm.value
          // });
          const dialogRef = this.dialog.open(EmailVerifyComponent, {
            data: this.registrationForm.value,
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
            data: { errorMessage: 'Cannot register user.' }
          });
        }
      });
    }
  }

  updateUser(userId:number){
    this.userSvc.updateUserInfo(userId, this.registrationForm.value).subscribe({
      next:()=>{
        this.dialog.open(MessageDialogComponent, {
          data: 'User is updated successfully.'
        });
        this.router.navigate(['/users']);
      },
      error: (error: any) => {
        console.error(error);
        this.loadingSvc.hideLoading();
        this.dialog.open(ErrorDialogComponent, {
          data: { errorMessage: 'Cannot update user.' }
        });
      }
    })
  }
}
