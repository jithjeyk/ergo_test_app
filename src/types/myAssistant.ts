export interface AssistantMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface AssistantConversation {
  id: string;
  name: string;
  messages?: AssistantMessage[];
  createdAt?: number;
  updatedAt?: number;
}

export interface AssistantState {
  conversations: AssistantConversation[];
  activeId: string | null; // Use null instead of undefined for clarity
}
