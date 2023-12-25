import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Real-Estate';
  constructor(private router: Router,
    private socket: SocketService) {
    // this.socket.connect();
    // this.socket.listen('post_list').subscribe((data:any)=> {
    //   console.log('this is received data-=-> ', data)
    // })    
  }

  showNavbar(): boolean {
    if (this.router.url !== '/login' && this.router.url !== '/register' && this.router.url !== '/forget-password') {
      return true
    }
    return false;

  }

}
