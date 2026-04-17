export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}