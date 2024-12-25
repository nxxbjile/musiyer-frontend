import { useContext, useEffect, useState } from 'react'
import PlaylistLists from '../components/PlaylistLists'
import axios from 'axios';
import { GlobalContext, Song } from '../contexts/Globals';
import PlaylistToast from '../components/PlaylistToast'

interface UserSongs {
  limit:number;
  message:string;
  page:number;
  songs:Song[];
  total_pages:number;
  total_songs:number;
}

export interface UserPlaylists {
  limit:number;
  message:string;
  page:number;
  playlists:Song[];
  total_pages:number;
  total_songs:number;
}

const Songs = () => {
  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error("GlobalContext cannot be used outside of provider")
  }
  const {currSongList, setCurrSongList, currUser} = globalContext;
  const [page, setPage] = useState<number>(1);                              //@ts-ignore
  const [playlistPage, setPlaylistPage] = useState<number>(1);              //@ts-ignore
  const [playlist, setPlaylist] = useState<UserPlaylists | null>(null);

  const getSongs = async () => {
    var res = await axios.get<UserSongs>(`${import.meta.env.VITE_BASE_API_URL}/users/${currUser?.username}/songs`,{ params:{page}});
    if(res){
      setCurrSongList(res.data.songs);
    }
  }

  const loadMore = async () => {
    setPage((prev)=> prev + 1);
    
  }

  const getPlaylists = async () => {
    var res = await axios.get<UserPlaylists>(`${import.meta.env.VITE_BASE_API_URL}/playlists/users/${currUser?.username}`,{params:{page:playlistPage}});
    if (res.data) {
      setPlaylist((prev) => (prev ? { ...prev, playlists: [...prev.playlists, ...res.data.playlists] } : res.data));
    }
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
            <PlaylistLists data={currSongList} dataHandler={()=>loadMore()} type="songs" />
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