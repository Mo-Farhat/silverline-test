import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, clearError, resetUploadProgress } from '../features/files/fileSlice';
import { validateFileType, validateFileSize } from '../utils/fileValidation';
import { UploadCloud, File as FileIcon, X, CheckCircle } from 'lucide-react';

const UploadPage = () => {
  const dispatch = useDispatch();
  const { loading, error, uploadProgress } = useSelector((state) => state.files);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndSetFile = (file) => {
    setValidationError(null);
    dispatch(clearError());
    setSuccess(false);
    dispatch(resetUploadProgress());

    if (!file) return;

    const typeError = validateFileType(file);
    if (typeError) {
      setValidationError(typeError);
      return;
    }

    const sizeError = validateFileSize(file);
    if (sizeError) {
      setValidationError(sizeError);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    dispatch(clearError());
    setSuccess(false);
    dispatch(resetUploadProgress());
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await dispatch(uploadFile(selectedFile)).unwrap();
      setSuccess(true);
      setTimeout(() => {
          clearFile();
      }, 3000);
    } catch (err) {
      // Error is handled by Redux slice and displayed below
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="mb-8 p-8 bg-[#FFF8E7] rounded-3xl flex items-center justify-between shadow-sm border border-yellow-100">
          <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Content</h1>
              <p className="text-gray-600">You can upload new course materials here! Add PDFs, MP4s or Images.</p>
          </div>
          {/* Decorative elements representing the 'Smart' theme from the image could go here */}
          <div className="w-24 h-24 bg-yellow-200 rounded-full opacity-50 flex items-center justify-center">
             <UploadCloud className="w-10 h-10 text-yellow-600"/>
          </div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-50">
        
        {/* Upload Zone */}
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${
            dragActive 
              ? 'border-brand-dark bg-indigo-50/50' 
              : 'border-gray-200 hover:border-brand-dark/50 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept=".pdf,.mp4,.jpg,.jpeg,.png"
          />
          <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4 text-brand-dark">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            Drag & drop your file here
          </p>
          <p className="text-sm text-gray-500">
            or click to browse from your computer
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Supports: PDF, MP4, JPG, PNG (Max 50MB)
          </p>
        </div>

        {/* Selected File & Progress */}
        {selectedFile && (
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-dark shrink-0">
                <FileIcon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-sm font-semibold text-gray-800 truncate">{selectedFile.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  {loading && (
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden ml-2 max-w-[200px]">
                      <div 
                        className="h-full bg-brand-dark transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               {success ? (
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Uploaded
                  </div>
               ) : (
                  <>
                    <button 
                        onClick={clearFile}
                        disabled={loading}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="px-6 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md shadow-brand-dark/20"
                    >
                        {loading ? 'Uploading...' : 'Upload File'}
                    </button>
                  </>
               )}
            </div>
          </div>
        )}

        {/* Global/Validation Errors */}
        {(validationError || error) && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center border border-red-100">
             <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
            {validationError || error}
          </div>
        )}

      </div>
    </div>
  );
};

export default UploadPage;
