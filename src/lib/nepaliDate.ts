import NepaliDate from 'nepali-date-converter';

/**
 * Convert a date string or Date object to Nepali (Bikram Sambat) date format
 * @param date - Date string (ISO format) or Date object
 * @param format - Format string (default: 'YYYY MMMM DD')
 * @returns Formatted Nepali date string
 */
export const toNepaliDate = (date: string | Date, format: string = 'YYYY MMMM DD'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    const nepaliDate = new NepaliDate(dateObj);
    return nepaliDate.format(format);
  } catch (error) {
    console.error('Error converting to Nepali date:', error);
    return 'Invalid Date';
  }
};

/**
 * Convert a date to short Nepali date format (YYYY-MM-DD)
 */
export const toNepaliDateShort = (date: string | Date): string => {
  return toNepaliDate(date, 'YYYY-MM-DD');
};

/**
 * Convert a date to long Nepali date format with time
 */
export const toNepaliDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    const nepaliDate = new NepaliDate(dateObj);
    const timeStr = dateObj.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${nepaliDate.format('YYYY MMMM DD')} ${timeStr}`;
  } catch (error) {
    console.error('Error converting to Nepali datetime:', error);
    return 'Invalid Date';
  }
};

/**
 * Get relative Nepali date (e.g., "Today", "Yesterday", or formatted date)
 */
export const toNepaliDateRelative = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateObj.toDateString() === today.toDateString()) {
      return 'आज (Today)';
    }
    if (dateObj.toDateString() === yesterday.toDateString()) {
      return 'हिजो (Yesterday)';
    }
    return toNepaliDate(date, 'YYYY MMMM DD');
  } catch (error) {
    return toNepaliDate(date);
  }
};

/**
 * Get current Nepali date
 */
export const getCurrentNepaliDate = (format: string = 'YYYY MMMM DD'): string => {
  return toNepaliDate(new Date(), format);
};