// src/utils/dateUtils.ts

/**
 * Formats a timestamp into a readable time string
 * 
 * @param timestamp - The timestamp to format (Date object or ISO string or Unix timestamp)
 * @returns Formatted time string (e.g. "10:30 AM" or "Yesterday" or "10/15/2024")
 */
export const formatTime = (timestamp: Date | string | number): string => {
  // Convert the input to a Date object
  const date =
    timestamp instanceof Date
      ? timestamp
      : new Date(timestamp);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Same‑day → show time
  if (date >= today) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Yesterday → show time instead of “Yesterday”
  if (date >= yesterday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Within last 7 days → show time instead of weekday
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 6);
  if (date >= lastWeek) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Older than a week → keep original format
  return date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
};
  
  /**
   * Formats a timestamp into a relative time string (e.g., "just now", "5m ago", "2h ago")
   * 
   * @param timestamp - The timestamp to format (Date object or ISO string or Unix timestamp)
   * @returns Formatted relative time string
   */
  export const formatTimeAgo = (timestamp: Date | string | number): string => {
    // Convert the timestamp to a Date object
    const date = timestamp instanceof Date 
      ? timestamp 
      : typeof timestamp === 'number'
        ? new Date(timestamp)
        : new Date(timestamp);
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Just now: less than 1 minute ago
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    // Minutes: 1m to 59m
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    
    // Hours: 1h to 23h
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }
    
    // Days: 1d to 6d
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
    
    // Weeks: 1w to 4w
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w ago`;
    }
    
    // Months: 1mo to 11mo
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}mo ago`;
    }
    
    // Years: 1y+
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}y ago`;
  };