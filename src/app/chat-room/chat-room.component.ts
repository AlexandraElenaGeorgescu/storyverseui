import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageModel } from '../models/message.model';
import { UtilsService } from '../services/utils.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
    imports: [
      CommonModule,
      HttpClientModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule
    ],
    standalone: true,
    selector: 'app-chat-room',
    templateUrl: './chat-room.component.html',
    styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
    storyId: string;
    msgDiv!: HTMLElement;
    messageInput!: HTMLInputElement;
    socket!: WebSocket;

    constructor(private titleService: Title, private route: ActivatedRoute, private dataService: DataService, public utils: UtilsService) {
        this.titleService.setTitle('Story Chat');
        this.storyId = this.route.snapshot.params['storyId'];
        window.onscroll = function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                const goBottomElement = document.getElementById('goBottom');
                if (goBottomElement) {
                    goBottomElement.style.setProperty('display', 'none');
                }
            } else {
                const goBottomElement = document.getElementById('goBottom');
                if (goBottomElement) {
                    goBottomElement.style.setProperty('display', 'initial');
                }
            }
        }
    }

    goBottom() {
        const goBottomElement = document.getElementById('goBottom');
        if (goBottomElement) {
            goBottomElement.style.setProperty('display', 'none');
        }
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    }

    ngOnInit() {
        this.msgDiv = <HTMLElement>document.getElementById('msg-div');
        this.messageInput = <HTMLInputElement>document.getElementById('messageInput');
        this.dataService.get<MessageModel[]>('story/chat-messages/' + this.storyId, msgs => {
            for (let i = 0; i < msgs.length; i++) {
                if (msgs[i].userName == '')
                    this.addMsg(msgs[i].message);
                else
                    this.addMsg(msgs[i].message, msgs[i].dateSent, msgs[i].userName);
            }

            this.socket = new WebSocket(this.dataService.getWebSocketUrl());
            this.socket.onclose = e => { this.logSocketState(); this.utils.showMessage('Connection closed!') }
            this.socket.onerror = e => { this.logSocketState(); this.utils.showMessage('Connection error!') }
            this.socket.onopen = e => {
                const initMsg: string = this.storyId + ' ' + localStorage.getItem('user-token');
                this.socket.send(initMsg);
                this.logSocketState();
            }
            this.socket.onmessage = e => {
                const splits: string[] = (<string>e.data).split('!#|||#!');
                this.addMsg(splits[0], splits[1], splits[2]);
            }
        }, error => { }, localStorage.getItem('user-token') ?? '');
    }

    sendMessage() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = this.messageInput.value;
            this.messageInput.value = '';
            this.socket.send(data);
            this.addMsg(data);
        }
    }

    enterDown(event: { key: string; }) {
        if (event.key === "Enter") {
            this.sendMessage();
        }
    }

    addMsg(msg: string, dateSent: string | null = null, from: string | null = null) {
        if (from === null) {
            const div1 = document.createElement('div');
            const span1 = document.createElement('span');
            const span2 = document.createElement('span');

            const atr: Attr = this.messageInput.attributes[0];
            div1.setAttributeNode(document.createAttribute(atr.name));
            span1.setAttributeNode(document.createAttribute(atr.name));
            span2.setAttributeNode(document.createAttribute(atr.name));

            div1.setAttribute('class', 'my-msg');
            span1.innerText = msg;
            span2.innerText = this.utils.getStringDate(new Date());

            div1.appendChild(span1);
            div1.appendChild(document.createElement('br'));
            div1.appendChild(span2);

            this.msgDiv.appendChild(document.createElement('br'));
            this.msgDiv.appendChild(div1);
        } else {
            const div1 = document.createElement('div');
            const span1 = document.createElement('span');
            const span11 = document.createElement('span');
            const span12 = document.createElement('span');
            const span2 = document.createElement('span');

            const atr: Attr = this.messageInput.attributes[0];
            div1.setAttributeNode(document.createAttribute(atr.name));
            span1.setAttributeNode(document.createAttribute(atr.name));
            span11.setAttributeNode(document.createAttribute(atr.name));
            span12.innerText = msg;
            span2.innerText = dateSent ?? '';

            span1.appendChild(span11);
            span1.appendChild(span12);
            div1.appendChild(span1);
            div1.appendChild(document.createElement('br'));
            div1.appendChild(span2);

            this.msgDiv.appendChild(document.createElement('br'));
            this.msgDiv.appendChild(div1);
        }

        this.goBottom();
    }

    logSocketState() {
        if (!this.socket) {
            console.log('socket is null');
        } else {
            switch (this.socket.readyState) {
                case WebSocket.CLOSED:
                    console.log('socket is closed');
                    break;
                case WebSocket.CLOSING:
                    console.log('socket is closing');
                    break;
                case WebSocket.CONNECTING:
                    console.log('socket is connecting');
                    break;
                case WebSocket.OPEN:
                    console.log('socket is open');
                    break;
                default:
                    console.log('socket: unknown state');
                    break;
            }
        }
    }
}
