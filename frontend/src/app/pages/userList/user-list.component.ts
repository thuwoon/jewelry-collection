import { Component, OnInit } from '@angular/core';
import { UserListService } from 'src/app/services/userList/user-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'; // Add this import for ViewChild
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirmDialog/confirm-dialog.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit { // Implement OnInit
  displayedColumns: string[] = ['name', 'email', 'type', 'address', 'phone', 'purchase-count', 'actions'];

  dataSource!: MatTableDataSource<any>; // Define the dataSource type

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Add ViewChild for MatPaginator

  userData: any = localStorage.getItem('user');
  userObj = JSON.parse(this.userData);

  constructor(
    private userSvc: UserService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private loadingSvc: LoadingService
  ) {}

  ngOnInit(): void {
    this.fetchUserList();
  }

  fetchUserList(): void {
    this.userSvc.getUserList().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource<any>(response);
        this.dataSource.paginator = this.paginator; // Set the paginator for the dataSource
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  createUser(): void {
    this.router.navigate(['/register']);
  }

  editUser(userId: number): void {
    this.router.navigate(['/user/'+ userId]);
  }

  deleteUser(userId: number): void {
    if (this.userObj.type === 2 ) {
      return;
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: 'Do you want to delete this user?'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.loadingSvc.showLoading();
          this.userSvc.deleteUser(userId).subscribe({
            next: () => {
              this.fetchUserList();
              this.loadingSvc.hideLoading();
            },
            error: (error) => {
              this.loadingSvc.hideLoading();
              console.error(error);
              this.dialog.open(ErrorDialogComponent, {
                data: { errorMessage: 'Cannot delete user.' }
              });
            }
          });
        } else {
          return;
        }
      });
    }
  }

}
