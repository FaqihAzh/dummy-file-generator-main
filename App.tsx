import React, { useState, useMemo } from 'react';
import { Download, FileWarning, Info, Server, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Select, Button } from './components/ui/Components';
import { FileType, FileUnit, API_BASE_URL } from './types';
import { calculateTotalBytes, formatBytes } from './utils/byteUtils';

const App: React.FC = () => {
  const [size, setSize] = useState<number>(10);
  const [unit, setUnit] = useState<FileUnit>(FileUnit.MB);
  const [fileType, setFileType] = useState<FileType>(FileType.PDF);
  const [filename, setFilename] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalBytes = useMemo(() => calculateTotalBytes(size, unit), [size, unit]);

  const handleDownload = async () => {
    setError(null);
    if (size <= 0) {
      setError("Size must be greater than 0");
      return;
    }

    setIsLoading(true);

    // Simulate API delay for better UX before redirecting
    setTimeout(() => {
      try {
        const queryParams = new URLSearchParams({
          size: totalBytes.toString(),
          type: fileType,
        });

        if (filename.trim()) {
          queryParams.append('name', filename.trim());
        }

        const downloadUrl = `${API_BASE_URL}/generate?${queryParams.toString()}`;
        
        // In a real browser environment, this triggers the download
        window.location.href = downloadUrl;

        // Reset loading state after a short delay (since we can't easily track download progress via href)
        setTimeout(() => setIsLoading(false), 2000);
      } catch (err) {
        setError("Failed to initiate download.");
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
             <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
               <Zap className="h-6 w-6 text-primary-foreground" />
             </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">ByteSmith</h1>
          <p className="text-slate-500">Precision Dummy File Generator</p>
        </div>

        {/* Main Generator Card */}
        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Generate byte-perfect files for network testing.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* File Size Input */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input 
                  id="size" 
                  type="number" 
                  min="1" 
                  value={size} 
                  onChange={(e) => setSize(Number(e.target.value))} 
                  placeholder="10"
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

            {/* File Type Selection */}
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

            {/* Optional Filename */}
            <div className="space-y-2">
              <Label htmlFor="filename">Filename (Optional)</Label>
              <Input 
                id="filename" 
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder={`test-file.${fileType}`}
              />
            </div>

            {/* Info Summary Box */}
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100 mt-4">
              <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-500 font-medium">Total Size:</span>
                 <span className="font-mono font-bold text-slate-700">{formatBytes(totalBytes)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                 <span className="text-slate-500 font-medium">Exact Bytes:</span>
                 <span className="font-mono text-slate-600">{totalBytes.toLocaleString()} bytes</span>
              </div>
            </div>

            {error && (
               <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                 <FileWarning className="h-4 w-4" />
                 <span>{error}</span>
               </div>
            )}
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleDownload} 
              isLoading={isLoading}
            >
              {!isLoading && <Download className="mr-2 h-4 w-4" />}
              Generate & Download
            </Button>
          </CardFooter>
        </Card>

        {/* Server Status Warning */}
        <div className="flex items-start space-x-3 text-sm text-muted-foreground bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
           <Server className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
           <div className="space-y-1">
             <p className="font-medium text-slate-700">Backend Required</p>
             <p>This tool relies on a local Node.js server to stream the files. Ensure the server provided in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">server/index.ts</code> is running on port 3000.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;