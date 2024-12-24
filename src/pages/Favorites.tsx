import React, { useContext, useEffect, useState } from 'react'
import PlaylistLists from '../components/PlaylistLists'
import axios from 'axios';
import { useNavigate, } from 'react-router-dom';
import { GlobalContext } from '../contexts/Globals';

const Favorites = () => {
    const { currUser, setCurrSongList } = useContext(GlobalContext);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const getFavorites = async () => {
        var res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/users/${currUser.username}/favorites/songs`, {params:{page}});
        console.log(res.data.songs);
        setData((prev)=> [...prev, ...res.data.songs]);
    }

    useEffect(()=> {
        getFavorites();
    },[page]);

    useEffect(()=>{
        setCurrSongList((prev)=>[...prev, ...data]);
    },[data])

    useEffect(()=> {
        if(!currUser.username){
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