import React, { createContext, Dispatch, ReactElement, ReactNode, SetStateAction, useState } from 'react'

export interface GlobalContextType {
    sidebarOpen :       boolean;
    setSidebarOpen :    React.Dispatch<SetStateAction<boolean>>;
    currUser :          User | null;
    setCurrUser :       React.Dispatch<SetStateAction<User | null>>;
    toggleSidebar :     () => void;
    currSong:           Song | null;
    setCurrSong:        React.Dispatch<SetStateAction<Song | null>>;
    player:             boolean;
    setPlayer:          Dispatch<SetStateAction<boolean>>;
    currSongList:       Song[];
    setCurrSongList:    React.Dispatch<SetStateAction<Song[]>>;
    playlistToast:      boolean;
    setPlaylistToast:   React.Dispatch<SetStateAction<boolean>>;
    songToPlaylist:     Song | null;
    setSongToPlaylist:  Dispatch<SetStateAction<Song | null>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export interface User {
    username:string;
    password:string;
}

export interface GlobalsProps {
    children : ReactNode;
}

export interface Song {
    _id:string;
    file_url:string;
    title?:string;
    artist?:string;
}

const Globals:React.FC<GlobalsProps> = ({children} : GlobalsProps ) : ReactElement => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [currSong, setCurrSong] = useState<Song | null>(null);
    const [player, setPlayer] = useState<boolean>(false);
    const [currSongList, setCurrSongList] = useState<Song[]>([]);
    const storedUser = JSON.parse(localStorage.getItem("user") || "null") as User | null;
    const [currUser, setCurrUser] = useState<User | null>( storedUser );
    const [songToPlaylist, setSongToPlaylist] = useState<Song | null>(null);
    const [ playlistToast, setPlaylistToast] = useState<boolean>(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }
  return (
    <GlobalContext.Provider value={{
        sidebarOpen, setSidebarOpen,
        currUser, setCurrUser,
        toggleSidebar,
        currSong, setCurrSong,
        player, setPlayer,
        currSongList, setCurrSongList,
        playlistToast, setPlaylistToast,
        songToPlaylist, setSongToPlaylist,
    }}>
        {children}
    </GlobalContext.Provider>
  )
}

export {Globals, GlobalContext}