import React, { useContext, useEffect, useState } from 'react'
import { FaCompass } from 'react-icons/fa'
import { GoHeartFill, GoHomeFill } from 'react-icons/go'
import { IoAlbums } from 'react-icons/io5'
import { PiMusicNotesFill } from 'react-icons/pi'
import { GlobalContext } from '../contexts/Globals'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaUpload, FaUserGroup } from 'react-icons/fa6'

type active = string | null;
interface buttons {
    name:string,
    icon:JSX.Element,
    path:string;
}

const MenuList = () => {
    const { sidebarOpen } = useContext(GlobalContext);
    const [activeButton, setActiveButton] = useState<active>("Home");
    const location = useLocation();

    const buttons = [
        {
            name:"Home",
            icon:<GoHomeFill />,
            path:"/",
            pathname:"",
        },
        {
            name:"My Playlists",
            icon:<IoAlbums />,
            path:"/playlists",
            pathname:"playlists",
        },
        {
            name:"My Songs",
            icon:<PiMusicNotesFill />,
            path:"/songs",
            pathname:"songs",
        },
        {
            name:"Favorites",
            icon:<GoHeartFill />,
            path:"/favorites",
            pathname:"favorites",
        },
        {
            name:"Uplaod",
            icon:<FaUpload />,
            path:"/upload",
            pathname:"upload",
        }
    ];
    const navigate = useNavigate();

    const handleClick = (curr:buttons):void => {
        setActiveButton(curr.pathname);
        navigate(curr.path);
    }

  return (

    <div className={`w-full h-fit`}>
        {
            buttons.map((item, idx) => (
                <div key={idx} onClick={()=>handleClick(item)} className={`relative w-full p-2 flex gap-2 my-2 group cursor-pointer`}>
                    {item.pathname.toLowerCase() === activeButton && <div className={`w-1 h-full absolute rounded-tr-full rounded-br-full left-0 top-0 bg-white`} />}
                    <div className={` pl-2 text-2xl flex items-center justify-center group-hover:text-white transition-all duration-300 ease-in-out ${item.pathname === activeButton ? 'text-white font-semibold' : 'text-neutral-300'}`}>{item.icon}</div>

                    <div className={` text-md ${item.name === activeButton ? 'text-white' : 'text-neutral-300'} group-hover:text-white group-hover:font-bold transition-all duration-300 ease-in-out flex items-center justify-start font-normal overflow-hidden whitespace-nowrap ${sidebarOpen ? 'block' : 'hidden opacity-0 pointer-events-none'} `}>{item.name}</div>
                </div>
            ))
        }
    </div>
  )
}

export default MenuList