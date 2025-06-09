import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, Check } from 'lucide-react';
import type { FileType, UploadedFile } from '../../types';

interface FileUploadProps {
  type: FileType;
  title: string;
  description: string;
  onFileUpload: (file: UploadedFile) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ type, title, description, onFileUpload }) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploadError(null);
    setUploading(true);

    const file = acceptedFiles[0];
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      type,
      size: file.size,
      progress: 0,
      file,
    };
    setUploadedFile(newFile);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/upload/pdf/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      // If backend returns JSON, parse it here
      // const data = await response.json();

      // Mark upload as complete
      setUploadedFile(prev => (prev ? { ...prev, progress: 100 } : null));
      onFileUpload(newFile);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed');
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  }, [type, onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card p-5 transition-all duration-200 hover:shadow-md">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">{description}</p>

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
                    ${isDragActive
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600'
                    }`}
        >
          <input {...getInputProps()} disabled={uploading} />
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className={`h-10 w-10 mb-2 ${isDragActive ? 'text-primary-500' : 'text-neutral-400 dark:text-neutral-500'}`} />
            <p className="text-sm font-medium mb-1">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">or</p>
            <button className="btn-secondary text-sm py-1.5 px-3" disabled={uploading}>Browse Files</button>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">Supports PDF, TXT (Max 10MB)</p>
          </div>
          {uploadError && (
            <p className="text-red-600 mt-2 text-sm">Error: {uploadError}</p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mr-2" />
              <div className="max-w-[180px]">
                <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>

            <button
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Remove file"
              disabled={uploading}
            >
              <X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>

          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-1">
            <div
              className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadedFile.progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {uploadedFile.progress < 100
                ? `Uploading... ${uploadedFile.progress}%`
                : 'Upload complete'}
            </span>
            {uploadedFile.progress === 100 && (
              <span className="flex items-center text-xs text-success-600 dark:text-success-500">
                <Check className="h-3 w-3 mr-1" /> Complete
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
