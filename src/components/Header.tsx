import { useContext } from 'react'
import Sidebar from './Sidebar'
import { GlobalContext } from '../contexts/Globals'
import PlaylistToast from './PlaylistToast'

const Header = () => {

  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error("GlobalContext cannot be used outside of provider");
  }
  const { toggleSidebar } = globalContext;

  return (
    <div className={`fixed top-0 left-0 w-screen h-14 bg-neutral-800/20 backdrop-blur-md flex items-center justify-start z-40`}>
        <div onClick={toggleSidebar} className={`text-white font-bold text-2xl px-4 select-none`}>Musiyer</div>
        <Sidebar />
        <PlaylistToast />
    </div>
  )
}

export default Header