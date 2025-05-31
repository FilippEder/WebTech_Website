import { Component, Output, EventEmitter } from '@angular/core';
import { Message } from '../../../models/chat/message.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
/**
 * @class ChatInputComponent
 * @remarks
 * Provides an input field for composing and sending new chat messages.
 */
export class ChatInputComponent {
  messageContent: string = '';
  @Output() messageSent: EventEmitter<Message> = new EventEmitter<Message>();

  constructor() {}
  /**
   * @method onSubmit (ChatInputComponent)
   * @remarks
   * Validates and sends the chat message if the input is not empty.
   */
  onSubmit(): void {
    if (this.messageContent.trim()) {
      // Erstelle ein neues Message-Objekt. (Die conversationId wird idealerweise vom Parent gesetzt.)
      const newMessage: Message = {
        id: '', // wird vom Backend generiert
        conversationId: 1, // Platzhalter – der Parent (ChatPageComponent) weiß, zu welcher Konversation
        senderId: 'currentUser', // Beispielhaft; in einer echten App wird die aktuelle Nutzer-ID verwendet
        content: this.messageContent,
        sentAt: new Date()
      };
      this.messageSent.emit(newMessage);
      this.clearInput();
    }
  }
  /**
   * @method clearInput (ChatInputComponent)
   * @remarks
   * Clears the input field after a message is sent.
   */
  clearInput(): void {
    this.messageContent = '';
  }
}
