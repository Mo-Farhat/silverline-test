import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFiles, downloadFile, deleteFile } from '../features/files/fileSlice';
import { formatBytes } from '../utils/fileValidation';
import { File as FileIcon, Download, Loader2, Trash2 } from 'lucide-react';

const FilesPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.files);

  useEffect(() => {
    dispatch(fetchAllFiles());
  }, [dispatch]);

  const handleDownload = (id, fileName) => {
    dispatch(downloadFile({ id, fileName }));
  };

  const handleDelete = (id, fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      dispatch(deleteFile(id));
    }
  };

  const formatDate = (dateString) => {
    const raw = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(raw);
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 h-full flex flex-col">
       <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Materials</h1>
            <p className="text-gray-600">View and manage all your uploaded course files.</p>
          </div>
          <div className="flex gap-4">
              <span className="bg-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-dark"></span>
                  {items.length} Files
              </span>
          </div>
       </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-50 flex-1 overflow-hidden flex flex-col">
        {error && (
            <div className="m-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center border border-red-100 font-medium">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
              {error}
            </div>
        )}

        <div className="flex-1 overflow-auto">
            {loading && items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand-dark" />
                    <p className="font-medium text-gray-500">Loading files...</p>
                </div>
            ) : items.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <FileIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-lg font-semibold text-gray-600">No files uploaded yet</p>
                    <p className="text-sm mt-1">Head over to the Upload tab to add some.</p>
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="py-5 px-8 font-semibold text-sm text-gray-500 uppercase tracking-wider">File Name</th>
                            <th className="py-5 px-8 font-semibold text-sm text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="py-5 px-8 font-semibold text-sm text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="py-5 px-8 font-semibold text-sm text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-5 px-8 font-semibold text-sm text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="py-4 px-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                                            <FileIcon className="w-5 h-5 text-gray-400 group-hover:text-brand-dark transition-colors" />
                                        </div>
                                        <span className="font-semibold text-gray-700 truncate max-w-xs">{file.fileName}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-8 text-sm text-gray-500 font-medium">{formatBytes(file.fileSize)}</td>
                                <td className="py-4 px-8">
                                    <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 capitalize">
                                        {file.fileType.split('/')[1] || 'Unknown'}
                                    </div>
                                </td>
                                <td className="py-4 px-8 text-sm text-gray-500">{formatDate(file.uploadDate)}</td>
                                <td className="py-4 px-8 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleDownload(file.id, file.fileName)}
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white hover:shadow-sm text-gray-400 hover:text-brand-dark transition-all"
                                            title="Download"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(file.id, file.fileName)}
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white hover:shadow-sm text-gray-400 hover:text-red-500 transition-all"
                                            title="Delete file"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
