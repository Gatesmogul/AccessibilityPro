/**
 * Formats a numeric value or a dirty string into a standardized currency presentation.
 * Handles cleaning up raw string amounts (e.g., "$1,250,000" -> 1250000) before parsing.
 * 
 * @param value - The number or string representing the financial balance
 * @param locale - Optional BCP 47 language tag (defaults to system locale)
 * @param currency - Target currency standard format (defaults to 'USD')
 */
export const formatCurrency = (
  value: number | string,
  locale = 'en-US',
  currency = 'USD'
): string => {
  if (value === undefined || value === null) return '';
  
  let numericValue: number;

  if (typeof value === 'string') {
    // Strip everything except numbers, decimal points, and negative indicators
    const cleanedString = value.replace(/[^0-9.-]/g, '');
    numericValue = parseFloat(cleanedString) || 0;
  } else {
    numericValue = value;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

/**
 * Parses timestamp string variations or Date instances into compact, readable layouts.
 * 
 * @param date - Date object, ISO string, or Unix epoch integer
 * @param formatType - 'short' (2026-07-06), 'long' (July 6, 2026), or 'relative' (e.g., "Just now")
 */
export const formatDate = (
  date: Date | string | number,
  formatType: 'short' | 'long' | 'relative' = 'short'
): string => {
  if (!date) return '';
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return 'Invalid Date';

  if (formatType === 'short') {
    return d.toISOString().split('T')[0];
  }

  if (formatType === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Relative Context formatting (e.g., "3 hours ago")
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

/**
 * Truncates text fields cleanly across dashboard layouts to prevent container overflows.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Safely extracts unique reference identifiers or file extensions from uploaded documents.
 */
export const getFileExtension = (fileName: string | null): string => {
  if (!fileName) return '';
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Returns consistent, semantic styling configuration matrices for application badges
 * based on operational asset or transaction logic states.
 */
export const getStatusTheme = (status: string) => {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case 'verified':
    case 'approved':
    case 'sell':
    case 'active':
      return { textColor: '#34C759', backgroundColor: '#E8F9EE', dotColor: '#34C759' };
    case 'pending':
    case 'audit':
    case 'lease':
      return { textColor: '#FF9500', backgroundColor: '#FFF5E6', dotColor: '#FF9500' };
    case 'rent':
    case 'process':
      return { textColor: '#007AFF', backgroundColor: '#E6F2FF', dotColor: '#007AFF' };
    case 'rejected':
    case 'cancelled':
    case 'failed':
      return { textColor: '#FF3B30', backgroundColor: '#FFEBEA', dotColor: '#FF3B30' };
    default:
      return { textColor: '#636366', backgroundColor: '#F2F2F7', dotColor: '#8E8E93' };
  }
};