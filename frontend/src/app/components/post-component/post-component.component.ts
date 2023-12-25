import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PostService } from 'src/app/services/post/post.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConstants } from 'src/app/constants';

@Component({
  selector: 'app-post-component',
  templateUrl: './post-component.component.html',
  styleUrls: ['./post-component.component.scss']
})
export class PostComponentComponent {
  postForm: FormGroup;
  selectedImage: string | null = null;
  jadeTypes = AppConstants.gemTypes;
  itemTypes = AppConstants.itemTypes;
  imageList:any = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public postData: any,
    public dialogRef: MatDialogRef<[PostComponentComponent]>,
    private formBuilder: FormBuilder,
    private postSvc: PostService,
    private dialog: MatDialog,

  ) {
    console.log('postData-=-=> ', this.postData)
    dialogRef.updateSize('800px', 'auto');
    this.postForm = this.formBuilder.group({
      reserved: [false],
      gem_type: ['', [Validators.required]],
      item_type: ['', []],
      color: ['', Validators.required],
      transparency: ['', Validators.required],
      shape: ['', Validators.required],
      weight: ['', Validators.required],
      origin: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      img: [''],
      item_code: [{value: '', disabled: true}],

    });
    if (this.postData && this.postData.id) {
      this.postForm.patchValue({
        reserved: this.postData.reserved ? this.postData.reserved : false,
        gem_type: this.postData.gem_type,
        item_type: this.postData.item_type,
        color: this.postData.color,
        transparency: this.postData.transparency,
        shape: this.postData.shape,
        weight: this.postData.weight,
        origin: this.postData.origin,
        price: this.postData.price,
        description: this.postData.description,
        img: this.postData.img,
        item_code: this.postData.item_code,
      });
      this.imageList = this.postData.img;

      this.selectedImage = this.postData.img;
      // console.log(typeof(this.selectedImage), this.selectedImage)
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without creating a post
  }

  onCreatePost(): void {
    if (this.postForm.valid) {
      console.log('auction create-=-> ', this.postData)
      if(this.postData && this.postData.isAuction) {
        this.postSvc.createAucPost(this.postForm.value).subscribe({
          next: (response) => {
            this.dialogRef.close();
          },
          error: (error) => {
            console.error(error);
            this.dialogRef.close();
            this.dialog.open(ErrorDialogComponent, {
              data: { errorMessage: 'Cannot create auction post.' }
            });
          }
        });

      }
      else {
        this.postSvc.createPost(this.postForm.value).subscribe({
          next: (response) => {
            this.dialogRef.close();
          },
          error: (error) => {
            console.error(error);
            this.dialogRef.close();
            this.dialog.open(ErrorDialogComponent, {
              data: { errorMessage: 'Cannot create post.' }
            });
          }
        });
      }
    }

  }
  updatePost(): void {
    if (this.postForm.valid) {
      if (this.postData && this.postData.isAuction) {
        this.postSvc.updateAucPost(this.postForm.value, this.postData.id).subscribe({
          next: (response) => {
            this.dialogRef.close();
            console.log('response-=-> ', response)
            // this.router.navigate(['/']);
          },
          error: (error) => {
            console.error(error);
            this.dialogRef.close();
            this.dialog.open(ErrorDialogComponent, {
              data: { errorMessage: 'Cannot create auction post.' }
            });
          }
        })
      } else {
        this.postSvc.updatePost(this.postForm.value, this.postData.id).subscribe({
          next: (response) => {
            this.dialogRef.close();
            console.log('response-=-> ', response)
            // this.router.navigate(['/']);
          },
          error: (error) => {
            console.error(error);
            this.dialogRef.close();
            this.dialog.open(ErrorDialogComponent, {
              data: { errorMessage: 'Cannot create post.' }
            });
          }
        });

      }
    }

  }

  onImageChange(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      // const file = files.item(0);
      const file: File = files.item(0) as File;
      const fileName = file?.name;
      const fileExtension = fileName?.split('.').pop()?.toLowerCase();

      // Check if the file extension is 'jpg' or 'png'
      if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          // Use the result property of the FileReader to get the Base64 representation
          this.selectedImage = fileReader.result as string;
          // this.postForm.value.img = fileReader.result as string;
          this.imageList.push(fileReader.result as string)
          this.postForm.value.img = this.imageList;
        };
        fileReader.readAsDataURL(file);
      } else {
        // Handle invalid file extension (not jpg or png)
        // console.log('Invalid file type. Please select a JPG or PNG image.');
        this.dialog.open(ErrorDialogComponent, {
          data: { errorMessage: 'Invalid file type. Please select a JPG or PNG image.' }
        });
        this.selectedImage = null;
      }
    } else {
      this.selectedImage = null;
    }
  }

  removeImg(index: number) {
    this.imageList.splice(index, 1);
  }
}
