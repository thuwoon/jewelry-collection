// import { Component, Inject } from '@angular/core';
// import { PostService } from 'src/app/services/post/post.service';
// import { MatDialogRef } from '@angular/material/dialog';
// import { MatDialog } from '@angular/material/dialog';
// import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { UserService } from 'src/app/services/user/user.service';

// @Component({
//   selector: 'app-post-showcase',
//   templateUrl: './post-showcase.component.html',
//   styleUrls: ['./post-showcase.component.scss']
// })
// export class PostShowcaseComponent {
//   selectedImage: any;
//   constructor(
//     @Inject(MAT_DIALOG_DATA) public postData: any,
//     public dialogRef: MatDialogRef<[PostShowcaseComponent]>,
//     private userSvc: UserService
//     ) {
//     const userInfo = this.userSvc.getUserInfo(postData.created_user_id)
//     dialogRef.updateSize('800px', 'auto');
//     if (this.postData) {
//       this.selectedImage = this.postData.img;
//     }
//   }
// }
import { Component, Inject } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-post-showcase',
  templateUrl: './post-showcase.component.html',
  styleUrls: ['./post-showcase.component.scss']
})
export class PostShowcaseComponent {
  selectedImage: any;
  userInfo: any;
  contactNum: any;
  imageList: any;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public postData: any,
    public dialogRef: MatDialogRef<[PostShowcaseComponent]>,
    private userSvc: UserService
  ) {
    this.contactNum = "09764525772";
    this.dialogRef.updateSize('600px', 'auto');
    // this.loadUserData();
    // console.log(this.userInfo)
    // if (this.postData) {
    //   this.selectedImage = this.postData.img;
    // }
    if (this.postData) {
      this.imageList = this.postData.img;
    }
  }

  async loadUserData() {
    try {
      console.log('loadUserData started');
      this.userInfo = await this.userSvc.getUserInfo(this.postData.created_user_id);
      console.log('loadUserData completed:', this.userInfo);
    } catch (error) {
      // Handle error if needed
      console.error('Error loading user data:', error);
    }
  }
}
