import bgImage from '../assets/excuses.jpeg'
import SongsList from './SongsList'

const PlaylistInfo = () => {
  return (
    <div className={`relative h-fit ml-14 p-8 overflow-y-scroll flex flex-col gap-3 w-8/12 `}>
        <div className={`w-full h-14 text-4xl text-white font-semibold`}>
            playlist Name
        </div>
        <div className={`w-full h-fit rounded-3xl overflow-hidden bg-rose-500`}>
            <img src={bgImage} alt="playlist background image" className={`w-full aspect-video`} />
        </div>
        <div className={`w-full h-14 text-2xl text-white font-semibold`}>
            Songs
        </div>
        <div className={`w-full h-60 fade-y-8 overflow-y-scroll rounded-3xl p-2`}>
            <SongsList />
        </div>
    </div>
  )
}

export default PlaylistInfo