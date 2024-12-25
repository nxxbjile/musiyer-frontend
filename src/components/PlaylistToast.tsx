import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../contexts/Globals';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa6';

const PlaylistToast = () => {

    const { playlistToast, setPlaylistToast, currUser, songToPlaylist} = useContext(GlobalContext);

    const [searchVal, setSearchVal] = useState<string>("");
    const [playlistPage, setPlaylistPage] = useState<number>(1);
    const [playlist, setPlaylist] = useState([]);


    const getPlaylists = async () => {
        var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/playlists/users/${currUser.username}`,{params:{page:playlistPage}});
        setPlaylist((prev) => [...prev, ...res.data.playlists]);
      }
    
      const handleSongToPlaylist = async (playlistId:string) => {
        var res = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/playlists/${playlistId}/songs`,songToPlaylist);
      }
    
      const handleSearchChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchVal(e.target.value);
      }

    useEffect(()=> {
    getPlaylists();
    },[playlistPage])
  return (
    <>
        {
          playlistToast &&
          <div className={`fixed top-0 left-16 z-50 transform translate-x-1/2 tanslate-y-1/2 w-2/5 h-[100vh-100px] flex flex-col items-center justify-start p-3 bg-neutral-500/40 backdrop-blur-lg border-2 border-gray-600 rounded-xl`}>
              <div onClick={()=>setPlaylistToast(false)} className={`top-3 right-3 absolute rotate-45 text-xl font-semibold cursor-pointer p-2 rounded-full bg-emerald-500 text-white`}><FaPlus /></div>

              <div className={`w-full f-fit flex flex-col items-center gap-4 justify-between`}>
                <div className={`w-4/5`}>
                  <input type="text" placeholder='search' value={searchVal} onChange={handleSearchChange} className={`w-full p-2 placeholder:text-neutral-500 text-neutral-500 rounded-lg`} />
                </div>
                <div className={`w-full h-[calc(100vh-64px)] overflow-y-scroll p-2 flex flex-col gap-2`}>
                  {
                    playlist && searchVal.length < 1 && playlist.map((item, idx) => (
                      <div key={idx} onClick={()=>handleSongToPlaylist(item._id.toString())} className={`w-full rounded-lg border-2 h-fit p-2 bg-neutral-500/30 flex items-center justify-between cursor-pointer`}>
                        <div className={`text-neutral-200`}>
                          {item.name}
                        </div>
                        <div className={`text-neutral-200`}>
                          {item.songs.length}
                        </div>

                      </div>
                    ))
                  }
                  {
                    playlist && playlist.filter((item)=> item.name.includes(searchVal)).map((item, idx) => (
                      <div key={idx} onClick={()=>handleSongToPlaylist(item._id.toString())} className={`w-full rounded-lg border-2 h-fit p-2 bg-neutral-500/30 flex items-center justify-between cursor-pointer`}>
                        <div className={`text-neutral-200`}>
                          {item.name}
                        </div>
                        <div className={`text-neutral-200`}>
                          {item.songs.length}
                        </div>

                      </div>
                    ))
                  }
                </div>
              </div>
          </div>
        } 
    </>
  )
}

export default PlaylistToast