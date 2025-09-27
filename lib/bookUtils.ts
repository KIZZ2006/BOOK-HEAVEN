// Utility functions for book-related operations

const colorToClassMap: Record<string, string> = {
  '#A3D9B1': 'book-cover-green',
  '#F0D9A7': 'book-cover-gold',
  '#D1EBD1': 'book-cover-mint',
  '#E8F5E8': 'book-cover-light-mint',
  '#F8F0E0': 'book-cover-light-gold',
  '#E6F3FF': 'book-cover-blue',
  '#FFF2E6': 'book-cover-orange',
  '#F0E6FF': 'book-cover-purple',
};

export const getBookCoverClassName = (coverColor: string, baseClassName: string = '') => {
  const colorClass = colorToClassMap[coverColor] || 'book-cover';
  return `${colorClass} ${baseClassName}`.trim();
};

// Fallback for dynamic colors not in the predefined set
export const getBookCoverStyle = (coverColor: string): React.CSSProperties => {
  if (colorToClassMap[coverColor]) {
    return {};
  }
  return {
    '--book-cover-color': coverColor,
  } as React.CSSProperties;
};
