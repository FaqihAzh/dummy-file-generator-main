import React, { useState, useMemo } from 'react';
import { Download, FileWarning, Server, Zap, HardDrive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Select, Button } from './components/ui';
import { FileType, FileUnit, API_BASE_URL } from './types';
import { calculateTotalBytes, formatBytes } from './utils';

const App: React.FC = () => {
  const [size, setSize] = useState<number>(10);
  const [unit, setUnit] = useState<FileUnit>(FileUnit.MB);
  const [fileType, setFileType] = useState<FileType>(FileType.PDF);
  const [filename, setFilename] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalBytes = useMemo(() => calculateTotalBytes(size, unit), [size, unit]);

  const handleDownload = () => {
    setError(null);
    if (size <= 0) {
      setError("Size must be greater than 0");
      return;
    }

    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        size: totalBytes.toString(),
        type: fileType,
      });

      if (filename.trim()) {
        queryParams.append('name', filename.trim());
      }

      const downloadUrl = `${API_BASE_URL}/generate?${queryParams.toString()}`;
      
      // Create a temporary link element to trigger the download.
      // This is more reliable than window.location.href in SPAs and avoids
      // browser security blocks that occur with setTimeout.
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Programmatically click the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset loading state after a short delay to allow the request to register
      setTimeout(() => setIsLoading(false), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to initiate download.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
             <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
               <Zap className="h-8 w-8 text-white" />
             </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">ByteSmith</h1>
            <p className="text-slate-500 font-medium">Precision Dummy File Generator</p>
          </div>
        </div>

        {/* Main Generator Card */}
        <Card className="border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-blue-600" />
              Configuration
            </CardTitle>
            <CardDescription>
              Generate byte-perfect files for network testing.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
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
                  className="font-mono text-lg"
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
            <div className="bg-slate-50/80 rounded-lg p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-500 font-medium">Formatted Size:</span>
                 <span className="font-mono font-semibold text-blue-600">{formatBytes(totalBytes)}</span>
              </div>
              <div className="h-px bg-slate-200/50 w-full" />
              <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-500 font-medium">Raw Bytes:</span>
                 <span className="font-mono text-slate-600">{totalBytes.toLocaleString()} bytes</span>
              </div>
            </div>

            {error && (
               <div className="flex items-center space-x-3 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md animate-in fade-in slide-in-from-top-1">
                 <FileWarning className="h-4 w-4 shrink-0" />
                 <span className="font-medium">{error}</span>
               </div>
            )}
          </CardContent>

          <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all" 
              size="lg" 
              onClick={handleDownload} 
              isLoading={isLoading}
            >
              {!isLoading && <Download className="mr-2 h-4 w-4" />}
              {isLoading ? 'Downloading...' : 'Generate & Download'}
            </Button>
          </CardFooter>
        </Card>

        {/* Server Status Info */}
        <div className="flex items-start space-x-3 text-xs text-slate-500 px-4">
           <Server className="h-4 w-4 mt-0.5 shrink-0 opacity-50" />
           <p>Ensure the backend server is running at <code className="bg-slate-200 px-1 rounded text-slate-700">localhost:3000</code>. The download streams directly from the server to your disk to save RAM.</p>
        </div>

      </div>
    </div>
  );
};

export default App;