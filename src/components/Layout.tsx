import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { GlobalContext } from '../contexts/Globals'
import Player from './Player'
const Layout = () => {
  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error("GlobalContext cannot be used outside of provider");
  }
  const { player } = globalContext;
  return (
    <>
      <Header />
      <div className={`absolute top-14 left-0 z-0 w-full h-[calc(100vh-56px)] overflow-y-scroll bg-neutral-600/20 backdrop-blur-lg flex transition-all duration-300 ease-in-out `}>
        <Outlet />
      </div>
      <Player hidden={!player} />
    </>
  )
}

export default Layout