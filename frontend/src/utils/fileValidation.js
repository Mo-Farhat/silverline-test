export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'video/mp4',
  'image/jpeg',
  'image/png'
];

export const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const validateFileType = (file) => {
  if (!file) return 'No file provided.';
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'Invalid file type. Allowed: PDF, MP4, JPG, PNG.';
  }
  return null;
};

export const validateFileSize = (file, maxMB = MAX_FILE_SIZE_MB) => {
  if (!file) return 'No file provided.';
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File size exceeds ${maxMB}MB limit.`;
  }
  return null;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
