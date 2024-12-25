import { ReactNode, useEffect, useState } from 'react'

type dataList = {
    dataList :       any[];   
    height? :         number  | null;
    width? :          number  | null;
    autoSlide? :      boolean | null;
    borderRadius?:    number  | null;
    floatingTitles?:  boolean | null;
    onClick:         (id:string)=>void;
}

const PlaylistCards = ( { dataList, height, width, borderRadius, autoSlide=false, floatingTitles=false, onClick }:dataList  ): ReactNode => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(()=>{
        let slideInterval : NodeJS.Timeout | null = null;
        if(autoSlide){
            slideInterval = setInterval(()=>{
                setCurrentIndex((prevIndex)=>{

                    // if new index more than array length return to index 0
                    if(prevIndex + 1 > dataList.length - 3) return 0;

                    // otherwise return the increased index
                    return prevIndex + 1;
                })
            },2000);
        }

        return ()=>{
            if(slideInterval) clearInterval(slideInterval);
        }
    },[autoSlide, dataList.length]);

  return (
    <div className={`w-full h-fit overflow-x-auto p-3 flex `}
        style={{
            scrollbarWidth:"none",
            msOverflowStyle:"none",
        }}
    >
        {/* playlist cards */}
        <div
            className={`flex transition-transform duration-500 ease-in-out gap-4 cursor-pointer`}
            style={{
                transform: `translateX(-${currentIndex * (width || 60 ) * 4}px)`,
            }}
            >
            {
                dataList.map((item, idx)=>(
                    <div key={idx} onClick={()=>onClick(item._id)} className={`relative overflow-hidden group`}
                        style={{
                            maxWidth:     `${width ? width*4 : 60}px`,
                            minWidth:     `${width ? width*4 : 60}px`,
                            minHeight:    `${height ? height*4 : 60}px`,
                            maxHeight:    `${height ? height*4 : 60}px`,
                            borderRadius: `${borderRadius ? borderRadius*4 : 0}px`
                        }}
                    >
                        <img src={item.cover_img} alt="something song" className={`w-full h-full group-hover:scale-110 transition-all duration-300 ease-in-out`} />
                        <div className={`text-white ${floatingTitles ? 'absolute w-full h-full bottom-0 text-opacity-0 bg-opacity-0 left-0 flex items-center justify-center group-hover:bg-opacity-60 group-hover:text-opacity-100 transform transition-all duration-300 ease-in-out bg-black' : 'w-full h-12 bg-gradient-to-t from-neutral-900 to-transparent absolute bottom-0 flex items-center justify-center'}`}>
                            {item.name}
                        </div>
                    </div>
                ))
                
            }
        </div>
    </div>
  )
}

export default PlaylistCards