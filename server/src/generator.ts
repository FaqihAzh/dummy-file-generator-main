import { Buffer } from 'buffer';
import { SIGNATURES, FOOTERS, CHUNK_SIZE, ZERO_BUFFER } from './constants';

export const streamGeneratedFile = async (res: any, size: number, type: string, filename: string) => {
    try {
        const extension = type.toLowerCase();
        const signature = SIGNATURES[extension] || Buffer.alloc(0);
        const footer = FOOTERS[extension] || Buffer.alloc(0);

        // Set Headers agar browser tahu ini file download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', size);

        // Cek jika ukuran file lebih kecil dari header+footer
        if (size <= signature.length + footer.length) {
            res.write(signature.subarray(0, size));
            res.end();
            return;
        }

        let written = 0;

        // 1. Tulis Header
        res.write(signature);
        written += signature.length;

        // 2. Hitung sisa untuk padding (Total - Header - Footer)
        let remaining = size - signature.length - footer.length;

        // 3. Stream Padding (Isi Tengah)
        while (remaining > 0) {
            const sizeToRequest = Math.min(remaining, CHUNK_SIZE);
            const bufferToWrite = sizeToRequest === CHUNK_SIZE 
                ? ZERO_BUFFER 
                : ZERO_BUFFER.subarray(0, sizeToRequest);

            const canContinue = res.write(bufferToWrite);
            written += sizeToRequest;
            remaining -= sizeToRequest;

            // Handle Backpressure
            if (!canContinue) {
                await new Promise<void>(resolve => res.once('drain', resolve));
            }
        }

        // 4. Tulis Footer (Agar valid)
        res.write(footer);
        written += footer.length;

        res.end();
    } catch (error) {
        console.error('Streaming Error:', error);
        if (!res.headersSent) res.end(); 
    }
};