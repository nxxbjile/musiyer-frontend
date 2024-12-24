import React, { useContext, useEffect, useRef, useState } from 'react';
import { BsPauseCircleFill, BsPlayCircleFill } from 'react-icons/bs';
import { FaVolumeMute, FaVolumeUp, FaVolumeDown } from 'react-icons/fa';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { LuShuffle } from 'react-icons/lu';
import { RxLoop } from 'react-icons/rx';
import { TbTriangleFilled } from 'react-icons/tb';
import { GlobalContext, GlobalContextType } from '../contexts/Globals';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const formatTime = (time: number): string => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

type PlayerProps = {
  hidden: boolean;
};

const Player: React.FC<PlayerProps> = ( {hidden = false} ) => {
  const { currSong, setCurrSong, currSongList, currUser } = useContext(GlobalContext);
  const [isLiked, setIsLiked]   =  useState<boolean>(false);
  const [volume, setVolume]     =  useState<number>(50);
  const [isMuted, setIsMuted]   =  useState<boolean>(false);
  const [loopList, setLoopList] =  useState<boolean>(false);
  const [shuffle, setShuffle]   =  useState<boolean>(false);
  const [isPaused, setIsPaused] =  useState<boolean>(true);
  const [progress, setProgress] =  useState<number>(0);
  const [duration, setDuration] =  useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  const toggleLiked = (): void => {
    setIsLiked(!isLiked);
  };

  const toggleMuted = (): void => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const togglePaused = (): void => {
    if (isPaused) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
    setIsPaused(!isPaused);
  };

  const toggleLoopList = () => {
    setLoopList(!loopList);
    setShuffle(false);
  }

  const toggleShuffle = () => {
    setShuffle(!shuffle);
    setLoopList(false);
  }

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const time = Number(e.target.value);
    setProgress(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const calculateNext = (currentIndex: number) => {
    return (currentIndex + 1) % currSongList.length;
  };
  
  const calculateRandomNext = () => {
    return Math.floor(Math.random()*currSongList.length);
  }

  const playAudio = async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };
  

  const checkAudio = async (link: string): Promise<boolean> => {
    try {
      const res = await axios.head(link); // Use HEAD request to avoid downloading the entire file
      return res.status === 200;
    } catch (error) {
      return false; // Return false if the file is not accessible
    }
  };
  
  const handleNext = async () => {
    let currentIndex = currSongList.findIndex((song) => song._id === currSong._id);
    let nextIndex = undefined;

    const visitedIndices = new Set(); // To avoid infinite loops in shuffle mode

    const getNextIndex = () => {
      if (shuffle) {
        let randomIndex;
        do {
          randomIndex = calculateRandomNext();
        } while (visitedIndices.has(randomIndex) && visitedIndices.size < currSongList.length);
        return randomIndex;
      } else {
        return calculateNext(currentIndex);
      }
    };

    while (visitedIndices.size < currSongList.length) {
      nextIndex = getNextIndex();
      visitedIndices.add(nextIndex);

      const isAvailable = await checkAudio(currSongList[nextIndex].file_url);
      if (isAvailable) {
        setCurrSong(currSongList[nextIndex]);
        // Try to play the new song
        playAudio();
        return;
      }
    }

    console.error("No playable songs available in the playlist.");
  };

  const handlePrev = () => {
    var currentIndex = currSongList.findIndex((song)=> song._id === currSong._id);
    var prevIndex = (currentIndex - 1) % currSongList.length;
    setCurrSong(currSongList[prevIndex]);
  }

  const handleLike = async () => {
    if(isLiked){
      var res = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/users/${currUser.username}/favorites`,{songId:currSong._id.toString()},{
        headers:{
          'Content-Type':'application/json',
        }
      })
      console.log(res);
    }else{
      var res = await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/users/${currUser.username}/favorites/${currSong._id.toString()}`);
      console.log(res);
    }
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = (): void => {
        setProgress(audio.currentTime);
      };

      const setAudioDuration = (): void => {
        setDuration(audio.duration);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', setAudioDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('loadedmetadata', setAudioDuration);
      };
    }
  }, []);

  useEffect(() => {
    const enableAutoplay = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay is still blocked.");
        });
      }

      // Remove the event listener after the first interaction
      window.removeEventListener("click", enableAutoplay);
      window.removeEventListener("touchstart", enableAutoplay);
    };

    // Add event listeners for user interaction
    window.addEventListener("click", enableAutoplay);
    window.addEventListener("touchstart", enableAutoplay);

    return () => {
      window.removeEventListener("click", enableAutoplay);
      window.removeEventListener("touchstart", enableAutoplay);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(()=> {
    handleLike();
  },[isLiked])

  useEffect(()=>{
    setIsPaused(false);
    audioRef.current?.play();
  },[currSong]);

  useEffect(()=>{
    audioRef.current?.pause();
  },[hidden]);

  return (
    <div className={`fixed bottom-4 transform translate-x-1/2 w-[650px] h-36 border-gray-600 border-2 rounded-[35px] bg-neutral-600/30 backdrop-blur-lg text-white p-3 flex flex-col justify-between ${hidden ? "hidden" : "block"}`}>
      <div className={`w-full flex justify-between items-center`}>
        <div
          onClick={toggleLiked}
          className={`w-2/6 p-2 text-rose-500 text-2xl font-semibold cursor-pointer flex items-center justify-center`}
        >
          {isLiked ? <GoHeartFill /> : <GoHeart />}
        </div>

        <div className={`w-2/6 p-2 flex gap-2 items-center justify-center`}>
          <div onClick={toggleLoopList} className={`p-2 pl-3 text-lg ${ loopList ? 'text-white font-bold':'text-neutral-400'} hover:text-white cursor-pointer`}>
            <RxLoop />
          </div>

          {/* prev button */}
          <div className={`flex gap-2 items-center justify-center`}>
            <div onClick={handlePrev} className={`p-2 text-2xl text-neutral-400 hover:text-white cursor-pointer`}>
              <TbTriangleFilled className={`transform -rotate-90`} />
            </div>
            <div
              onClick={togglePaused}
              className={`p-2 text-5xl text-white cursor-pointer`}
            >
              {isPaused ? <BsPlayCircleFill /> : <BsPauseCircleFill />}
            </div>

            {/* next button */}
            <div onClick={handleNext} className={`p-2 text-2xl text-neutral-400 hover:text-white cursor-pointer`}>
              <TbTriangleFilled className={`transform rotate-90`} />
            </div>
          </div>
          <div onClick={toggleShuffle} className={`p-2 text-lg ${shuffle ? 'text-white' : 'text-neutral-400'} hover:text-white cursor-pointer`}>
            <LuShuffle />
          </div>
        </div>

        <div className={`w-2/6 flex items-center justify-end gap-2`}>
          <div
            onClick={() => setVolume(Math.max(0, volume - 10))}
            className={`text-lg text-neutral-400 hover:text-white cursor-pointer`}
          >
            <FaVolumeDown />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            onChange={handleVolumeChange}
            value={volume}
            className={`w-16 h-1 appearance-none cursor-pointer bg-white accent-blue-500 rounded-full`}
          />
          <div
            onClick={toggleMuted}
            className={`p-2 text-lg text-neutral-400 hover:text-white cursor-pointer`}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={currSong ? currSong.file_url : ""} onEnded={() => {
            if (loopList) {
              handleNext(); // Loop through the list
            } else if (shuffle) {
              handleNext(); // Shuffle to another track
            }
          }} />
      <div className={`py-2 w-full flex items-center justify-center`}>
        <div className={`text-white text-sm px-6 text-center items-center`}>
          {formatTime(progress)}
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          onChange={handleTimelineChange}
          value={progress}
          className={`w-3/5 h-1 rounded-full cursor-pointer`}
        />
        <div className={`text-white text-sm px-6 text-center items-center`}>
          {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default Player;