import { useContext } from 'react'
import { LuSearch } from 'react-icons/lu'
import MenuList from './MenuList'
import User from './User'
import { GlobalContext } from '../contexts/Globals'

const Sidebar = () => {
  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error('GlobalContext cannot be used outside of provider');
  }
  const { sidebarOpen } = globalContext;

  return (
    <div className={`fixed top-14 left-0 max-w-60 h-[calc(100vh-56px)] z-40 transition-all duration-300 ease-in-out bg-neutral-700/30 backdrop-blur-3xl border-r-2 border-neutral-500 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
        <div className={`relative w-full ${sidebarOpen ? 'p-2' : ' p-2'}`}>
            <input type="text" placeholder="Search..." className={` w-full rounded-lg text-neutral-400 bg-neutral-600/40 backdrop-blur-md focus:outline-none placeholder:text-neutral-400 ${sidebarOpen ? 'p-2 pl-14' : 'p-2 placeholder:text-transparent'} `} />
            <LuSearch className={`text-neutral-400 absolute top-1/2 ${sidebarOpen ? 'left-10' : 'left-6'} transform -translate-y-1/2 pointer-events-none`} />
        </div>
        <MenuList />
        <User />
    </div>
  )
}

export default Sidebar