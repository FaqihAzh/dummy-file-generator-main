import React, { useState, useMemo } from 'react';
import { Download, FileWarning, Zap, HardDrive, CheckCircle2 } from 'lucide-react';
import { Card, Input, Label, Select, Button } from './components/ui';
import { FileType, FileUnit, API_BASE_URL } from './types'; // Pastikan API_BASE_URL ada di types.ts
import { calculateTotalBytes, formatBytes } from './utils';

const App: React.FC = () => {
  const [size, setSize] = useState<number>(10);
  const [unit, setUnit] = useState<FileUnit>(FileUnit.MB);
  const [fileType, setFileType] = useState<FileType>(FileType.PDF);
  const [filename, setFilename] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalBytes = useMemo(() => calculateTotalBytes(size, unit), [size, unit]);

  const handleDownload = async () => {
    setError(null);
    setSuccess(false);
    
    if (size <= 0) {
      setError("Size must be greater than 0");
      return;
    }

    setIsLoading(true);

    try {
      // Nama file final
      const finalFilename = filename.trim() || `dummy_${totalBytes}_bytes.${fileType}`;
      
      // --- PERBAIKAN UTAMA: DIRECT LINK ---
      // Jangan pakai fetch()! Pakai URL langsung agar browser menghandle download stream.
      const downloadUrl = `${API_BASE_URL}/generate?size=${totalBytes}&type=${fileType}&name=${encodeURIComponent(finalFilename)}`;
      
      console.log("Navigating to:", downloadUrl);
      
      // Ini akan memicu dialog download browser
      window.location.href = downloadUrl;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Gagal memulai download.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-br from-zinc-100 to-zinc-300 rounded-2xl flex items-center justify-center shadow-2xl shadow-zinc-900/50">
              <Zap className="h-8 w-8 text-zinc-900" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-100">ByteSmith</h1>
            <p className="text-zinc-400">Precision Dummy File Generator</p>
          </div>
        </div>

        {/* Main Card */}
        <Card>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-zinc-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">Configuration</h2>
                <p className="text-sm text-zinc-400">Generate byte-perfect test files</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Size Input */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input 
                    id="size" 
                    type="number" 
                    min="1" 
                    value={size} 
                    onChange={(e) => setSize(Number(e.target.value))} 
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as FileUnit)}
                    options={[
                      { label: 'Bytes', value: FileUnit.B },
                      { label: 'KB', value: FileUnit.KB },
                      { label: 'MB', value: FileUnit.MB },
                      { label: 'GB', value: FileUnit.GB },
                    ]}
                  />
                </div>
              </div>

              {/* File Type */}
              <div className="space-y-2">
                <Label htmlFor="type">File Type</Label>
                <Select 
                  id="type"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as FileType)}
                  options={[
                    { label: 'PDF Document (.pdf)', value: FileType.PDF },
                    { label: 'Word Document (.docx)', value: FileType.DOCX },
                    { label: 'Excel Spreadsheet (.xlsx)', value: FileType.XLSX },
                    { label: 'PowerPoint (.pptx)', value: FileType.PPTX },
                    { label: 'JPEG Image (.jpg)', value: FileType.JPG },
                    { label: 'MP3 Audio (.mp3)', value: FileType.MP3 },
                    { label: 'Text File (.txt)', value: FileType.TXT },
                  ]}
                />
              </div>

              {/* Filename */}
              <div className="space-y-2">
                <Label htmlFor="filename">Filename (Optional)</Label>
                <Input 
                  id="filename" 
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder={`test-file.${fileType}`}
                />
              </div>

              <div className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Formatted Size</span>
                  <span className="font-mono font-semibold text-zinc-100">{formatBytes(totalBytes)}</span>
                </div>
                <div className="h-px bg-zinc-700" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Raw Bytes</span>
                  <span className="font-mono text-sm text-zinc-300">{totalBytes.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-lg">
                  <FileWarning className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 text-sm text-green-400 bg-green-950/30 border border-green-900/50 p-3 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Request sent! Downloading...</span>
                </div>
              )}
            </div>

            <Button 
              className="w-full h-12 text-base font-semibold"
              onClick={handleDownload} 
              isLoading={isLoading}
            >
              {!isLoading && <Download className="mr-2 h-5 w-5" />}
              {isLoading ? 'Processing...' : 'Generate & Download'}
            </Button>
          </div>
        </Card>
        
        <div className="text-center text-xs text-zinc-500 px-4">
          Powered by Node.js Streams. Capable of generating multi-GB files.
        </div>
      </div>
    </div>
  );
};

export default App;