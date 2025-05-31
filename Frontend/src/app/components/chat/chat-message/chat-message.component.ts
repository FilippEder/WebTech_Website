// src/app/chat/components/chat-message/chat-message.component.ts
import { Component, Input } from '@angular/core';
import { Message } from '../../../models/chat/message.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
/**
 * @class ChatMessageComponent
 * @remarks
 * Renders a single chat message including its content and formatted timestamp.
 */
export class ChatMessageComponent {
  @Input() message!: Message;
  /**
   * @method formatTimestamp (ChatMessageComponent)
   * @remarks
   * Formats the message's timestamp into a human-readable time string.
   */
  formatTimestamp(): string {
    return new Date(this.message.sentAt).toLocaleTimeString();
  }
}

