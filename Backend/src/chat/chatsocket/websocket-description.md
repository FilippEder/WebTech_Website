@startuml
participant Client as "Client (Browser)"
participant HTTP as "HTTP-Server (Express)"
participant SocketIO as "Socket.IO"
participant ChatSocket as "ChatSocket"
participant PostService as "post.messages.service.js"
participant MessageModel as "MessageModel"
participant DB as "PostgreSQL"

' Aufbau der Verbindung
Client ->> HTTP: Initiale HTTP-Anfrage
HTTP ->> SocketIO: Upgrade zu WebSocket
SocketIO ->> ChatSocket: initSocket() wird ausgeführt
ChatSocket ->> Client: Verbindung etabliert

' Client sendet eine Chatnachricht
Client ->> ChatSocket: sendMessage (Event: "chat message")
ChatSocket ->> ChatSocket: handleClientMessage(socket, message)

' Nachricht in der Datenbank speichern
ChatSocket ->> PostService: postMessage({ conversationId, senderId, messageContent })
PostService ->> MessageModel: insertMessage(messageData)
MessageModel ->> DB: Ausführung: INSERT INTO chat_messages (...)
DB -->> MessageModel: Rückgabe des Ergebnisses
MessageModel -->> PostService: Bestätigung, dass Nachricht gespeichert wurde
PostService -->> ChatSocket: Erfolgsmeldung

' Nachricht an alle Clients senden
ChatSocket ->> SocketIO: broadcastMessage(message)
SocketIO ->> Client: Versand des "chat message" Events an alle Clients
@enduml


### Struktur der Klasse:
// ChatSocket.js

/**
 * Klasse: ChatSocket
 * -------------------
 * Zusammenfassung:
 * Diese Klasse kapselt die WebSocket-Funktionalität der Chat-Anwendung.
 * Sie ermöglicht die Echtzeitkommunikation und stellt Methoden bereit, um
 * Nachrichten an einzelne oder alle Clients zu senden.
 *
 * Warum diese Klasse?
 * - Trennung der WebSocket-Logik von der REST-API.
 * - Ermöglicht skalierbare Echtzeitkommunikation (z.B. mit Socket.IO).
 * - Integriert sich in die bestehende Datenbanklogik (über post.messages.service.js und MessageModel),
 *   um Chatnachrichten zu speichern.
 *
 * Abhängigkeiten:
 * - HTTP-Server (Express) zum Starten des Socket.IO-Servers. (Node.js: https://nodejs.org/api/http.html)
 * - Socket.IO für WebSocket-Kommunikation (Docs: https://socket.io/docs/v4/)
 * - post.messages.service.js und MessageModel für Datenbankzugriffe.
 */
class ChatSocket {
  constructor(httpServer) {
    // httpServer: Der HTTP-Server (z.B. von Express), an den Socket.IO gebunden wird.
    // Wir setzen 'this.io' zunächst auf null, um einen definierten Initialwert zu haben.
    // Dieser Wert wird in initSocket() durch die Socket.IO-Instanz ersetzt.
    this.httpServer = httpServer;
    this.io = null; // Siehe: https://socket.io/docs/v4/server-instance/ (Initialisierung von Socket.IO)
  }

  /**
   * initSocket()
   * -------------
   * Initialisiert den WebSocket-Server und bindet ihn an den HTTP-Server.
   *
   * Zweck:
   * - Erzeugt die Socket.IO-Instanz und registriert globale Event-Handler (z.B. 'connection').
   *
   * Abhängigkeiten:
   * - this.httpServer: Zum Starten des Socket.IO-Servers.
   *
   * Siehe Dokumentation: 
   * Socket.IO Server-Initialisierung: https://socket.io/docs/v4/server-instance/
   */
  initSocket() {
    // Beispiel-Implementierung:
    // const socketIo = require('socket.io'); // Docs: https://socket.io/docs/v4/
    // this.io = socketIo(this.httpServer);
    // this.io.on('connection', (socket) => this.handleNewConnection(socket));
  }

