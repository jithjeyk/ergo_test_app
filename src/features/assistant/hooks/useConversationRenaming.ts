import { useState } from "react";

export const useConversationRenaming = (
  onRename: (id: string, newName: string) => void
) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleStartRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
  };

  const handleCompleteRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== renameValue) {
      setRenameValue(trimmed);
    }
    if (trimmed) {
      onRename(id, trimmed);
    }
    setRenamingId(null);
  };

  const handleCancelRename = () => {
    setRenamingId(null);
  };

  return {
    renamingId,
    renameValue,
    setRenameValue,
    handleStartRename,
    handleCompleteRename,
    handleCancelRename,
  };
};
