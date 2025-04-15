import { useCallback, useEffect, useState } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { randomUUID } from 'crypto';

export type Banner = {
  id_usuario: string;
  imagebase64: string;
  id?: number; // importante para deletar
};

interface FileInputProps {
  banners: Banner[];
  user_id: number | undefined;
}

export const FileInput = ({ banners: initialBanners, user_id }: FileInputProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);

  useEffect(() => {
    setBanners(initialBanners);
  }, [initialBanners]);

  useEffect(() => {
    
  const updateBanners = async () => {
      if (files.length > 0 || banners.length > 0) {

        const base64Images = await Promise.all(files.map(convertToBase64));

        const updatedBanners = base64Images.map((base64Image) => ({
          id: crypto.randomUUID(),
          id_usuario: user_id,
          imagebase64: base64Image,
        }));

        updatedBanners.map(async (banner) => {
          await fetch("http://localhost:5000/banners", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(banner),
          });
        })

      }
  };
    updateBanners();
  }, [files]);
  

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 2 - banners.length));
  }, [banners.length]);

  const dropzone = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: true,
    maxFiles: 2,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeBanner = async (bannerId?: number, index?: number) => {
    if (!bannerId && index !== undefined) {
      // Fallback: remove do state mesmo sem ID
      setBanners((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/banners/${bannerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== bannerId));
        console.log('Banner removido do db.json');
      } else {
        console.error('Erro ao remover o banner:', response.status);
      }
    } catch (error) {
      console.error('Erro na requisição DELETE:', error);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="flex gap-1">
      {(banners.length + files.length) < 2 && (
        <Input dropzone={dropzone} fileCount={files.length + banners.length} />
      )}

      <div className="flex gap-4">
        {banners.length > 0 && banners.map((banner, index) => (
          <ImagePreview
            key={`banner-${banner.id || index}`}
            file={banner.imagebase64}
            onRemove={() => removeBanner(banner.id, index)}
          />
        ))}

        {files.length > 0 && files.map((file, index) => (
          <ImagePreview
            key={`file-${index}`}
            file={file}
            onRemove={() => removeFile(index)}
          />
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
          {isDragActive ? (
            <p className="font-bold text-md text-blue-400">Solte para adicionar</p>
          ) : (
            <p className="text-md text-gray-400">Clique ou arraste aqui</p>
          )}
        </div>
      </label>
      <input {...getInputProps()} className="hidden" />
    </div>
  );
};

interface ImagePreviewProps {
  file: File | string;
  onRemove?: () => void;
}

const ImagePreview = ({ file, onRemove }: ImagePreviewProps) => {
  let imageUrl: string = '';

  if (typeof file === 'string') {
    imageUrl = file;
  } else if (file instanceof File) {
    try {
      imageUrl = URL.createObjectURL(file);
    } catch (err) {
      console.error('Erro ao criar URL do arquivo:', err);
    }
  }

  return (
    <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md border-2 border-gray-300">
      <img
        src={imageUrl}
        alt={file instanceof File ? file.name : 'img'}
        className="object-cover w-full h-full"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
        >
          <CloseOutlinedIcon className="w-4 h-4 text-red-500" />
        </button>
      )}
    </div>
  );
};

export default FileInput;
