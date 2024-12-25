import React, { useContext, useEffect, useState } from 'react'
import PlaylistLists from '../components/PlaylistLists'
import axios from 'axios';
import { GlobalContext } from '../contexts/Globals';
import { FaPlus } from 'react-icons/fa6';
import PlaylistToast from '../components/PlaylistToast'

const Songs = () => {
  const {currSongList, setCurrSongList, currSong, setCurrSong,playlistToast, setPlaylistToast, currUser, songToPlaylist} = useContext(GlobalContext);
  const [page, setPage] = useState<number>(1);
  const [searchVal, setSearchVal] = useState<string>("");
  const [playlistPage, setPlaylistPage] = useState<number>(1);
  const [playlist, setPlaylist] = useState([]);

  const getSongs = async () => {
    var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/users/${currUser.username}/songs`,{ params:{page}});
    if(res){
      setCurrSongList(res.data.songs);
    }
  }

  const loadMore = async () => {
    setPage((prev)=> prev + 1);
    
  }

  const getPlaylists = async () => {
    var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/playlists/users/${currUser.username}`,{params:{page:playlistPage}});
    setPlaylist((prev) => [...prev, ...res.data.playlists]);
  }
  useEffect(()=>{
    getSongs();
  },[page])

  useEffect(()=>{
    setCurrSongList([]);
    getSongs();
  },[])

  useEffect(()=> {
    getPlaylists();
  },[playlistPage])
  return (
    <div className={`w-full h-full pl-16 pb-[300px] overflow-x-hidden backdrop-blur-md relative`}> 
        {/* playlist toast */}
        <PlaylistToast /> 
      <div className={`w-full p-2`}>
        <div className={`w-fit text-2xl text-white p-2`}>
          My Songs
        </div>
        {
          currSongList && currSongList.length > 0 ? (
            <PlaylistLists data={currSongList} dataHandler={()=>loadMore(page)} type="songs" />
          ) : (
            <div className={`w-full h-full min-h-96 flex items-center justify-center text-neutral-300 text-6xl font-semibold`}>
              No Songs Yet
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Songs