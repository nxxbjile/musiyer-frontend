import { useContext, useEffect, useState } from 'react'
import PlaylistLists from '../components/PlaylistLists'
import axios from 'axios';
import { GlobalContext } from '../contexts/Globals';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const Playlists = () => {
  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error('GlobalContext cannot be used outside of provider');
  }
  const { currUser } = globalContext;
  const [data, setData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();

  const getPlaylists = async () => {
    var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/playlists/users/${currUser?.username}`,{params:{page:page}});
    if(res){
      setData(res.data.playlists);
    }
  }
  useEffect(()=>{
    getPlaylists();
  },[])

  return (
    <div className={`w-full h-full pl-16 overflow-x-hidden backdrop-blur-md relative pb-[300px]`}>
      <div onClick={()=>navigate("/playlist/add")} className={`fixed top-6 right-6 w-12 h-12 rounded-lg bg-emerald-500 text-white text-lg font-semibold flex items-center justify-center cursor-pointer`}>
        <FaPlus />
      </div>
      <div className={`w-full p-2`}>
        <div className={`w-fit text-2xl text-white p-2`}>
          My Playlists
        </div>
        <PlaylistLists dataHandler={()=>setPage((prev) => prev + 1)} data={data} type="playlists"/>
      </div>
    </div>
  )
}

export default Playlists