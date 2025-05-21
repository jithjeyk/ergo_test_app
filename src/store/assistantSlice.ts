import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AssistantState, AssistantConversation } from "../types/myAssistant";

const initialState: AssistantState = {
  conversations: [],
  activeId: null,
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    addConversation(state, action: PayloadAction<AssistantConversation>) {
      state.conversations.push(action.payload);
      state.activeId = action.payload.id;
    },
    selectConversation(state, action: PayloadAction<string>) {
      state.activeId = action.payload;
    },
    renameConversation(state, action: PayloadAction<AssistantConversation>) {
      const conv = state.conversations.find((c) => c.id === action.payload.id);
      if (conv) conv.name = action.payload.name;
    },
    deleteConversation(state, action: PayloadAction<string>) {
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload
      );
      if (state.activeId === action.payload) {
        state.activeId =
          state.conversations.length > 0 ? state.conversations[0].id : null;
      }
    },
    setConversations(state, action: PayloadAction<AssistantConversation[]>) {
      state.conversations = action.payload;
      if (action.payload.length > 0 && !state.activeId) {
        state.activeId = action.payload[0].id; // Only set if activeId is not already defined
      } else if (action.payload.length === 0) {
        state.activeId = null; // Reset if no conversations exist
      }
    },
  },
});

export const {
  addConversation,
  selectConversation,
  renameConversation,
  deleteConversation,
  setConversations,
} = assistantSlice.actions;

export default assistantSlice.reducer;
