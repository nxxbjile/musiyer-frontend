import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/Globals';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa6';

interface Song {
  _id: string;
  artist: string;
  back_drop: string | null;
  cover_img: string | null;
  duration: string | null;
  file_url: string | null;
  genre: string | null;
  title: string;
  username: string;
}

interface Playlist {
  _id: string;
  cover_img: string;
  description: string;
  is_public: boolean;
  name: string;
  songs: Song[];
  username: string;
}

interface UserPlaylists {
  playlists: Playlist[];
  total_playlists: number;
  total_pages: number;
  limit: number;
  page: number;
  message: string;
}


const PlaylistToast = () => {
  const globalContext = useContext(GlobalContext);
  if (!globalContext) {
    throw new Error('GlobalContext cannot be used outside of provider');
  }

  const { playlistToast, setPlaylistToast, currUser, songToPlaylist } = globalContext;
  const [searchVal, setSearchVal] = useState<string>('');
  //@ts-ignore
  const [playlistPage, setPlaylistPage] = useState<number>(1); 
  const [playlist, setPlaylist] = useState<UserPlaylists | null>(null);

  const getPlaylists = async () => {
    try {
      const res = await axios.get<UserPlaylists>(
        `${import.meta.env.VITE_BASE_API_URL}/playlists/users/${currUser?.username}`,
        { params: { page: playlistPage } }
      );
      if (res.data) {
        setPlaylist((prev) => (prev ? { ...prev, playlists: [...prev.playlists, ...res.data.playlists] } : res.data));
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleSongToPlaylist = async (playlistId: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/playlists/${playlistId}/songs`,
        songToPlaylist
      );
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    getPlaylists();
  }, [playlistPage]);

  return (
    <>
      {playlistToast && (
        <div className="fixed top-0 left-16 z-50 transform translate-x-1/2 w-2/5 h-[100vh-100px] flex flex-col items-center justify-start p-3 bg-neutral-500/40 backdrop-blur-lg border-2 border-gray-600 rounded-xl">
          <div
            onClick={() => setPlaylistToast(false)}
            className="top-3 right-3 absolute rotate-45 text-xl font-semibold cursor-pointer p-2 rounded-full bg-emerald-500 text-white"
          >
            <FaPlus />
          </div>

          <div className="w-full f-fit flex flex-col items-center gap-4 justify-between">
            <div className="w-4/5">
              <input
                type="text"
                placeholder="search"
                value={searchVal}
                onChange={handleSearchChange}
                className="w-full p-2 placeholder:text-neutral-500 text-neutral-500 rounded-lg"
              />
            </div>
            <div className="w-full h-[calc(100vh-64px)] overflow-y-scroll p-2 flex flex-col gap-2">
              {playlist &&
                (searchVal.length < 1
                  ? playlist.playlists.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSongToPlaylist(item._id)}
                        className="w-full rounded-lg border-2 h-fit p-2 bg-neutral-500/30 flex items-center justify-between cursor-pointer"
                      >
                        <div className="text-neutral-200">{item.name}</div>
                        <div className="text-neutral-200">{item.songs.length}</div>
                      </div>
                    ))
                  : playlist.playlists
                      .filter((item) => item.name.toLowerCase().includes(searchVal.toLowerCase()))
                      .map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSongToPlaylist(item._id)}
                          className="w-full rounded-lg border-2 h-fit p-2 bg-neutral-500/30 flex items-center justify-between cursor-pointer"
                        >
                          <div className="text-neutral-200">{item.name}</div>
                          <div className="text-neutral-200">{item.songs.length}</div>
                        </div>
                      )))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistToast;
