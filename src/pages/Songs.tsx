import React, { useContext, useEffect, useState } from 'react'
import PlaylistLists from '../components/PlaylistLists'
import axios from 'axios';
import { GlobalContext } from '../contexts/Globals';
import { FaPlus } from 'react-icons/fa6';

const Songs = () => {
  const {currSongList, setCurrSongList, currSong, setCurrSong,playlistToast, setPlaylistToast, currUser, songToPlaylist} = useContext(GlobalContext);
  const [page, setPage] = useState<number>(1);
  const [searchVal, setSearchVal] = useState<string>("");
  const [playlistPage, setPlaylistPage] = useState<number>(1);
  const [playlist, setPlaylist] = useState([]);

  const getSongs = async () => {
    var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/users/${currUser.username}/songs`,{ params:{page}});
    if(res){
      // console.log(res);
      setCurrSongList((prev)=> [...prev, ...res.data.songs]);
      console.log(res.data.songs);
    }
  }

  const loadMore = async () => {
    setPage((prev)=> prev + 1);
  }

  const getPlaylists = async () => {
    var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/playlists/users/${currUser.username}`,{params:{page:playlistPage}});
    console.log(res.data.playlists);
    setPlaylist((prev) => [...prev, ...res.data.playlists]);
  }

  const handleSongToPlaylist = async (playlistId:string) => {
    var res = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/playlists/${playlistId}/songs`,songToPlaylist);
    console.log(res);
  }

  const handleSearchChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  }
  useEffect(()=>{
    getSongs();
    console.log(currUser.username);
  },[page])

  useEffect(()=> {
    getPlaylists();
  },[playlistPage])
  return (
    <div className={`w-full h-full pl-16 pb-[300px] overflow-x-hidden backdrop-blur-md relative`}> 
        {/* playlist toast */}
        {
          playlistToast &&
          <div className={`fixed z-50 transform translate-x-1/2 tanslate-y-1/2 w-2/5 h-[100vh-100px] flex flex-col items-center justify-start p-3 bg-neutral-500/40 backdrop-blur-lg border-2 border-gray-600 rounded-xl`}>
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