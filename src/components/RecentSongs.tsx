import SongsList from './SongsList'

const RecentSongs = () => {
  return (
    <div className={`h-full p-4 w-3/12`}>
      <div className={`text-white text-2xl font-semibold`}>
        Recently played
      </div>
      <div className={`py-3 fade-y-8 w-full overflow-y-scroll`}>
        <SongsList />
      </div>
    </div>
  )
}

export default RecentSongs