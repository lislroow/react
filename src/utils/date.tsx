
export const formatDate = function(date: string): string {
  if (date) {
    new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(date));
  }
  return '';
} 