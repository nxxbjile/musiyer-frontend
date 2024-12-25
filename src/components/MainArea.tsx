import { useContext, useEffect, useState } from 'react'
import PlaylistLists from './PlaylistLists'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { GlobalContext } from '../contexts/Globals'

const MainArea = () => {
  const { id } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error("GlobalContext cannot be used outside of provider");
  }
  const { setCurrSongList } = globalContext;

  const getSongs = async () => {
    var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/playlists/${id}/songs`, {params:{page:page}});
    if(res.data.playlistKey){
      setData((prev) => [...prev, ...res.data.playlistKey.songs]);
    }
  }

  const handleMore = () => {
    setPage((prev)=> prev + 1);
  }

  useEffect(()=>{
    getSongs();
  },[page])

  useEffect(()=>{
    setCurrSongList((prev)=> [...prev, ...data]);
  },[data])
  return (
    <div className={`w-full pl-16 h-fit`}>
      <PlaylistLists data={data} type="songs" dataHandler={handleMore} />
    </div>
  )
}

export default MainArea