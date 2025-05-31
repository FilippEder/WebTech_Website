import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Conversation } from '../../models/chat/conversation.model';
import { Message } from '../../models/chat/message.model';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
/**
 * @class ChatService
 * @remarks
 * Manages chat functionalities including socket connections, message retrieval, and sending.
 */
export class ChatService {
  private socket!: Socket;
  private socketUrl =  'http://localhost:3000';
  private apiUrl =  'http://localhost:3000';

  constructor(private http: HttpClient) {
    this.connectSocket();
  }
  /**
   * @method connectSocket (ChatService)
   * @remarks
   * Establishes a socket connection for real-time communication.
   */
  private connectSocket(): void {
    this.socket = io(this.socketUrl);
  }
  /**
   * @method getConversation (ChatService)
   * @remarks
   * Retrieves conversation details based on a given request ID.
   */
  getConversation(request_id: string): Observable<Conversation> {
    return this.http.get<any>(`${this.apiUrl}/conversations?request_id=${request_id}`).pipe(
      map(conv => ({
        conversation_id: conv.conversation_id,
        request_id: conv.request_id,
        created_at: conv.created_at,
        updated_at: conv.updated_at
      }))
    );
  }


  createConversation(requestId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/conversations`, { listingId: requestId });
  }


  /**
   * @method getAllMessages (ChatService)
   * @remarks
   * Retrieves all messages for a specific conversation for display in the chat window.
   */
// Mappt die Liste der Nachrichten
getAllMessages(conversationId: number): Observable<Message[]> {
  return this.http.get<any[]>(`${this.apiUrl}/messages?conversationId=${conversationId}`).pipe(
    map(messages => messages.map(msg => ({
      id: msg.message_id,                  // Mapping: message_id → id
      conversationId: msg.conversation_id, // Mapping: conversation_id → conversationId
      senderId: msg.sender_id,             // Mapping: sender_id → senderId
      content: msg.content,
      sentAt: msg.sent_at                  // Mapping: sent_at → sentAt
    })))
  );
}
  /**
   * @method sendMessage (ChatService)
   * @remarks
   * Sends a new message to the backend and maps the response to the expected format.
   */
  // Beim Senden wandeln wir das Angular-Objekt (mit content) in das Payload-Format (mit messageContent) um
 sendMessage(message: Message): Observable<Message> {
  // Hier werden die Felder hart kodiert: senderId = "1" und conversationId = "1"
  const payload = {
    conversationId: message.conversationId,  // immer Conversation (Listing) 1
    senderId: message.senderId,        // immer User ID 1
    messageContent: message.content,
    sentAt: message.sentAt
  };

  return this.http.post<any>(`${this.apiUrl}/messages`, payload).pipe(
    map(msg => ({
      id: msg.message_id,
      conversationId: msg.conversation_id,
      senderId: msg.sender_id,
      content: msg.content,
      sentAt: msg.sent_at
    }))
  );
}
  /**
   * @method subscribeToNewMessages (ChatService)
   * @remarks
   * Subscribes to real-time incoming messages via socket for a specific conversation.
   */
  // Hier transformieren wir auch eingehende Socket-Nachrichten (falls sie im Snake-Case kommen)
  subscribeToNewMessages(conversationId: number): Observable<Message> {
    // Trete dem Raum (Room) bei, damit nur Nachrichten aus dieser Konversation empfangen werden 🚀
    this.socket.emit('join', conversationId);
    const messageSubject = new Subject<Message>();
    this.socket.on('chat message', (msg: any) => {
      // Überprüfe sowohl camelCase als auch snake_case, falls nötig
      if (msg.conversationId === conversationId || msg.conversation_id === conversationId) {
        const mappedMsg: Message = {
          id: msg.message_id || msg.id,
          conversationId: msg.conversation_id || msg.conversationId,
          senderId: msg.sender_id || msg.senderId,
          content: msg.content,
          sentAt: msg.sent_at || msg.sentAt
        };
        messageSubject.next(mappedMsg);
      }
    });
    return messageSubject.asObservable();
  }
}

