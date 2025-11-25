import { Buffer } from 'buffer';

// Header (Magic Bytes)
export const SIGNATURES: Record<string, Buffer> = {
    'pdf': Buffer.from('%PDF-1.5\n'),
    'docx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    'xlsx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    'pptx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    'jpg': Buffer.from([0xFF, 0xD8, 0xFF]),
    'mp3': Buffer.from([0xFF, 0xFB]),
    'txt': Buffer.alloc(0),
};

// Footer (Trailer) - PENTING agar file tidak corrupt
export const FOOTERS: Record<string, Buffer> = {
    'pdf': Buffer.from('\n%%EOF'),      // Penutup wajib PDF
    'jpg': Buffer.from([0xFF, 0xD9]),   // Penutup wajib JPG
    'mp3': Buffer.alloc(0),
    'docx': Buffer.alloc(0),
    'xlsx': Buffer.alloc(0),
    'pptx': Buffer.alloc(0),
    'txt': Buffer.alloc(0),
};

export const CHUNK_SIZE = 64 * 1024; 
export const ZERO_BUFFER = Buffer.alloc(CHUNK_SIZE, 0);