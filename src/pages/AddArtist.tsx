import React, { useState } from 'react'

type InputValue = {
    name:string,
    image:string
}

const AddArtist = () => {
    const [inputValue, setInputValue] = useState<InputValue>({
        name:"",
        image:"",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key:string) => {
        console.log(inputValue);
        setInputValue((prev)=> ({...prev, [key]:e.target.value}));
    }

  return (
    <div className={`w-screen h-screen pl-16 p-2 flex items-center justify-center`}>
        <div className={`w-2/6 min-h-60 rounded-2xl bg-neutral-500/50 backdrop-blur-lg border-2 border-gray-500 flex justify-between flex-col p-3`}>
            <div className={`w-full h-fit flex flex-col gap-3`}>
                <input type="text" value={inputValue["name"] || ""} onChange={(e)=>handleChange(e, "name")} placeholder='Artist name' className={`w-full rounded-lg p-1 focus:outline-none placeholder:text-neutral-400 px-3 text-neutral-600`} />
                <input type="text" value={inputValue["image"] || ""} onChange={(e)=>handleChange(e, "image")} placeholder='image(optional)' className={`w-full rounded-lg p-1 focus:outline-none placeholder:text-neutral-400 px-3 text-neutral-600`} />
            </div>
            <div className={`w-full h-fit flex items-center justify-center`}>
                <button type="button" className={`w-full p-2 bg-emerald-500 rounded-lg font-semibold text-white`}>submit</button>
            </div>
        </div>
    </div>
  )
}

export default AddArtist