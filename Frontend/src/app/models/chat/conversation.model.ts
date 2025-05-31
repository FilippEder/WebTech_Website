export interface Conversation {
  conversation_id: number;
  request_id: number;
  created_at: string; // or Date, if you prefer parsing it
  updated_at: string; // or Date
}
