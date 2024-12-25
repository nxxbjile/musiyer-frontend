import { useNavigate } from 'react-router-dom';
import venyl from '../assets/venyl.jpeg'

interface ArtistsListProps {
    data:       any[];
    dataHandler : () => void;
}

const ArtistsList = ( {data, dataHandler }:ArtistsListProps ) => {
    const navigate = useNavigate();


    const handleClick = (item:any) => {
        navigate(`/artists/${item._id}`)
    }
    return (
        <div className={`w-full h-fit mt-4`}>
            {/* list of songs */}
            {
                data && data.map((item,idx)=>(
                    <div onClick={()=>handleClick(item)} key={idx} className={`w-full p-2 flex border-b border-neutral-500 items-center justify-between cursor-pointer hover:bg-white/10 transition-all duration-300 ease-in-out`}>
                        <div className={`flex min-w-8 w-fit h-full items-center justify-start`}>
                            <span className={`text-white px-4 self-center`}>{idx}</span>
                            <div className={`w-12 h-12 rounded-lg border overflow-hidden`}>
                                {
                                        <img src={item.cover_img ? item.cover_img : venyl} alt="something" className={`w-full h-full`} />
                                }
                            </div>
                        </div>
                        <div className={`w-1/4 h-full text-white flex items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap`}>
                          {item.name}
                        </div>
                        <div className={`w-1/4 h-full text-white flex items-center justify-end`}>
                            {item.songs.length}
                        </div>
                    </div>
                ))
            }
            {/* list of songs ENDS */}
    
            <div onClick={dataHandler} className={`w-full h-fit p-2 flex items-center justify-center`}>
                <button type="button" className={`p-3 px-5 text-white bg-neutral-500/60 rounded-md cursor-pointer hover:bg-white/40 transition-all duration-300 ease-in-out`}>more</button>
            </div>
        </div>
      )
    }
    
export default ArtistsList