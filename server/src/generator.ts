import { Response } from 'express';
import { Buffer } from 'buffer';
import { SIGNATURES, CHUNK_SIZE, ZERO_BUFFER } from './constants';

/**
 * Streams a generated file with precise size and correct header signature.
 */
// Using 'any' for res to avoid TypeScript errors with missing properties in the current environment
export const streamGeneratedFile = async (res: any, size: number, type: string, filename: string) => {
    try {
        const extension = type.toLowerCase();
        const signature = SIGNATURES[extension] || Buffer.alloc(0);

        // Set HTTP Headers
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', size);

        let written = 0;

        // 1. Write Signature (Magic Bytes)
        // If the requested size is smaller than the signature, we truncate the signature
        if (signature.length >= size) {
            res.write(signature.subarray(0, size));
            res.end();
            return;
        }

        res.write(signature);
        written += signature.length;

        // 2. Stream Padding (Zeros)
        let remaining = size - written;

        // Use a loop with drain event handling for backpressure
        while (remaining > 0) {
            const sizeToRequest = Math.min(remaining, CHUNK_SIZE);
            
            // Reuse the zero buffer if full chunk, otherwise slice
            const bufferToWrite = sizeToRequest === CHUNK_SIZE 
                ? ZERO_BUFFER 
                : ZERO_BUFFER.subarray(0, sizeToRequest);

            const canContinue = res.write(bufferToWrite);
            
            written += sizeToRequest;
            remaining -= sizeToRequest;

            // Handle Backpressure: If write returns false, wait for 'drain'
            if (!canContinue) {
                await new Promise<void>(resolve => res.once('drain', resolve));
            }
        }

        res.end();
    } catch (error) {
        console.error('Streaming Error:', error);
        // If headers aren't sent, we can send an error response. 
        // If they were sent, the stream will just break, which is expected behavior for network fail.
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error During Generation');
        } else {
            res.end(); 
        }
    }
};