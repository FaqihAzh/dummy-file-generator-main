# ByteSmith - Dummy File Generator

A professional web tool for Network Engineers and QA to generate byte-perfect dummy files for testing upload limits, timeouts, and network bandwidth.

## Features
- **Precise Size**: Generate files exactly to the byte (e.g., 5GB, 1048576 bytes).
- **Streaming Architecture**: Uses Node.js Streams to generate files on-the-fly without consuming server RAM.
- **Magic Bytes**: Injects correct file headers for PDF, DOCX, XLSX, JPG, MP3, etc., so OSs recognize them.
- **Modern UI**: Built with React, TypeScript, and Shadcn/Tailwind.

## Project Structure
- `client/`: React Frontend
- `server/`: Express/Node Backend

## Step-by-Step Instructions to Run

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed.

### 2. Run the Backend (Server)
The backend generates the file streams.

1. Open a terminal.
2. Navigate to the server folder: `cd server`
3. Install dependencies: `npm install`
4. Run the server: 
   ```bash
   npx ts-node src/index.ts
   ```
   You should see: `ByteSmith Backend running on port 3000`

### 3. Run the Frontend (Client)
The frontend provides the UI to configure the file.

1. Open a **new** terminal (keep the server running).
2. Navigate to the client folder: `cd client`
3. Install dependencies: `npm install`
4. Start the development server: 
   ```bash
   npm start
   ```
   (Or `npm run dev` depending on your scripts setup).

### 4. Usage
1. Open your browser at the local address (usually `http://localhost:3000` or `http://localhost:5173`).
2. Select size, unit, and file type.
3. Click "Generate & Download".
4. The file will download immediately.
