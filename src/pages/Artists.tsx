import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import ArtistsList from '../components/ArtistsList';
import axios from 'axios';

const Artists = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const handleAdd = () => {
        navigate("/artists/add");
    }

    const getArtists = async ():Promise<void> => {
        var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/artists`,{params:{page}});
        setData((prev)=> [...prev, ...res.data.artists]);
    }

    useEffect(()=> {
      getArtists();
    },[page]);
  return (
    <div className={`relative pl-16 w-full h-full p-2`}>
        <div onClick={handleAdd} className={`fixed top-6 right-6 w-12 h-12 rounded-lg bg-emerald-500 text-white text-2xl flex items-center justify-center`}>
            <FaPlus />
        </div>
        <div className={`w-full h-fit`}>
            <ArtistsList data={data} dataHandler={() => setPage((prev)=> prev + 1)} />
        </div>
    </div>
  )
}

export default Artists