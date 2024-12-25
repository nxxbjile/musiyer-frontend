import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PlaylistLists from '../components/PlaylistLists';
import axios from 'axios';

const ArtistSongs = () => {
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const {id} = useParams();

    const getSongs = async () => {
        try{
            var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/artists/${id}/songs`, {params:{page}});
            var newSongs = res.data.songs.songs;
            setSongs((prev:any[])=> [...prev, ...newSongs]);
        }catch(error){
            console.log("getSongs error", error);
        }
    }

    useEffect(()=> {
        getSongs();
    },[page])
  return (
    <div className={`w-full h-fit pl-16`}>
        <PlaylistLists data={songs} dataHandler={()=> setPage((prev)=> prev + 1)} type="songs" />
    </div>
  )
}

export default ArtistSongs