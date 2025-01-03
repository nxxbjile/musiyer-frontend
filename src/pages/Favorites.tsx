import { useContext, useEffect, useState } from 'react'
import PlaylistLists from '../components/PlaylistLists'
import axios from 'axios';
import { useNavigate, } from 'react-router-dom';
import { GlobalContext } from '../contexts/Globals';

const Favorites = () => {
    const globalContext = useContext(GlobalContext);
    if(!globalContext){
        throw new Error("GlobalContext cannot be used outside of provider");
    }
    const { currUser, setCurrSongList } = globalContext;
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const getFavorites = async () => {
        var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/users/${currUser?.username}/favorites/songs`, {params:{page}});
        setData((prev)=> [...prev, ...res.data.songs]);
    }

    useEffect(()=> {
        getFavorites();
    },[page]);

    useEffect(()=>{
        setCurrSongList((prev)=>[...prev, ...data]);
    },[data])

    useEffect(()=> {
        if(!currUser?.username){
            navigate("/login");
        }
    },[])

  return (
    <div className={`w-full pl-16`}>
        <PlaylistLists data={data} dataHandler={()=> setPage((prev)=> prev + 1)} type="songs" />
    </div>
  )
}

export default Favorites