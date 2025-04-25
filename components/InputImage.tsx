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
    existingBannerUrl?: string | null; // URL do banner existente
    onNewBase64?: (base64: string) => void; // Callback para novo base64
    onRemoveExistingBanner?: () => void; // Callback para remover banner existente
}

export const FileInput = ({ existingBannerUrl, onNewBase64, onRemoveExistingBanner }: FileInputProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(existingBannerUrl || null);

    useEffect(() => {
        if (existingBannerUrl) {
            setFile(null); // Limpa qualquer arquivo selecionado
            setPreviewUrl(existingBannerUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [existingBannerUrl]);

    useEffect(() => {
        if (file) {
            convertToBase64(file).then(base64 => {
                setPreviewUrl(base64);
                if (onNewBase64) {
                    onNewBase64(base64);
                }
            });
        }
    }, [file, onNewBase64]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const dropzone = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
        multiple: false,
        maxFiles: 1,
    });

    const handleRemovePreview = () => {
        setFile(null);
        setPreviewUrl(null);
        if (onRemoveExistingBanner) {
            onRemoveExistingBanner();
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
        <div className="flex w-full">
            {!previewUrl && <Input dropzone={dropzone} />}
            {previewUrl && (
                <ImagePreview
                    file={previewUrl}
                    onRemove={handleRemovePreview}
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
            className={`w-full h-32 rounded-lg border-dashed border-4 bg-gray-700 hover:bg-gray-600 transition-all p-8
            ${isDragActive ? 'border-blue-500' : 'border-gray-600'}`}
        >
            <label htmlFor="dropzone-file" className="cursor-pointer w-full h-full">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                    <FileDownloadOutlinedIcon
                        className={`w-full  h-10 mb-3 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
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
    file: string; // Agora aceita diretamente a URL ou base64
    onRemove?: () => void;
}

const ImagePreview = ({ file, onRemove }: ImagePreviewProps) => {
    return (
        <div className="relative w-96 h-96 rounded-lg overflow-hidden shadow-md border-2 border-gray-300">
            <img src={file} alt="preview" className="object-cover w-full h-full" />
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