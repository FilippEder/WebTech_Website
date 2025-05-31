// src/app/chat/components/chat-window/chat-window.component.ts
import {
  Component,
  Input,
  AfterViewChecked,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { Message } from '../../../models/chat/message.model';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  imports: [CommonModule, ChatMessageComponent]
})
/**
 * @class ChatWindowComponent
 * @remarks
 * Displays the chat messages in a scrollable window and ensures automatic scrolling for new messages.
 */
export class ChatWindowComponent implements OnChanges, AfterViewChecked {
  @Input() messages: Message[] = [];
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  private shouldScroll = false;
  /**
   * @method ngOnChanges (ChatWindowComponent)
   * @remarks
   * Detects changes to the input messages and flags the component for scrolling.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.shouldScroll = true;
    }
  }
  /**
   * @method ngAfterViewChecked (ChatWindowComponent)
   * @remarks
   * Automatically scrolls to the bottom of the chat window after the view is updated.
   */
  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }
  /**
   * @method scrollToBottom (ChatWindowComponent)
   * @remarks
   * Scrolls the chat container to the bottom to display the most recent messages.
   */

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}

