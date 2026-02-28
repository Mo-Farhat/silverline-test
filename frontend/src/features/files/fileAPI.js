import axiosInstance from '../../utils/axiosConfig';

export const fetchFilesAPI = async () => {
  const response = await axiosInstance.get('/files');
  return response.data;
};

export const uploadFileAPI = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const downloadFileAPI = async (id, fileName) => {
  const response = await axiosInstance.get(`/files/${id}/download`, {
    responseType: 'blob', // Important for downloading files
  });
  
  // Create a temporary link to trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

export const deleteFileAPI = async (id) => {
  const response = await axiosInstance.delete(`/files/${id}`);
  return response.data;
};
