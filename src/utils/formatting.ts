export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    // Ensure index is within bounds, handle potential log(0) edge case safely
    const i = (bytes <= 0) ? 0 : Math.floor(Math.log(bytes) / Math.log(k));
    const sizeIndex = Math.min(i, sizes.length - 1);
  
    return `${parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(dm))} ${sizes[sizeIndex]}`;
  };
  
  export const formatDate = (dateString: string | undefined | null): string => { // Allow null input too
      if (!dateString) return '-';
      try {
          // Basic check for ISO-like format before parsing
          if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateString)) {
               return dateString; // Return as is if not expected format
          }
          return new Date(dateString).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
          });
      } catch (e) {
          console.error("Error formatting date:", dateString, e); // Log error
          return '-';
      }
  };