'use strict';

const socketIo = require('socket.io');
const postMessageService = require('../../services/chat/messages/post.messages.service');
/**
 * ChatSocket
 * ----------
 * Diese Klasse kapselt die WebSocket-Kommunikation (z. B. mit Socket.IO) für die Chat-Anwendung.
 * Sie initialisiert den Socket.IO-Server, registriert alle nötigen Event-Handler und verarbeitet eingehende Nachrichten.
 *
 * Besonderheiten:
 * - Die Methode "handleClientMessage" validiert die eingehende Nachricht, speichert sie in der DB
 *   (über this.postMessage, die in Tests stubbar ist) und broadcastet anschließend die originale Nachricht.
 * - Durch die Zuweisung von "this.postMessage" im Konstruktor kann in den Tests der tatsächliche DB-Zugriff umgangen werden.
 *
 * Siehe:
 * - Socket.IO Server-Instanz: https://socket.io/docs/v4/server-instance/
 * - Socket.IO socket.emit: https://socket.io/docs/v4/server-socket-instance/#socket-emit-eventname-args
 */
class ChatSocket {
  /**
   * Konstruktor
   * @param {http.Server} httpServer - Der HTTP-Server, an den der Socket.IO-Server gebunden wird.
   */
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.io = null; // wird in initSocket() initialisiert
    // Standardmäßig die echte postMessage-Funktion verwenden,
    // kann in Tests per Stub überschrieben werden.
    this.postMessage = postMessageService.postMessage;
  }

  /**
   * initSocket()
   * -------------
   * Initialisiert den Socket.IO-Server und bindet ihn an den HTTP-Server.
   * Registriert den globalen "connection"-Event-Handler.
   *
   * Siehe: https://socket.io/docs/v4/server-instance/
   */
  initSocket() {
    // Socket.IO initialisieren und CORS konfigurieren:
    this.io = socketIo(this.httpServer, {
      cors: {
        origin: "http://localhost:4200", // Erlaube den Zugriff von deiner Angular-Anwendung
        methods: ["GET", "POST"]
      }
    });
    this.io.on('connection', (socket) => this.handleNewConnection(socket));
  }


  /**
   * handleNewConnection(socket)
   * ---------------------------
   * Wird aufgerufen, wenn sich ein neuer Client verbindet.
   * Registriert weitere, client-spezifische Event-Handler, z. B. für "join", "chat message" und "disconnect".
   *
   * Siehe: https://socket.io/docs/v4/server-socket-instance/#socket-on-eventname-callback
   *
   * @param {Socket} socket - Das Socket.IO-Objekt des verbundenen Clients.
   */
  handleNewConnection(socket) {
    console.log(`Client connected: ${socket.id} 🚀`);
    // 🚀 Neuer Listener: Raumbeitritt anhand conversationId
    socket.on('join', (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room ${conversationId} 🚀`);
    });
    socket.on('chat message', (message) => this.handleClientMessage(socket, message));
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id} 😢`);
    });
  }

  /**
   * sendMessageToClient(socket, message)
   * --------------------------------------
   * Sendet eine Nachricht gezielt an einen einzelnen Client.
   *
   * Hinweis:
   * - Zum Senden an mehrere Clients muss diese Methode für jeden Client einzeln aufgerufen werden.
   *
   * Siehe: https://socket.io/docs/v4/server-socket-instance/#socket-emit-eventname-args
   *
   * @param {Socket} socket - Das Ziel-Socket-Objekt.
   * @param {Object} message - Das Nachrichtenobjekt.
   */
  sendMessageToClient(socket, message) {
    socket.emit('chat message', message);
  }

  /**
   * broadcastMessageToAllClientsWithConversation(message)
   * --------------------------------------------------------
   * Sendet eine Nachricht an alle verbundenen Clients, die dem gleichen Raum (conversationId) angehören.
   *
   * Siehe: https://socket.io/docs/v4/server-instance/#io-to-room
   *
   * @param {Object} message - Das Nachrichtenobjekt, das broadcastet werden soll.
   */
  broadcastMessageToAllClientsWithConversation(message) {
    // 🚀 Sende an alle Clients im Raum der conversationId
    this.io.to(message.conversationId).emit('chat message', message);
  }

  /**
   * handleClientMessage(socket, message)
   * --------------------------------------
   * Verarbeitet eine eingehende Nachricht eines Clients:
   * 1. Validiert, ob alle erforderlichen Felder (conversationId, senderId, messageContent) vorhanden sind.
   * 2. Speichert die Nachricht in der Datenbank mittels this.postMessage.
   * 3. Broadcastet die originale Nachricht an alle Clients im gleichen Raum.
   * 4. Sendet eine Erfolgsmeldung an den absendenden Client.
   *
   * Falls Pflichtfelder fehlen oder ein Fehler in der DB-Operation auftritt, wird ein Fehler geworfen.
   *
   * @param {Socket} socket - Das Socket.IO-Objekt des sendenden Clients.
   * @param {Object} message - Das eingehende Nachrichtenobjekt.
   * @returns {Promise<void>}
   */
  async handleClientMessage(socket, message) {
    // Validierung der Pflichtfelder:
    if (!message || !message.conversationId || !message.senderId || !message.messageContent) {
      throw new Error('Missing required fields in message. Required: conversationId, senderId, messageContent.');
    }

    try {
      // Persistiere die Nachricht in der Datenbank.
      const savedMessage = await this.postMessage({
        conversationId: message.conversationId,
        senderId: message.senderId,
        messageContent: message.messageContent
      });

      // 🚀 Broadcastet wird die originale Nachricht nur an Clients im gleichen Raum.
      this.broadcastMessageToAllClientsWithConversation(message);

      // 🚀 Optional: Sende dem absendenden Client eine Erfolgsmeldung inkl. des DB-Ergebnisses.
      this.sendMessageToClient(socket, { status: 'success', message: savedMessage });
    } catch (error) {
      console.error('Error handling client message:', error);
      throw error;
    }
  }
}

module.exports = ChatSocket;

