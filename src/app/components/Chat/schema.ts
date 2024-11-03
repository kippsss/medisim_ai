export interface Message {
  role: 'user' | 'assistant';
  content: string;
  audioId?: string;
}
