import { useCallback, useEffect, useState } from 'react';
import { DropzoneState, useDropzone } from 'react-dropzone';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

export type Banner = {
  id_usuario: number;
  imagebase64: string;
  id?: number;
};

interface FileInputProps {
  banners: Banner[];
  user_id: number | undefined;
}

export const FileInput = ({ banners: initialBanners, user_id }: FileInputProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [banner, setBanner] = useState<Banner | null>(initialBanners[0] || null);

  useEffect(() => {
    if (initialBanners.length > 0) {
      setBanner(initialBanners[0]);
    }
  }, [initialBanners]);

  useEffect(() => {
    const uploadBanner = async () => {
      if (file) {
        const base64 = await convertToBase64(file);
        const newBanner: Banner = {
          id_usuario: user_id!,
          imagebase64: base64,
        };

        const res = await fetch("http://localhost:5000/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBanner),
        });

        if (res.ok) {
          const saved = await res.json();
          setBanner(saved);
          setFile(null); // limpa o file local após salvar
        }
      }
    };
    uploadBanner();
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setBanner(null); // substitui banner atual visualmente
    }
  }, []);

  const dropzone = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    multiple: false,
    maxFiles: 1,
  });

  const removeImage = async () => {
    if (banner?.id) {
      try {
        await fetch(`http://localhost:5000/banners/${banner.id}`, { method: "DELETE" });
      } catch (error) {
        console.error("Erro ao excluir banner:", error);
      }
    }
    setBanner(null);
    setFile(null);
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
    <div className="flex gap-4">
      {!file && !banner && <Input dropzone={dropzone} />}
      {(file || banner) && (
        <ImagePreview
          file={file || banner?.imagebase64 || ""}
          onRemove={removeImage}
        />
      )}
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
      className={`w-40 h-32 rounded-lg border-dashed border-4 bg-gray-700 hover:bg-gray-600 transition-all p-8 
      ${isDragActive ? 'border-blue-500' : 'border-gray-600'}`}
    >
      <label htmlFor="dropzone-file" className="cursor-pointer w-full h-full">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
          <FileDownloadOutlinedIcon
            className={`w-10 h-10 mb-3 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
          />
          <p className="text-md text-gray-400">
            {isDragActive ? "Solte para adicionar" : "Clique ou arraste aqui"}
          </p>
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
  const imageUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
  return (
    <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md border-2 border-gray-300">
      <img src={imageUrl} alt="preview" className="object-cover w-full h-full" />
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
