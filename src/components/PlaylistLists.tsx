import React, { useContext, useState } from 'react'
import venyl from '../assets/venyl.jpeg'
import { GlobalContext } from '../contexts/Globals';
import { FaMusic, FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

interface PlaylistListProps {
    data:       any[];
    type:       string;
    dataHandler : ()=>void;
}

const PlaylistLists = ({ data, dataHandler, type="playlists" }:PlaylistListProps) => {
    const { setCurrSong, currSong, setPlayer, setPlaylistToast, setSongToPlaylist } = useContext(GlobalContext); 
    const [song, setSong] = useState({});
    const navigate = useNavigate();
    const formatTime = (time: number): string => {
        if (isNaN(time)) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleClick = (item: any) => {
        if(type == "songs"){
            setPlayer(true);
            setCurrSong(item);
        }
        if(type == "playlists"){
            setPlayer(false);
            navigate(`/playlists/${item._id}`);
        }
    }

    const handleAddPlaylist = (item:{}) => {
        setSongToPlaylist(item);
        setPlaylistToast(true);
    }


  return (
    <div className={`relative w-full h-fit mt-4`}>
        {/* list of songs */}
        {
            data && data.map((item,idx)=>(
                <div key={idx} className={`w-full p-2 flex border-b border-neutral-500 items-center justify-between cursor-pointer hover:bg-white/10 transition-all duration-300 ease-in-out`}>
                    <div className={`flex min-w-8 w-fit h-full items-center justify-start`}>
                        <span className={`text-white px-4 self-center`}>{idx}</span>
                        <div onClick={()=>handleClick(item)} className={`w-12 h-12 rounded-lg border overflow-hidden`}>
                            {
                                item._id === currSong._id ? (
                                    <img src={item.cover_img ? item.cover_img : venyl} alt="something" className={`w-36 h-full animate-ping`} />
                                ) : (
                                    <img src={item.cover_img ? item.cover_img : venyl} alt="something" className={`w-full h-full`} />
                                )
                            }
                        </div>
                    </div>
                    <div onClick={()=>handleClick(item)} className={`w-1/4 h-full text-white flex items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap hover:underline`}>
                      {type =="songs" && item.title}
                      {type =="playlists" && item.name}
                    </div>
                    {
                        type == "songs" &&
                        <>
                            <div className={`w-1/4 h-full text-white overflow-hidden text-ellipsis whitespace-nowrap`}>
                                {type =="songs" && item.artist}
                            </div>
                            <div onClick={()=>handleAddPlaylist(item)} className={`p-3 hover:bg-white/10 rounded-lg h-full text-white`} >
                                <FaPlus />
                            </div>
                        </>
                    }
                    <div className={`w-1/4 h-full text-white flex items-center justify-end`}>
                        {type == "playlists" && item.songs.length}
                        {type == "songs" && formatTime(item.duration)}
                    </div>
                </div>
            ))
        }
        {/* list of songs ENDS */}

        <div onClick={dataHandler} className={`w-full h-fit p-2 flex items-center justify-center`}>
            <button type="button" className={`p-3 px-5 text-white bg-neutral-500/60 rounded-md cursor-pointer hover:bg-white/40 transition-all duration-300 ease-in-out`}>more</button>
        </div>
    </div>
  )
}

export default PlaylistLists