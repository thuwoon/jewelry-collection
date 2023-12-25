import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserListComponent } from './pages/userList/user-list.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { RegisterComponent } from './pages/register/register/register.component';
import { AuctionPostsComponent } from './pages/auction-posts/auction-posts.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';

const isAuthenticated = false;

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]  },
  { path: 'auctions', component: AuctionPostsComponent, canActivate: [AuthGuard]  },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'forget-password', component: ForgetPasswordComponent},
  { path: 'user/:id', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent }
]; 





@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
