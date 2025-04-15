import { useCallback, useState } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';
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

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (userId: string) => {
    if (files.length > 0) {
      const base64Images = await Promise.all(files.map(convertToBase64));
      const bannersData = base64Images.map(base64Image => ({
        id_usuario: userId,
        imagebase64: base64Image,
      }));

      // Aqui você fará a chamada para o seu json-server
      console.log('Dados para enviar:', bannersData);
      // Exemplo de chamada fetch para o json-server (adapte a sua URL)
      try {
        const response = await fetch('http://localhost:3000/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannersData),
        });
        if (response.ok) {
          console.log('Banners enviados com sucesso!');
          setFiles([]); // Limpar os arquivos após o envio
        } else {
          console.error('Erro ao enviar os banners:', response.status);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    } else {
      console.warn('Nenhuma imagem selecionada para enviar.');
    }
  };

  return (
    <div className="flex gap-1">
      {files.length < 2 && <Input dropzone={dropzone} fileCount={files.length} />}
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
  fileCount: number;
}

const Input = ({ dropzone, fileCount }: InputProps) => {
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
          {fileCount === 0 && (
            isDragActive ? (
              <p className="font-bold text-md text-blue-400">Solte para adicionar</p>
            ) : (
              <p className="text-md text-gray-400">Clique ou arraste aqui</p>
            )
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