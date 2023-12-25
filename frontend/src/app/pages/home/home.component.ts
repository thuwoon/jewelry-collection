import { Component } from '@angular/core';
import { HomeService } from 'src/app/services/home/home.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { PostComponentComponent } from 'src/app/components/post-component/post-component.component';
import { PostShowcaseComponent } from 'src/app/components/post-showcase/post-showcase.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ConfirmDialogComponent } from 'src/app/components/confirmDialog/confirm-dialog.component';
import { PostService } from 'src/app/services/post/post.service';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConstants } from 'src/app/constants';
import { SocketService } from 'src/app/services/socket.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchForm: FormGroup;
  postList: any[] = [];
  userData: any = localStorage.getItem('user');
  userObj = JSON.parse(this.userData);
  gemTypes = AppConstants.gemTypes;
  itemTypes = AppConstants.itemTypes;

  subscription:any;
  receivedData:any;
  constructor(
    private homeSvc: HomeService,
    private http: HttpClient,
    private dialog: MatDialog,
    private loadingSvc: LoadingService,
    private postSvc: PostService,
    private formBuilder: FormBuilder,
    private socketService: SocketService,
  ) {
    this.searchForm = this.formBuilder.group({
      gem_type: [''],
      item_type: [''],
    });

    this.loadingSvc.showLoading();
    this.fetchData();
    // this.socketService.on('post_list')

    // this.socketService.listen('custom_event').subscribe(
    //   (data: any) => {
    //     console.log('Received post_list:', data);
    //     this.receivedData = data;
    //   },
    //   (error) => {
    //     console.error('Error handling WebSocket message:', error);
    //   }
    // );

  }

  ngOnInit(): void {

    // this.socketService.listen('custom_event').subscribe((data: any) => {
    //   // this.loadingSvc.hideLoading();
    //   // this.postList = data.post_list;
    //   console.log('Received post_list:',data);
    // });
  }

  fetchData(): void {
    this.homeSvc.getPostList().subscribe({
      next: (response) => {
        this.loadingSvc.hideLoading();
        this.postList = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  checkUser(): boolean {
    if (this.userObj.type === 2) {
      return false;
    }
    return true;
  }

  checkProperty(ownerId: number): boolean {
    if (this.userObj.type === 0 || this.userObj.id === ownerId) {
      return true
    }
    return false
  }

  showPostDialog(postData: any = null): void {

    this.dialog.open(PostShowcaseComponent, {
      data: postData
    });


  }

  editPost(postData: any = null): void {
    if (this.userObj.type === 2) {
      return;
    } else {
      if(!postData){
        postData = {
          isAuction : false
        }
      }
      const dialogRef = this.dialog.open(PostComponentComponent, {
        data: postData
      });

      dialogRef.afterClosed().subscribe(result => {
        this.fetchData();
      });
    }
  }

  deletePost(postId: number): void {
    if (this.userObj.type === 2) {
      return;
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: 'Do you want to delete this post?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.postSvc.deletePost(postId).subscribe({
            next: (response) => {
              console.log('response-=-> ', response)
              this.fetchData();
            },
            error: (error) => {
              console.error(error);
              this.dialog.open(ErrorDialogComponent, {
                data: { errorMessage: 'Cannot delete post.' }
              });
            }
          });
        } else {
          return;
        }
      });
    }
  }

  onSearchPost(): void {
    console.log('searchForm=-=-> ', this.searchForm.value, this.searchForm.valid && this.searchForm.value.gem_type || this.searchForm.value.item_type)
    if (this.searchForm.valid && this.searchForm.value.gem_type || this.searchForm.value.item_type) {
      console.log('text0-=-=-=> ', this.searchForm.value)
      this.postSvc.searchPost(this.searchForm.value).subscribe({
        next: (response) => {
          console.log(response)
          this.postList = response;
        },
        error: (error) => {
          this.postList = [];
          console.error(error);
          // this.dialog.open(ErrorDialogComponent, {
          //   data: { errorMessage: 'Cannot find post.' }
          // });
        }
      });
    } else {
      this.fetchData();
    }

  }

  onCancle(): any {
    this.searchForm.patchValue({
      gem_type: '',
      item_type: '',
    });
    this.fetchData();
  }
}
