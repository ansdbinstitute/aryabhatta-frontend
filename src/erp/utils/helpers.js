import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const getApiBaseUrl = () =>
  import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
export const PDF_MIME_TYPES = ['application/pdf'];
export const JPEG_MIME_TYPES = ['image/jpeg'];

// ─── Date Formatting ───

export const formatDate = (date, fmt = 'dd MMM yyyy') => {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? format(parsed, fmt) : '—';
};

export const formatDateTime = (date) => formatDate(date, 'dd MMM yyyy, hh:mm a');

export const formatTimeAgo = (date) => {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? formatDistanceToNow(parsed, { addSuffix: true }) : '—';
};

export const formatTime = (time) => {
  if (!time) return '—';
  // time might be "HH:mm" or "HH:mm:ss"
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

// ─── Currency Formatting ───

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount == null || isNaN(amount)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// ─── String Helpers ───

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '…';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getInitials = (firstName, lastName) => {
  const f = firstName?.charAt(0)?.toUpperCase() || '';
  const l = lastName?.charAt(0)?.toUpperCase() || '';
  return f + l || '?';
};

export const getFullName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ') || '—';
};

// ─── Number Helpers ───

export const formatPercentage = (value, decimals = 1) => {
  if (value == null || isNaN(value)) return '—';
  return `${Number(value).toFixed(decimals)}%`;
};

export const padNumber = (num, length = 3) => {
  return String(num).padStart(length, '0');
};

// ─── Query Helpers ───

export const buildStrapiFilters = (filters) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params[`filters[${key}][$eq]`] = value;
    }
  });
  return params;
};

export const buildStrapiPagination = (page = 1, pageSize = 25) => ({
  'pagination[page]': page,
  'pagination[pageSize]': pageSize,
});

export const buildStrapiSort = (field, order = 'asc') => ({
  sort: `${field}:${order}`,
});

// ─── File Helpers ───

export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export const validateUploadFile = (
  file,
  {
    maxSize = MAX_UPLOAD_SIZE_BYTES,
    allowedTypes = [],
    label = 'File',
    allowedLabel = 'the allowed format',
  } = {}
) => {
  if (!file) {
    return `${label} is required.`;
  }

  if (file.size > maxSize) {
    return `${label} must be under 10MB.`;
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `${label} must be ${allowedLabel}.`;
  }

  return null;
};

export const getMediaUrl = (file) => {
  const url = typeof file === 'string' ? file : file?.url;
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  return `${getApiBaseUrl()}${url}`;
};

// ─── Validation Helpers ───

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone?.replace(/\D/g, ''));
};

export const isValidAadhar = (aadhar) => {
  return /^\d{12}$/.test(aadhar?.replace(/\s/g, ''));
};

// ─── Misc ───

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
