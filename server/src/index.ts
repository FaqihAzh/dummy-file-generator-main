import express from 'express';
import cors from 'cors';
import { streamGeneratedFile } from './generator';

const app = express();
const PORT = 3000;

app.use(cors());

// Using 'any' for req and res to avoid TypeScript errors with missing properties in the current environment
app.get('/api/v1/generate', async (req: any, res: any) => {
    const sizeParam = req.query.size as string;
    const typeParam = req.query.type as string;
    const nameParam = req.query.name as string;

    console.log(`[${new Date().toISOString()}] Received request: Size=${sizeParam}, Type=${typeParam}, Name=${nameParam}`);

    if (!sizeParam || !typeParam) {
        res.status(400).send('Missing required parameters: size, type');
        return;
    }

    const totalSize = parseInt(sizeParam, 10);
    if (isNaN(totalSize) || totalSize <= 0) {
        res.status(400).send('Invalid size parameter');
        return;
    }

    const extension = typeParam.toLowerCase();
    const filename = nameParam || `dummy_${totalSize}_bytes.${extension}`;

    try {
        await streamGeneratedFile(res, totalSize, extension, filename);
        console.log(`[${new Date().toISOString()}] Successfully streamed ${totalSize} bytes for ${filename}`);
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Error streaming file:`, err);
    }
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', version: '1.0.0' });
});

app.listen(PORT, () => {
    console.log(`---------------------------------------------`);
    console.log(`ByteSmith Backend running on port ${PORT}`);
    console.log(`Architecture: Monorepo/Server`);
    console.log(`Endpoint: http://localhost:${PORT}/api/v1/generate`);
    console.log(`---------------------------------------------`);
});