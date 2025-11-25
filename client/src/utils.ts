import { FileUnit } from './types';

export const calculateTotalBytes = (size: number, unit: FileUnit): number => {
  const multipliers: Record<FileUnit, number> = {
    [FileUnit.B]: 1,
    [FileUnit.KB]: 1024,
    [FileUnit.MB]: 1024 * 1024,
    [FileUnit.GB]: 1024 * 1024 * 1024,
  };
  // Ensure integer
  return Math.floor(size * multipliers[unit]);
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};