import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

type FileType = File | null;

type UploadResponse = {
  secure_url: string;
};

const AudioUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileType>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Cloudinary details
  const CLOUD_NAME = 'dobhejxtp'; // Replace with your Cloudinary cloud name
  const UPLOAD_PRESET = 'toSongs'; // Replace with your unsigned preset

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;

    // Restrict uploads to audio files only
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setError('');
    } else {
      setSelectedFile(null);
      setError('Please upload a valid audio file.');
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) {
      setError('No file selected. Please choose an audio file.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post<UploadResponse>(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        formData
      );

      setUploadUrl(response.data.secure_url); // Get the uploaded file's URL
      var toDb = await axios.post(`${import.meta.env.VITE_BASE_API_URL}`,{
        title:"excuses",
        artist:"AP Dhillon", 
        genre:"Punjabi", 
        duration:"3:04", 
        file_url:`${response.data.secure_url}`, 
        username:`himanshu`,
        password:`1234`
      })
      if(toDb){
        console.log(`new song added to the database :`,toDb.data);
      }
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Audio Uploader</h1>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ marginBottom: '20px' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedFile && (
        <p>
          <strong>Selected File:</strong> {selectedFile.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        style={{
          padding: '10px 20px',
          backgroundColor: uploading ? '#ccc' : '#007BFF',
          color: '#fff',
          border: 'none',
          cursor: uploading ? 'not-allowed' : 'pointer',
          borderRadius: '5px',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>Upload successful!</p>
          <audio controls src={uploadUrl} style={{ marginTop: '10px', width: '100%' }}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
