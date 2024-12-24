import React, { createContext, Dispatch, ReactElement, ReactNode, SetStateAction, useState } from 'react'

export interface GlobalContextType {
    sidebarOpen :       boolean;
    setSidebarOpen :    React.Dispatch<SetStateAction<boolean>>;
    currUser :          User | null;
    setCurrUser :       React.Dispatch<SetStateAction<User>>;
    toggleSidebar :     () => void;
    currSong:           {};
    setCurrSong:        React.Dispatch<SetStateAction<{}>>;
    player:             boolean;
    setPlayer:          Dispatch<SetStateAction<boolean>>;
    currSongList:       any[];
    setCurrSongList:    React.Dispatch<SetStateAction<any[]>>;
    playlistToast:      boolean;
    setPlaylistToast:   React.Dispatch<SetStateAction<boolean>>;
    songToPlaylist:     {};
    setSongToPlaylist:  Dispatch<SetStateAction<{}>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export interface User {
    username:string;
    password:string;
}

export interface GlobalsProps {
    children : ReactNode;
}

const Globals:React.FC<GlobalsProps> = ({children} : GlobalsProps ) : ReactElement => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [currSong, setCurrSong] = useState<{}>({});
    const [player, setPlayer] = useState<boolean>(false);
    const [currSongList, setCurrSongList] = useState< any[] >([]);
    const [currUser, setCurrUser] = useState<User>({
        username:"himanshu",
        password:"1234"
    });
    const [songToPlaylist, setSongToPlaylist] = useState({});
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