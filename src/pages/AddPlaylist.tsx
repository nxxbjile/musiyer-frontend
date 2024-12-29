import axios from 'axios'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../contexts/Globals'

type InputValue = {
    name:string,
    cover_img:string,
    description: string,
}

const AddPlaylist = () => {
    const [inputValue, setInputValue] = useState<InputValue>({
        name:"",
        cover_img:"",
        description:"",
    })
    const [loading, setLoading] = useState<boolean>(false);
    const globalContext = useContext(GlobalContext);
    if(!globalContext){
        throw new Error('GlobalContext cannot be used outside of provider');
    }
    const { currUser } = globalContext;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key:string) => {
        console.log(inputValue);
        setInputValue((prev)=> ({...prev, [key]:e.target.value}));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try{
            var res = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/playlists`,{ ...inputValue, ...currUser})
            if(res){
                console.log(res);
                setLoading(false);
                setInputValue({
                    name:"",
                    cover_img:"",
                    description:"",
                })
            }else{
                console.log("error");
                setLoading(false);
            }
        }catch(error){
            setLoading(false);
            console.log("error", error);
        }
    }

  return (
    <div className={`w-screen h-screen pl-16 p-2 flex items-center justify-center`}>
        <div className={`w-2/6 min-h-60 rounded-2xl bg-neutral-500/50 backdrop-blur-lg border-2 border-gray-500 flex justify-between flex-col p-3`}>
            <div className={`w-full h-fit flex flex-col gap-3`}>
                <input type="text" value={inputValue["name"] || ""} onChange={(e)=>handleChange(e, "name")} placeholder='playlist name' className={`w-full rounded-lg p-1 focus:outline-none placeholder:text-neutral-400 px-3 text-neutral-600`} />
                <input type="text" value={inputValue["cover_img"] || ""} onChange={(e)=>handleChange(e, "cover_img")} placeholder='image(optional)' className={`w-full rounded-lg p-1 focus:outline-none placeholder:text-neutral-400 px-3 text-neutral-600`} />
                <input type="text" value={inputValue["description"] || ""} onChange={(e)=>handleChange(e, "description")} placeholder='description' className={`w-full rounded-lg p-1 focus:outline-none placeholder:text-neutral-400 px-3 text-neutral-600`} />
            </div>
            <div className={`w-full h-fit flex items-center justify-center`}>
                <button type="button" onClick={handleSubmit} className={`w-full p-2 bg-emerald-500 rounded-lg font-semibold text-white`}>{loading ? 'loading...' : 'submit'}</button>
            </div>
        </div>
    </div>
  )
}

export default AddPlaylist