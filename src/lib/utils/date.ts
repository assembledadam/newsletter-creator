import { formatDistanceToNow, format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

export function formatRelativeTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

export function formatDateTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, "d MMMM yyyy 'at' HH:mm");
}

export function getWeekDateRange(): string {
  const today = new Date();
  const isSunday = today.getDay() === 0;
  
  // If it's Sunday, use the current week
  // Otherwise, use the previous week
  const targetWeek = isSunday ? today : subWeeks(today, 1);
  
  const start = startOfWeek(targetWeek, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(targetWeek, { weekStartsOn: 1 }); // Sunday
  
  // If months are different
  if (format(start, 'MMM') !== format(end, 'MMM')) {
    return `${format(start, 'd MMM')}-${format(end, 'd MMM')}`;
  }
  // If same month
  return `${format(start, 'd')}-${format(end, 'd')} ${format(end, 'MMM')}`;
}

// Keeping getPreviousWeekDateRange for backward compatibility
export const getPreviousWeekDateRange = getWeekDateRange;