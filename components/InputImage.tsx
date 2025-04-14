import { useCallback, useState } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

export const FileInput = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => {
      const newFiles = [...prev, ...acceptedFiles].slice(0, 2); // Limita a 2
      return newFiles;
    });
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const dropzone = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: true,
    maxFiles: 2,
  });

  return (
    <div className="flex gap-1">
      {files.length < 2 && <Input dropzone={dropzone} />}
      <div className="flex gap-4">
        {files.map((file, index) => (
          <ImagePreview key={index} file={file} onRemove={() => removeFile(index)} />
        ))}
      </div>
    </div>
  );
};

interface InputProps {
  dropzone: DropzoneState;
}

const Input = ({ dropzone }: InputProps) => {
  const { getRootProps, getInputProps, isDragActive } = dropzone;

  return (
    <div
      {...getRootProps()}
      className={`w-full h-32 rounded-lg border-dashed border-4 hover:border-gray-500 bg-gray-700 hover:bg-gray-600 transition-all p-8
      ${isDragActive ? 'border-blue-500' : 'border-gray-600'}`}
    >
      <label htmlFor="dropzone-file" className="cursor-pointer w-full h-full">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
          <FileDownloadOutlinedIcon
            className={`w-10 h-10 mb-3 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
          />
          {isDragActive ? (
            <p className="font-bold text-md text-blue-400">Solte para adicionar</p>
          ) : (
            <p className="text-md text-gray-400">Clique aqui ou arraste</p>
          )}
        </div>
      </label>
      <input {...getInputProps()} className="hidden" />
    </div>
  );
};

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

const ImagePreview = ({ file, onRemove }: ImagePreviewProps) => {
  const imageUrl = URL.createObjectURL(file);

  return (
    <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md border-2 border-gray-300">
      <img
        src={imageUrl}
        alt={file.name}
        className="object-cover w-full h-full"
      />
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
      >
        <CloseOutlinedIcon className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
};

export default FileInput;
