const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const daysFromToday = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.round((startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / 86400000);
};

export const isSameChatDay = (firstValue, secondValue) => {
  const first = new Date(firstValue);
  const second = new Date(secondValue);
  return !Number.isNaN(first.getTime()) && !Number.isNaN(second.getTime()) &&
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
};

export const formatChatDate = (value) => {
  const days = daysFromToday(value);
  if (days === null) return '';
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days > 1 && days < 7) return new Date(value).toLocaleDateString(undefined, { weekday: 'long' });
  return new Date(value).toLocaleDateString(undefined, {
    year: new Date(value).getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatChatPreviewDate = (value) => {
  const days = daysFromToday(value);
  if (days === null) return '';
  if (days === 0) return new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  if (days === 1) return 'Yesterday';
  if (days > 1 && days < 7) return new Date(value).toLocaleDateString(undefined, { weekday: 'long' });
  return new Date(value).toLocaleDateString(undefined, {
    year: new Date(value).getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
};