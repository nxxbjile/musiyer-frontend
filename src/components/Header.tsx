import React, { useContext } from 'react'
import Sidebar from './Sidebar'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../contexts/Globals'

const Header = () => {

  const { toggleSidebar } = useContext(GlobalContext);

  return (
    <div className={`fixed top-0 left-0 w-screen h-14 bg-neutral-800/20 backdrop-blur-md flex items-center justify-start z-40`}>
        <div onClick={toggleSidebar} className={`text-white font-bold text-2xl px-4 select-none`}>Musiyer</div>
        <Sidebar />
    </div>
  )
}

export default Header