import React, { useContext } from 'react';
import venyl from '../assets/venyl.jpeg';
import { GlobalContext, Song } from '../contexts/Globals';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

interface PlaylistItem extends Song {
  name?:string;
  songs?:string;
  cover_img?:string;
  duration?:number;
}

interface PlaylistListProps {
  data:         PlaylistItem[];
  type:         'songs' | 'playlists';
  dataHandler:  () => void;
}

const PlaylistLists: React.FC<PlaylistListProps> = ({ data, dataHandler, type = 'playlists' }) => {
    const globalContext = useContext(GlobalContext);
    if(!globalContext){
        throw new Error("Global context must be used within globals provider");
    }
  const {
    setCurrSong,
    currSong,
    setPlayer,
    setPlaylistToast,
    setSongToPlaylist,
  } = globalContext;
  const navigate = useNavigate();

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClick = (item: Song) => {
    if (type === 'songs') {
      setPlayer(true);
      setCurrSong(item);
    }
    if (type === 'playlists') {
      setPlayer(false);
      navigate(`/playlists/${item._id}`);
    }
  };

  const handleAddPlaylist = (item: Song) => {
    setSongToPlaylist(item);
    setPlaylistToast(true);
  };

  return (
    <div className="relative w-full h-fit mt-4">
      {/* List of items */}
      {data &&
        data.map((item, idx) => (
          <div
            key={idx} // Use `_id` as the unique key if available
            className="w-full p-2 flex border-b border-neutral-500 items-center justify-between cursor-pointer hover:bg-white/10 transition-all duration-300 ease-in-out"
          >
            <div className="flex min-w-12 w-fit h-full items-center justify-start">
              <span className="text-white flex items-center justify-center min-w-16 px-2 self-center">{idx + 1}</span>
              <div
                onClick={() => handleClick(item)}
                className="w-12 h-12 rounded-lg border overflow-hidden"
              >
                {currSong && item._id === currSong?._id ? (
                  <img
                    src={item.cover_img || venyl}
                    alt="cover"
                    className="w-36 h-full animate-ping"
                  />
                ) : (
                  <img src={item.cover_img || venyl} alt="cover" className="w-full h-full" />
                )}
              </div>
            </div>
            <div
              onClick={() => handleClick(item)}
              className="w-1/4 h-full text-white flex items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
            >
              {type === 'songs' && item.title}
              {type === 'playlists' && item.name}
            </div>
            {type === 'songs' && (
              <>
                <div className="w-1/4 h-full text-white overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.artist}
                </div>
                <div
                  onClick={() => handleAddPlaylist(item)}
                  className="p-3 hover:bg-white/10 rounded-lg h-full text-white"
                >
                  <FaPlus />
                </div>
              </>
            )}
            <div className="w-1/4 h-full text-white flex items-center justify-end">
              {type === 'playlists' && item.songs?.length}
              {type === 'songs' && formatTime(item.duration || 0)}
            </div>
          </div>
        ))}
      {/* List of items ENDS */}

      <div onClick={dataHandler} className="w-full h-fit p-2 flex items-center justify-center">
        <button
          type="button"
          className="p-3 px-5 text-white bg-neutral-500/60 rounded-md cursor-pointer hover:bg-white/40 transition-all duration-300 ease-in-out"
        >
          more
        </button>
      </div>
    </div>
  );
};

export default PlaylistLists;
