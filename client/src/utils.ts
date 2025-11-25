import { FileType, FileUnit } from "./types";

export const calculateTotalBytes = (size: number, unit: FileUnit): number => {
  const multipliers: Record<FileUnit, number> = {
    [FileUnit.B]: 1,
    [FileUnit.KB]: 1024,
    [FileUnit.MB]: 1024 * 1024,
    [FileUnit.GB]: 1024 * 1024 * 1024,
  };
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

export const getFileSignature = (type: FileType): Uint8Array => {
  const signatures: Record<FileType, number[]> = {
    [FileType.PDF]: [0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x35, 0x0A], // %PDF-1.5\n
    [FileType.DOCX]: [0x50, 0x4B, 0x03, 0x04], // ZIP header
    [FileType.XLSX]: [0x50, 0x4B, 0x03, 0x04], // ZIP header
    [FileType.PPTX]: [0x50, 0x4B, 0x03, 0x04], // ZIP header
    [FileType.JPG]: [0xFF, 0xD8, 0xFF, 0xE0], // JPEG
    [FileType.MP3]: [0xFF, 0xFB], // MPEG
    [FileType.TXT]: [], // No signature
  };
  return new Uint8Array(signatures[type]);
};

export const generateFile = (size: number, type: FileType, filename: string) => {
  const signature = getFileSignature(type);
  const signatureSize = signature.length;
  
  // Create array with signature + padding
  const fileData = new Uint8Array(size);
  fileData.set(signature, 0);
  // Rest is already zeros (padding)
  
  // Create blob and download
  const blob = new Blob([fileData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `dummy_${size}_bytes.${type}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};