import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

interface ImageUploadPreviewProps {
  initialImage?: string;
  onImageChange: (file: File | null) => void;
}

const ImageUploadPreview = forwardRef<{ resetImage: () => void }, ImageUploadPreviewProps>(
  ({ initialImage, onImageChange }, ref) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
      if (initialImage) {
        setPreviewUrl(`${import.meta.env.VITE_API_URL}/images/${initialImage}`);
      }
    }, [initialImage]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          alert('Please select a .jpg or .png file.');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageChange(file);
      } else {
        setPreviewUrl(null);
        onImageChange(null);
      }
    };

    const resetImage = () => {
      setPreviewUrl(null);
      onImageChange(null);
      if (document.getElementById('image') instanceof HTMLInputElement) {
        (document.getElementById('image') as HTMLInputElement).value = '';
      }
    };

    useImperativeHandle(ref, () => ({
      resetImage,
    }));

    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          StickerImage
        </label>
        <input
          type="file"
          id="image"
          accept=".jpg,.png"
          onChange={handleImageChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {previewUrl && (
          <div className="mt-2">
            <img src={previewUrl} alt="Preview" className="max-w-xs h-auto" />
          </div>
        )}
      </div>
    );
  }
);

export default ImageUploadPreview;