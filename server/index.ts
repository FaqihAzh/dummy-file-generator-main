/**
 * BACKEND SERVER
 * 
 * Instructions:
 * 1. Initialize a new project: `npm init -y`
 * 2. Install dependencies: `npm install express cors`
 * 3. Install dev dependencies: `npm install --save-dev typescript @types/express @types/node @types/cors ts-node`
 * 4. Run: `npx ts-node index.ts`
 */

import express from 'express';
import cors from 'cors';
import { Buffer } from 'buffer';

const app = express();
const PORT = 3000;

app.use(cors());

// Map of file signatures (Magic Bytes)
const SIGNATURES: Record<string, Buffer> = {
    'pdf': Buffer.from('%PDF-1.5\n'),
    // ZIP header (common for DOCX, XLSX, PPTX)
    'docx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    'xlsx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    'pptx': Buffer.from([0x50, 0x4B, 0x03, 0x04]),
    // JPEG
    'jpg': Buffer.from([0xFF, 0xD8, 0xFF]),
    // MP3 (MPEG-1 Layer 3 with ID3v2 container usually starts differently, 
    // but FFFB is the frame sync for MPEG audio. We'll use a standard ID3v2 tag start for broader compatibility if needed, 
    // but simple MPEG Sync is 0xFF 0xFB)
    'mp3': Buffer.from([0xFF, 0xFB]),
    'txt': Buffer.alloc(0),
};

const CHUNK_SIZE = 64 * 1024; // 64KB chunks for efficient streaming
const ZERO_BUFFER = Buffer.alloc(CHUNK_SIZE, 0);

// Using 'any' for req and res to avoid TypeScript errors with missing properties in the current environment
app.get('/api/v1/generate', async (req: any, res: any) => {
    try {
        const sizeParam = req.query.size as string;
        const typeParam = req.query.type as string;
        const nameParam = req.query.name as string;

        if (!sizeParam || !typeParam) {
            res.status(400).send('Missing size or type parameters');
            return;
        }

        const totalSize = parseInt(sizeParam, 10);
        if (isNaN(totalSize) || totalSize <= 0) {
            res.status(400).send('Invalid size parameter');
            return;
        }

        const extension = typeParam.toLowerCase();
        const filename = nameParam || `dummy_${totalSize}_bytes.${extension}`;
        
        // Get magic bytes
        const signature = SIGNATURES[extension] || Buffer.alloc(0);

        // Set Headers
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', totalSize);

        // 1. Write Signature
        let written = 0;
        
        // If signature is larger than requested size, slice it
        if (signature.length >= totalSize) {
            res.write(signature.subarray(0, totalSize));
            res.end();
            return;
        }

        res.write(signature);
        written += signature.length;

        // 2. Stream Padding (Zeros)
        let remaining = totalSize - written;

        // Define a function to write chunks respecting backpressure
        const streamPadding = () => {
            while (remaining > 0) {
                const sizeToRequest = Math.min(remaining, CHUNK_SIZE);
                
                // If the needed chunk is exactly our pre-allocated zero buffer, use it.
                // Otherwise slice it (only happens on the very last chunk).
                const bufferToWrite = sizeToRequest === CHUNK_SIZE 
                    ? ZERO_BUFFER 
                    : ZERO_BUFFER.subarray(0, sizeToRequest);

                const canContinue = res.write(bufferToWrite);
                
                written += sizeToRequest;
                remaining -= sizeToRequest;

                // Handle Backpressure
                if (!canContinue) {
                    // Wait for drain event
                    res.once('drain', streamPadding);
                    return;
                }
            }

            if (remaining === 0) {
                res.end();
            }
        };

        streamPadding();

    } catch (error) {
        console.error('Generation Error:', error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        } else {
            res.end();
        }
    }
});

app.listen(PORT, () => {
    console.log(`ByteSmith Server running on http://localhost:${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/api/v1/generate?size=1048576&type=pdf`);
});