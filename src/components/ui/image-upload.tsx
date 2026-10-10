import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  selectedImages: File[];
  onRemoveImage: (index: number) => void;
  isUploading?: boolean;
  maxImages?: number;
  acceptedTypes?: string[];
}

const ImageUpload = ({
  onImagesSelected,
  selectedImages,
  onRemoveImage,
  isUploading = false,
  maxImages = 10,
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => 
      acceptedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    const remainingSlots = maxImages - selectedImages.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      onImagesSelected([...selectedImages, ...filesToAdd]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Upload Property Images
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, WebP (max 5MB each)
              </p>
              <p className="text-xs text-gray-400">
                {selectedImages.length}/{maxImages} images selected
              </p>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClick}
              disabled={isUploading || selectedImages.length >= maxImages}
              className="mt-4"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Select Images
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Image Previews */}
      {selectedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Selected Images <span className="text-xs font-normal text-gray-500">(the first image is the cover shown on the website)</span></h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative group">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={getImagePreview(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    {index === 0 ? (
                      <span className="absolute bottom-14 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        Cover image
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => onImagesSelected([file, ...selectedImages.filter((_, i) => i !== index)])}
                        className="absolute bottom-14 left-2 bg-white/90 hover:bg-white text-xs px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Make cover
                      </button>
                    )}
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveImage(index)}
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 