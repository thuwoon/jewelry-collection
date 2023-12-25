// socket.service.ts

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

// import * as io from 'socket.io-client'
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  webSocket:any;
  readonly uri: string = 'ws://127.0.0.1:5000'
  constructor(private socket: Socket) {
    // this.socket.connect();
    this.webSocket = io(this.uri);
  }

  listen(eventName: string){
    return new Observable((subscriber)=>{
      this.webSocket.on(eventName, (data:any)=> {
        subscriber.next(data)
      })
    })
  }
  connect() {
    // Connect to your Flask server's Socket.IO namespace
    this.webSocket.connect();
  }

  on(eventName: string) {
    return this.socket.fromEvent(eventName);
  }

  emit(eventName: string, data: any) {
    this.webSocket.emit(eventName, data);
  }

}
