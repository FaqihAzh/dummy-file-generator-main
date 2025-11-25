export enum FileUnit {
  B = 'B',
  KB = 'KB',
  MB = 'MB',
  GB = 'GB'
}

export enum FileType {
  PDF = 'pdf',
  DOCX = 'docx',
  XLSX = 'xlsx',
  PPTX = 'pptx',
  JPG = 'jpg',
  MP3 = 'mp3',
  TXT = 'txt'
}

export interface GenerationConfig {
  size: number;
  unit: FileUnit;
  type: FileType;
  filename?: string;
}

export const API_BASE_URL = 'http://localhost:3000/api/v1';