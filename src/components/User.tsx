import React, { useContext } from 'react'
import { FaUserLarge } from 'react-icons/fa6'
import { GlobalContext } from '../contexts/Globals';
import { Link, useNavigate } from 'react-router-dom';
import { MdLogin, MdLogout } from 'react-icons/md';

type username = {
    username:string;
}

const User = ():JSX.Element => {
    const navigate = useNavigate();
    const { sidebarOpen, currUser, setCurrUser, player, setPlayer } = useContext(GlobalContext);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setCurrUser({
            username:"",
            password:"",
        });
        navigate("/");
        setPlayer(false);
    }
    const handleLogin = () => {
        navigate("/login");
        setPlayer(false);
    }
  return (
    <>
        <div className={`fixed bottom-0 w-full h-fit flex flex-col items-center justify-start ${sidebarOpen ? 'p-3' : 'p-2'}`}>
            <div className={`w-4/5 flex gap-3 items-center justify-evenly`}>
                {
                    currUser.username && 
                    <>
                        <div className={`w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center`}>
                            <FaUserLarge />
                        </div>
                        <div className={`text-md text-white ${sidebarOpen ? 'block' : 'hidden '}`}>
                            {currUser.username}
                        </div>
                    </>
                }
            </div>
            {
                currUser.username ? (
                    <div className={`w-full h-fit p-2`}>
                        <button onClick={handleLogout} type="button" className={`rounded-lg w-full h-full p-2 bg-emerald-500 text-white`}>
                            {sidebarOpen ? "Logout" : <MdLogout />}
                        </button>
                    </div>
                ) : (
                    <div className={`w-full h-fit p-2`}>
                        <button onClick={handleLogin} type="button" className={`rounded-lg w-full h-full p-2 bg-emerald-500 text-white`}>
                            {sidebarOpen ? "Login" : <MdLogin />}
                        </button>
                    </div>
                )
            }
        </div>
    </>
  )
}

export default User