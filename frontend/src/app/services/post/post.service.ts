import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Headers } from '../httpCommon.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }
  createPost(postData: any): Observable<any> {
    const headers = Headers;
    const userData: any = localStorage.getItem('user')
    const userObject = JSON.parse(userData)
    console.log('postData-=-> ',postData)
    const body = {
      reserved: postData.reserved,
      gem_type: postData.gem_type,
      item_type: postData.item_type,
      color: postData.color,
      transparency: postData.transparency,
      shape: postData.shape,
      weight: postData.weight,
      origin: postData.origin,
      price: postData.price,
      description: postData.description,
      img: postData.img,
      item_code: postData.item_code,
      created_user_id: userObject.id
    };
    return this.http.post<any>('http://localhost:4200/api/post', body, { headers });
  }

  updatePost(postData: any, postId: number): Observable<any> {
    console.log('postDatat-=-=-> ', postData)
    const headers = Headers;
    const userData: any = localStorage.getItem('user')
    const userObject = JSON.parse(userData)
    console.log(userObject, userObject.id)
    const body = {
      reserved: postData.reserved,
      gem_type: postData.gem_type,
      item_type: postData.item_type,
      color: postData.color,
      transparency: postData.transparency,
      shape: postData.shape,
      weight: postData.weight,
      origin: postData.origin,
      price: postData.price,
      description: postData.description,
      img: postData.img,
      item_code: postData.item_code,
      created_user_id: userObject.id
    };
    return this.http.put<any>('http://localhost:4200/api/post/' + postId, body, { headers });
  }

  deletePost(postId: number): Observable<any> {
    const headers = Headers;
    return this.http.delete<any>('http://localhost:4200/api/post/' + postId, { headers })
  }

  deleteAucPost(postId: number): Observable<any> {
    const headers = Headers;
    return this.http.delete<any>('http://localhost:4200/api/post/auction/' + postId, { headers })
  }

  searchPost(searchData: any): Observable<any> {
    const headers = Headers;
    const body = {
      gem_type: searchData.gem_type ? searchData.gem_type: '',
      item_type: searchData.item_type ? searchData.item_type: '',
      
    };
    return this.http.post<any>('http://localhost:4200/api/post/search', body, { headers });
  }

  searchAucPost(searchData: any): Observable<any> {
    const headers = Headers;
    const body = {
      gem_type: searchData.gem_type ? searchData.gem_type: '',
      item_type: searchData.item_type ? searchData.item_type: '',
      
    };
    return this.http.post<any>('http://localhost:4200/api/post/auction/search', body, { headers });
  }

  getAucPostList(): Observable<any> {
    const headers = Headers;
    return this.http.get<any>('http://localhost:4200/api/post/auction/list', { headers });
  }

  createAucPost(postData: any): Observable<any> {
    const headers = Headers;
    const userData: any = localStorage.getItem('user')
    const userObject = JSON.parse(userData)
    console.log('postData Auction-=-> ',postData)
    const body = {
      gem_type: postData.gem_type,
      item_type: postData.item_type,
      color: postData.color,
      transparency: postData.transparency,
      shape: postData.shape,
      weight: postData.weight,
      origin: postData.origin,
      price: postData.price,
      description: postData.description,
      img: postData.img,
      item_code: postData.item_code,
      created_user_id: userObject.id,
      winner_id: 0
    };
    return this.http.post<any>('http://localhost:4200/api/post/auction', body, { headers });
  }
  updateAucPost(postData: any, postId: number): Observable<any> {
    console.log('postDatat-=-=-> ', postData)
    const headers = Headers;
    const userData: any = localStorage.getItem('user')
    const userObject = JSON.parse(userData)
    console.log(userObject, userObject.id)
    const body = {
      gem_type: postData.gem_type,
      item_type: postData.item_type,
      color: postData.color,
      transparency: postData.transparency,
      shape: postData.shape,
      weight: postData.weight,
      origin: postData.origin,
      price: postData.price,
      description: postData.description,
      img: postData.img,
      item_code: postData.item_code,
      created_user_id: userObject.id,
      winner_id: userObject.id
    };
    return this.http.put<any>('http://localhost:4200/api/post/auction/' + postId, body, { headers });
  }
  updateAucPrice(price: number, postId: number): Observable<any> {
    console.log('priec-=-=-> ', price)
    const headers = Headers;
    const userData: any = localStorage.getItem('user')
    const userObject = JSON.parse(userData)
    console.log(userObject, userObject.id)
    const body = {
      auction_price: price,
      winner_id: userObject.id
    };
    return this.http.put<any>('http://localhost:4200/api/post/auction/' + postId, body, { headers });
  }
}
