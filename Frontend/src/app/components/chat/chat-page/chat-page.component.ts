import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../services/chat/chat.service';
import { Conversation } from '../../../models/chat/conversation.model';
import { Message } from '../../../models/chat/message.model';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  imports: [ChatWindowComponent, ChatInputComponent]
})
/**
 * @class ChatPageComponent
 * @remarks
 * Combines the chat window and input components to manage the overall chat conversation.
 */
export class ChatPageComponent implements OnInit, OnDestroy {
  conversation!: Conversation;
  messages: Message[] = [];
  requestId!: string;
  private refreshIntervalId: any; // for the setInterval

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}
  /**
   * @method ngOnInit (ChatPageComponent)
   * @remarks
   * Initializes the chat page by loading conversation details based on the route parameters.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('requestId');
      if (id) {
        this.requestId = id;
        this.loadConversation();
      }
    });
  }
  /**
   * @method loadConversation (ChatPageComponent)
   * @remarks
   * Loads the conversation details and starts periodic refreshes of the chat messages.
   */
  loadConversation(): void {
    this.chatService.getConversation(this.requestId).subscribe(conv => {
      this.conversation = conv;
      // Start the refresh-loop every 300ms:
      this.refreshIntervalId = setInterval(() => {
        this.refreshMessages();
      }, 300);

      // Additionally: refresh messages on new socket messages:
      this.chatService.subscribeToNewMessages(conv.conversation_id).subscribe(newMsg => {
        console.log("DEBUG: New message received:", JSON.stringify(newMsg));
        this.refreshMessages();
      });
    });
  }
  /**
   * @method refreshMessages (ChatPageComponent)
   * @remarks
   * Updates the chat window with the latest messages from the conversation.
   */
  refreshMessages(): void {
    if (this.conversation && this.conversation.conversation_id) {
      this.chatService.getAllMessages(this.conversation.conversation_id).subscribe(msgs => {
        this.messages = msgs;
      });
    }
  }
  /**
   * @method sendMessage (ChatPageComponent)
   * @remarks
   * Sends a new chat message and refreshes the message list afterwards.
   */
  sendMessage(message: Message): void {
    if (!this.conversation || !this.conversation.conversation_id) return;
    message.conversationId = this.conversation.conversation_id;
    message.senderId = '1'; // Hardcoded for testing
    this.chatService.sendMessage(message).subscribe(() => {
      this.refreshMessages();
    });
  }
  /**
   * @method ngOnDestroy (ChatPageComponent)
   * @remarks
   * Cleans up resources by clearing the refresh interval when the component is destroyed.
   */
  ngOnDestroy(): void {
    // Stop the interval-loop when the component is destroyed
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }
}