  /**
   * handleNewConnection(socket)
   * ---------------------------
   * Event-Handler, der bei einer neuen Client-Verbindung ausgeführt wird.
   *
   * Parameter:
   * - socket: Das Socket.IO-Objekt des neu verbundenen Clients.
   *
   * Zweck:
   * - Registriert weitere, client-spezifische Events (z.B. 'chat message', 'disconnect').
   *
   * Abhängigkeit:
   * - socket.on(): Methode aus Socket.IO, um Events zu abonnieren.
   *   Dokumentation: https://socket.io/docs/v4/server-socket-instance/#socket-on-eventname-callback
   */
  handleNewConnection(socket) {
    // TODO: Registriere individuelle Events für den neuen Client
    // Beispiel:
    // socket.on('chat message', (msg) => this.handleClientMessage(socket, msg));
  }

  /**
   * sendMessageToClient(socket, message)
   * --------------------------------------
   * Sendet eine Nachricht gezielt an einen einzelnen Client.
   *
   * Parameter:
   * - socket: Das Socket.IO-Objekt des Zielclients.
   * - message: Ein Objekt, das die Nachrichtendaten enthält (z.B. { conversationId, senderId, messageContent }).
   *
   * Zweck:
   * - Direkte Kommunikation mit einem einzelnen Client.
   *
   * Hinweis:
   * - Wenn die Nachricht an mehrere (z.B. 4/10) Clients gesendet werden soll, muss diese Methode
   *   für jeden einzelnen Client aufgerufen werden. Alternativ kann man die Methode broadcastMessageToAllClients nutzen.
   *
   * Abhängigkeit:
   * - socket.emit(): Methode aus Socket.IO, um Daten an einen Client zu senden.
   *   Dokumentation: https://socket.io/docs/v4/server-socket-instance/#socket-emit-eventname-args
   */
  sendMessageToClient(socket, message) {
    // TODO: Implementiere das Senden der Nachricht an den Client
    // Beispiel:
    // socket.emit('chat message', message);
  }

  /**
   * broadcastMessageToAllClients(message)
   * --------------------------------------
   * Sendet eine Nachricht an alle verbundenen Clients.
   *
   * Parameter:
   * - message: Ein Objekt, das die Nachrichtendaten enthält.
   *
   * Zweck:
   * - Broadcastet eine Nachricht an alle Teilnehmer der Chat-Anwendung.
   *
   * Abhängigkeit:
   * - this.io.emit(): Methode aus Socket.IO, um ein Event an alle verbundenen Clients zu senden.
   *   Dokumentation: https://socket.io/docs/v4/server-instance/#io-emit-eventname-args
   */
  broadcastMessageToAllClients(message) {
    // TODO: Implementiere das Senden der Nachricht an alle Clients
    // Beispiel:
    // this.io.emit('chat message', message);
  }

  /**
   * handleClientMessage(socket, message)
   * --------------------------------------
   * Verarbeitet eine eingehende Nachricht von einem Client.
   *
   * Parameter:
   * - socket: Das Socket.IO-Objekt des sendenden Clients.
   * - message: Ein Objekt mit den Eigenschaften { conversationId, senderId, messageContent }.
   *
   * Zweck:
   * - Speichert die empfangene Nachricht in der Datenbank über post.messages.service.js (welches MessageModel nutzt)
   * - Leitet die Nachricht anschließend an alle relevanten Clients weiter.
   *
   * Abhängigkeiten:
   * - post.messages.service.js: Verwendet die Funktion postMessage, um die Nachricht in der Datenbank zu persistieren.
   *   Siehe z.B. https://github.com/your-repo/your-project (Dokumentation eurer Services)
   * - MessageModel: Führt die tatsächliche DB-Operation (insertMessage) aus.
   *
   * Hinweis:
   * - Nach erfolgreichem Speichern kann die Nachricht z.B. mittels broadcastMessageToAllClients verteilt werden.
   */
  handleClientMessage(socket, message) {
    // TODO: Verarbeite die empfangene Nachricht
    // 1. Nachricht speichern: postMessage({ conversationId, senderId, messageContent })
    // 2. Nachricht an andere Clients senden: this.broadcastMessageToAllClients(message)
  }
}

module.exports = ChatSocket;

