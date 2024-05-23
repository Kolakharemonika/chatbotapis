import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

interface Message {
  system: boolean;
  text: string;
}

@Component({
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})

export class ChatComponent {
  @ViewChild('chatBox', { static: false }) chatBox!: ElementRef;

  botInfo: any;
  bot_id: any;
  showWindow: Boolean = true;
  initialized: Boolean = true;
  messages: Message[] = [];
  userMessage: string = '';
  disableScrollDown: boolean = true;

  constructor(private dataService: DataService,
    private router: Router
  ) {
    this.messages.push({ system: true, text: "Hello! How can I assist you today?" });
    this.botInfo = {name: "SixAI Chatbot"};
    this.bot_id = 'bot1';
    this.botInfo.display_name ='SixAI Chatbot'
    this.botInfo.avatar= 'assets/images/bot-logo.png'
  }

  ngOnInit() {
  }

  gotoHome(){
    this.router.navigate(['landing'])
  }


  getAnswer() {

    const messageText = this.userMessage.trim();
    if (!messageText) {
      return;
    }
    this.messages.push({ system: false, text: messageText });
    this.userMessage = '';

    this.dataService.getAnswer({ question: messageText, bot_id: this.bot_id, input_language: 'EN', output_format: 'TEXT' }).then((resp: any) => {
      if (resp && resp.answer) {
        this.messages.push({ system: true, text: resp.answer });
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  scrollToBottom() {
     try {
      this.chatBox.nativeElement.scroll({
        top: this.chatBox.nativeElement.scrollHeight - this.chatBox.nativeElement.offsetHeight,
        left: 0,
        behavior: 'smooth'
      });

    } catch (err) {
      console.log('err-', err);
    }
  }
}
