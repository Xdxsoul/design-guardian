import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

const FileUploadButton = ({ onFileSelect }: FileUploadProps) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event) => {
    
    const file = event.target.files[0];
    
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Please select a GLB file');
      return;
    }
    if (file.size > 1024 * 1024) {
      alert('The file must be less than 1 MB');
      return;
    }
    // Si pasa todas las validaciones
    console.log('Archivo válido:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type
    });

    onFileSelect(file);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleButtonClick}
        className="cursor-pointer"
      >
        <Upload />
        Import Model
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </>
  );
};

export default FileUploadButton;