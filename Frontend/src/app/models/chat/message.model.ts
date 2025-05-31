export interface Message {
  id: string;
  conversationId: number;
  senderId: string;
  content: string;
  sentAt: Date;
}
// Grund: Definiert die Struktur einer Chatnachricht für Typsicherheit.
