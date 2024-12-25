import React, { useContext, useEffect, useState } from 'react'
import PlaylistCards from '../components/PlaylistCards'
import PlaylistLists from '../components/PlaylistLists'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../contexts/Globals';

const Home = () => {
  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error("GlobalContext cannot be used outside of provider");
  }
  const { setCurrSongList, currSongList } = globalContext;
  const [playlists, setPlaylists] = useState([]);
  const [songsPage, setSongsPage] = useState<number>(1);
  const [playlistsPage, setPlaylistsPage] = useState<number>(1);

  const navigate = useNavigate();

  const getPlaylists = async () => {
    var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/playlists`, {params:{page:playlistsPage}});
    if(res){
      setPlaylists(res.data.playlists);
    }
  }

  const getSongs = async () => {
    var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/songs`, {params:{page:songsPage,limit:20}})
    if(res){
      setCurrSongList((prev)=> [...prev, ...res.data.songs]);
    }
  }

  const handleMore = () => {
    setSongsPage((prev)=> prev + 1);
  }

  const handlePlaylistClick = ( id:string ) => {
    navigate(`/playlists/${id}`);
  }

  useEffect(()=>{
    getPlaylists();
  }, [playlistsPage])
  
  useEffect(()=>{
    getSongs();
  }, [songsPage])
  return (
    <div className={` w-full h-full backdrop-blur-lg overflow-x-hidden absolute pl-14 pb-[300px]`}>
      
      {/* playlist cards */}
      <div className={`w-full h-fit p-2 text-2xl text-white m-2`}>
        Top Playlists
      </div>
      <PlaylistCards width={120} height={80} borderRadius={8} dataList={playlists} autoSlide={true} floatingTitles={false} onClick={(id:string)=>{handlePlaylistClick(id)}}/>

      {/* top songs */}
      <div className={`w-full h-fit p-2 text-2xl text-white m-2`}>
        Top Songs
      </div>
      <PlaylistLists data={currSongList} type="songs" dataHandler={handleMore} />
    </div>
  )
}

export default Home