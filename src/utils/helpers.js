// Utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
