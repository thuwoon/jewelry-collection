import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { UserListComponent } from './pages/userList/user-list.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';



import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorDialogComponent } from './components/errorDialog/error-dialog.component';
import { PostComponentComponent } from './components/post-component/post-component.component';
import { PostShowcaseComponent } from './components/post-showcase/post-showcase.component';
import { RegisterComponent } from './pages/register/register/register.component';
import { EmailVerifyComponent } from './components/emailVerify/email-verify.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ConfirmDialogComponent } from './components/confirmDialog/confirm-dialog.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { AuctionPostsComponent } from './pages/auction-posts/auction-posts.component';
import { CountdownPipe } from './countdown.pipe';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { PasswordVerifyComponent } from './components/password-verify/password-verify.component';
registerLocaleData(en);

const config: SocketIoConfig = { url: 'http://127.0.0.1:5000', options: {} };
// const config: SocketIoConfig = { url: 'http://localhost:4200/api', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    NavbarComponent,
    LoginComponent,
    ErrorDialogComponent,
    PostComponentComponent,
    PostShowcaseComponent,
    RegisterComponent,
    EmailVerifyComponent,
    LoadingComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    AuctionPostsComponent,
    CountdownPipe,
    ForgetPasswordComponent,
    PasswordVerifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzCardModule,
    NzAvatarModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NzButtonModule,
    NzFormModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDividerModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
