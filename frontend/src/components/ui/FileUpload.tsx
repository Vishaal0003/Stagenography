import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  preview?: string | null;
}

export function FileUpload({
  onFileSelect,
  accept = '.png,.jpg,.jpeg',
  disabled = false,
  preview = null,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      const file = e.dataTransfer.files?.[0];
      if (file && accept.split(',').some((ext) => file.name.endsWith(ext.trim()))) {
        onFileSelect(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        'relative border-2 border-dashed border-dark-border rounded-lg p-8 text-center cursor-pointer transition-all',
        !disabled &&
          'hover:border-accent-orange hover:bg-dark-input',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {preview ? (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-64 mx-auto rounded-lg border border-dark-border"
          />
          <p className="text-sm text-text-muted">Click to change image</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="p-4 bg-accent-orange/10 rounded-full">
              <Upload className="w-8 h-8 text-accent-orange" />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-text-dark">
              Drag and drop your image
            </p>
            <p className="text-sm text-text-muted">
              or click to browse (PNG, JPG, JPEG)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
