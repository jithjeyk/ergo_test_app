import { useState, useEffect, useCallback } from "react";

// More accurate type definition using the built-in Intl.DateTimeFormatOptions
type UseCurrentDateOptions = {
  format?: Intl.DateTimeFormatOptions;
  locale?: string;
  updateInterval?: number; // in milliseconds
  liveUpdate?: boolean;
};

const defaultOptions: UseCurrentDateOptions = {
  format: {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
  locale: "en-US",
  updateInterval: 60000, // Update every minute
  liveUpdate: true,
};

export const useCurrentDate = (options?: UseCurrentDateOptions) => {
  const [currentDate, setCurrentDate] = useState<string>("");
  const [rawDate, setRawDate] = useState<Date>(new Date());

  // Merge options only once if they don't change
  const mergedOptions = { ...defaultOptions, ...options };

  // Memoize the format function to avoid unnecessary re-renders
  const formatDate = useCallback(() => {
    const formatted = new Intl.DateTimeFormat(
      mergedOptions.locale,
      mergedOptions.format
    ).format(rawDate);

    setCurrentDate(formatted);
  }, [rawDate, mergedOptions.locale, JSON.stringify(mergedOptions.format)]);

  // Update the date and format it
  useEffect(() => {
    formatDate();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (mergedOptions.liveUpdate) {
      intervalId = setInterval(() => {
        setRawDate(new Date());
      }, mergedOptions.updateInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [formatDate, mergedOptions.liveUpdate, mergedOptions.updateInterval]);

  // Return both formatted string and Date object for flexibility
  return {
    formattedDate: currentDate,
    dateObject: rawDate,
    refresh: () => setRawDate(new Date()),
  };
};

// Convenience hook with default formatting (for the dashboard header)
export const useDashboardDate = () => {
  return useCurrentDate();
};

// Hook with time-only formatting
export const useCurrentTime = (
  options?: Omit<UseCurrentDateOptions, "format">
) => {
  return useCurrentDate({
    ...options,
    format: {
      hour: "2-digit",
      minute: "2-digit",
      second: "numeric",
    },
    updateInterval: 1000, // Update every second
  });
};

// Hook with date-only formatting
export const useShortDate = (
  options?: Omit<UseCurrentDateOptions, "format">
) => {
  return useCurrentDate({
    ...options,
    format: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    liveUpdate: false, // No need for live updates
  });
};
