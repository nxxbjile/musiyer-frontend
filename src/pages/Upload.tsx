import React, { useState, ChangeEvent, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalContext } from '../contexts/Globals';
import { useNavigate } from 'react-router-dom';

type FileType = File | null;

type UploadResponse = {
  secure_url: string;
  duration: string;
};

interface song {
  title: string;
  genre:string;
  artist:string;
  cover_img:string;
}

const Upload = () => {

  const [selectedFile, setSelectedFile] = useState<FileType>(null);
  const [uploading, setUploading] = useState<boolean>(false);       //@ts-ignore
  const [uploadUrl, setUploadUrl] = useState<string>('');           //@ts-ignore
  const [error, setError] = useState<string>('');
  const [song, setSong] = useState<song>({
    title:"",
    artist:"",
    genre:"",
    cover_img:"",
  });
  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error('GlobalContext cannot be used outside of provider');
  }
  const { currUser, setPlayer } = globalContext;
  const navigate = useNavigate();

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
    if(!song.artist || !song.title || !song.genre){
      alert("all fields are required");
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

    try {
      const response = await axios.post<UploadResponse>(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/auto/upload`,
        formData
      );

      setUploadUrl(response.data.secure_url); // Get the uploaded file's URL
      var toDb = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/songs`,{
        title:song.title,
        artist:song.artist, 
        genre:song.genre, 
        duration:response.data.duration.toString(), 
        file_url:`${response.data.secure_url}`, 
        username:currUser?.username,
        password:currUser?.password,
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

  const handleFields = (e : React.ChangeEvent<HTMLInputElement>, key:string) => {
    setSong({
      ...song,
      [key]:e.target.value,
    })
  }

  useEffect(()=>{
    setPlayer(false);
    if(currUser?.username == ""){
      navigate("/login");
    }
  },[currUser])

  return (
    <div className={`w-full h-full bg-neutral-800/30 backdrop-blur-lg flex items-center justify-center z-10`}>
        <div className={`w-2/6 h-5/6 rounded-3xl bg-neutral-800/30 border-2 border-gray-500 backdrop-blur-xl flex flex-col gap-2 items-center justify-start p-3`}>
          <input type="text" placeholder="title" onChange={(e)=>handleFields(e,"title")} className={`p-2 bg-neutral-300 rounded-lg placeholder:text-md placeholder:text-neutral-600`} />
          <input type="text" placeholder="artist" onChange={(e)=>handleFields(e,"artist")} className={`p-2 bg-neutral-300 rounded-lg placeholder:text-md placeholder:text-neutral-600`} />
          <input type="text" placeholder="genre" onChange={(e)=>handleFields(e,"genre")} className={`p-2 bg-neutral-300 rounded-lg placeholder:text-md placeholder:text-neutral-600`} />
          <input type="text" placeholder="image URL(optional)" onChange={(e)=>handleFields(e,"cover_img")} className={`p-2 bg-neutral-300 rounded-lg placeholder:text-md placeholder:text-neutral-600`} />

          <div className={`flex items-center justify-between`}>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className={`w-full`}
            />
          </div>

          <button type="button" onClick={handleUpload} disabled={uploading} className={`p-2 bg-green-500 rounded-lg ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>

        </div>
    </div>
  )
}

export default Upload