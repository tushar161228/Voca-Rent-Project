import { useState, useCallback } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { getCloudinaryPublicId } from "../utils/getCloudinaryPublicId";
// import Cookies from "js-cookie";
const useFile = () => {
  const [fileUploading, setFileUploading] = useState(false);
  const [fileDeleting, setFileDeleting] = useState(false);
  // const token = Cookies.get("token");
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  // Upload a single file
  const uploadFile = useCallback(async (file) => {
    setFileUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `${NEXT_PUBLIC_API_URL}/api/media/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setFileUploading(false);
      return response.data.data;
    } catch (error) {
      setFileUploading(false);
      throw new Error(error);
    }
  }, []);

  // Upload a multiple file

  const uploadMultiFile = useCallback(async (files) => {
    setFileUploading(true);
    try {
      const formData = new FormData();

      // Loop through all files and append to formData
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]); // use "file" or "files[]" depending on backend
      }

      const response = await axiosInstance.post(
        `${NEXT_PUBLIC_API_URL}/api/media/multipleUpload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setFileUploading(false);
      return response.data.data;
    } catch (error) {
      setFileUploading(false);
      throw new Error(error);
    }
  }, []);

  // Delete a file by ID
  const deleteFile = useCallback(async (fileUrl) => {
    setFileDeleting(true);
    const publicId = getCloudinaryPublicId(fileUrl);
    try {
      const response = await axiosInstance.delete(
        `${NEXT_PUBLIC_API_URL}/api/media/${publicId}`,
      );
      setFileDeleting(false);
      return response.data;
    } catch (error) {
      setFileDeleting(false);
      throw error;
    }
  }, []);

  return {
    fileUploading,
    fileDeleting,
    uploadFile,
    uploadMultiFile,
    deleteFile,
  };
};

export default useFile;
