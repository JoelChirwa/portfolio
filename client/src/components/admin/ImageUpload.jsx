import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const ImageUpload = ({ value, onChange, error }) => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  // Update preview when value prop changes (for editing existing items)
  React.useEffect(() => {
    setPreview(value || "");
  }, [value]);

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      // Create FormData for backend upload
      const formData = new FormData();
      formData.append("image", file);

      console.log("Uploading to:", `${API_URL}/api/upload`);
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("Has token:", !!token);
      
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Upload through backend API
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid server response");
      }

      console.log("Response data:", data);

      if (!response.ok) {
        console.error("Upload Error:", data);
        throw new Error(data.message || `Upload failed with status ${response.status}`);
      }

      console.log("Upload Success:", data);
      const imageUrl = data.url || data.imageUrl;

      if (!imageUrl) {
        throw new Error("No image URL in response");
      }

      // Update preview and parent component
      setPreview(imageUrl);
      onChange(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!preview ? (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Project Image *
          </label>

          {/* File Upload Button */}
          <div className="flex flex-col gap-3">
            <label
              htmlFor="image-upload"
              className={`
                relative flex flex-col items-center justify-center
                w-full h-48 border-2 border-dashed rounded-lg
                cursor-pointer transition-all
                ${
                  uploading
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-700 hover:border-accent bg-slate-950 hover:bg-slate-900"
                }
              `}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3 text-accent">
                  <Loader size={40} className="animate-spin" />
                  <p className="text-sm">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Upload size={40} />
                  <div className="text-center">
                    <p className="font-medium text-white">
                      Click to upload image
                    </p>
                    <p className="text-sm mt-1">or drag and drop</p>
                    <p className="text-xs mt-2">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Project Image *
          </label>

          {/* Image Preview */}
          <div className="relative rounded-lg overflow-hidden border border-slate-800">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x300?text=Invalid+Image";
              }}
            />

            {/* Remove Button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image URL Display */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3">
              <p className="text-xs text-slate-300 truncate">{preview}</p>
            </div>
          </div>

          {/* Change Image Button */}
          <button
            type="button"
            onClick={handleRemove}
            className="mt-3 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <ImageIcon size={16} />
            Change Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
