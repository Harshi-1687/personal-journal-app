export const formatDate = (dateStr) => {
  if (!dateStr) return 'No Date';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};
