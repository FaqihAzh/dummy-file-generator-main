import { Buffer } from 'buffer';

// Magic Bytes signatures for common file types
export const SIGNATURES: Record<string, Buffer> = {
    'pdf': Buffer.from('%PDF-1.5\n'),
    // ZIP header (common for DOCX, XLSX, PPTX)
    'docx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    'xlsx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    'pptx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    // JPEG
    'jpg': Buffer.from([0xFF, 0xD8, 0xFF]),
    // MP3 (Standard MPEG Frame Sync)
    'mp3': Buffer.from([0xFF, 0xFB]),
    // Text (Empty)
    'txt': Buffer.alloc(0),
};

// 64KB chunks for efficient streaming
export const CHUNK_SIZE = 64 * 1024; 
export const ZERO_BUFFER = Buffer.alloc(CHUNK_SIZE, 0);
