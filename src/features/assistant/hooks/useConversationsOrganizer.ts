import { AssistantConversation } from "../../../types/myAssistant";
import { dateRangeUtils } from "../../../utils/dateUtils";

export const useConversationsOrganizer = (
  conversations: AssistantConversation[],
  searchTerm: string
) => {
  const filtered = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groups: { [label: string]: AssistantConversation[] } = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    Older: [],
  };

  filtered.forEach((conv) => {
    let date: Date;
    if (conv.messages && conv.messages.length > 0) {
      const lastMsg = conv.messages[conv.messages.length - 1];
      const timestamp = lastMsg.timestamp
        ? Number(new Date(lastMsg.timestamp))
        : Number(conv.id);
      date = new Date(timestamp);
    } else {
      const idAsTimestamp = Number(conv.id);
      date = isNaN(idAsTimestamp) ? new Date() : new Date(idAsTimestamp);
    }

    if (dateRangeUtils.isToday(date)) groups["Today"].push(conv);
    else if (dateRangeUtils.isYesterday(date)) groups["Yesterday"].push(conv);
    else if (dateRangeUtils.isThisWeek(date)) groups["This Week"].push(conv);
    else groups["Older"].push(conv);
  });

  return groups;
};
