import { AssistantConversation } from '../features/assistant/components/Sidebar';

const ASSISTANT_CONVERSATIONS_KEY = 'assistant_conversations';

export function saveConversationsToStorage(conversations: AssistantConversation[]) {
  localStorage.setItem(ASSISTANT_CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function loadConversationsFromStorage(): AssistantConversation[] {
  const data = localStorage.getItem(ASSISTANT_CONVERSATIONS_KEY);
  if (!data) return [{ id: '1', name: 'Current Chat', messages: [] }];
  try {
    return JSON.parse(data);
  } catch {
    return [{ id: '1', name: 'Current Chat', messages: [] }];
  }
}

export function clearConversationsFromStorage() {
  localStorage.removeItem(ASSISTANT_CONVERSATIONS_KEY);
}
