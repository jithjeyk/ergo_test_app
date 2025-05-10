import { useState, useEffect } from "react";

type DateFormatOptions = {
  weekday?: "long" | "short" | "narrow";
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  timeZoneName?: "short" | "long";
};

type UseCurrentDateOptions = {
  format?: DateFormatOptions;
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

  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    const formatDate = () => {
      const formatted = rawDate.toLocaleDateString(
        mergedOptions.locale,
        mergedOptions.format as Intl.DateTimeFormatOptions
      );
      setCurrentDate(formatted);
    };

    formatDate();

    let intervalId: NodeJS.Timeout | null = null;

    if (mergedOptions.liveUpdate) {
      intervalId = setInterval(() => {
        const newDate = new Date();
        setRawDate(newDate);
        formatDate();
      }, mergedOptions.updateInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [rawDate, mergedOptions]);

  // Return both formatted string and Date object for flexibility
  return {
    formattedDate: currentDate,
    dateObject: rawDate,
    refresh: () => {
      const newDate = new Date();
      setRawDate(newDate);
    },
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
