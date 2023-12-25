import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private dialog: MatDialog
  ){
    
  }

  checkAdmin(): boolean {
    const userData:any = localStorage.getItem('user');
    const userObj = JSON.parse(userData)
    if (userObj?.type == 0) {
      return true;
    }
    return false;
  }

  checkPermission(): boolean {
    const userData:any = localStorage.getItem('user');
    const userObj = JSON.parse(userData)
    if (userObj?.type == 0 || userObj?.type == 1) {
      return true;
    }
    return false;
  }

  logout(): any {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  editUser(): void {
    const userData:any = localStorage.getItem('user');
    const userObject = JSON.parse(userData);
    this.router.navigate(['/profile/'+ userObject.id]);
  }

}
