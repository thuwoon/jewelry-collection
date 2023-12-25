import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirmDialog/confirm-dialog.component';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';
import { PostComponentComponent } from 'src/app/components/post-component/post-component.component';
import { PostShowcaseComponent } from 'src/app/components/post-showcase/post-showcase.component';
import { AppConstants } from 'src/app/constants';
import { HomeService } from 'src/app/services/home/home.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { PostService } from 'src/app/services/post/post.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-auction-posts',
  templateUrl: './auction-posts.component.html',
  styleUrls: ['./auction-posts.component.scss']
})
export class AuctionPostsComponent {
  searchForm: FormGroup;
  postList: any[] = [];
  userData: any = localStorage.getItem('user');
  userObj = JSON.parse(this.userData);
  gemTypes = AppConstants.gemTypes;
  itemTypes = AppConstants.itemTypes;
  isOpenPrice: boolean = false;
  auction_price: number = 0;

  subscription:any;
  receivedData:any;
  private onDestroy = new Subject<void>();

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  constructor(
    // private Svc: HomeService,
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
    this.postSvc.getAucPostList().subscribe({
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

  // showPriceBox(): void {
  //   this.isOpenPrice = true;
  // }

  createPost(): void {
    const postData:any = {
      isAuction: true
    }
    if (this.userObj.type === 2) {
      return;
    } else {
      const dialogRef = this.dialog.open(PostComponentComponent, {
        data: postData
      });

      dialogRef.afterClosed().subscribe(result => {
        this.fetchData();
      });
    }
  }

  editPost(postData: any = null): void {
    if (this.userObj.type === 2) {
      return;
    } else {
      postData.isAuction = true;
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
          this.postSvc.deleteAucPost(postId).subscribe({
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

  onSearchAucPost(): void {
    if (this.searchForm.valid && this.searchForm.value.gem_type || this.searchForm.value.item_type) {
      this.postSvc.searchAucPost(this.searchForm.value).subscribe({
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

  // changeAucPriceFn(e:any):any {
  //   console.log(e)
  //   this.auction_price = e.target.value
  //   console.log('this.auction-=-=L> ', this.auction_price)
  // }

  changeAucPriceFn(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    // newValue contains the updated value of the input field
    console.log(newValue);
    this.auction_price = Number(newValue);
  }

  updateAucPrice(item: any) {
    
    if (this.auction_price === 0){
      return
    }
    // this.fetchData();
    console.log('postlist--=-=-> ', this.postList)

    let leastPrice = item.auction_price + 100000;
    // this.postList.forEach((post:any)=> {
    //   if (item.id === post.id){
    //     leastPrice = post.auction_price + 100000;
    //   }
    // })

    
    if (Number(this.auction_price) < leastPrice){
      this.dialog.open(ErrorDialogComponent, {
        data: { errorMessage: 'Price should be equal or more than '+ leastPrice }
      });
      return
    }
    this.postSvc.updateAucPrice(this.auction_price, item.id).subscribe({
      next: (response) => {
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          data: 'Your pirce is saved successfully.'
        });
        dialogRef.afterClosed().subscribe(()=>{
          this.fetchData();
        })
        this.auction_price = 0;
        
      },
      error: (error) => {
        this.postList = [];
        this.fetchData();
        console.error(error);
        this.dialog.open(ErrorDialogComponent, {
          data: { errorMessage: 'Cannot find post.' }
        });
      }
    });
    
  }
}
