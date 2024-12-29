import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PulseLoader } from 'react-spinners';
import { GlobalContext } from '../contexts/Globals';

type User = {
  username: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  success?: boolean;
}

const Login = () => {
  const globalContext = useContext(GlobalContext);
  if(!globalContext){
    throw new Error("GlobalContext cannot be used outside of provider")
  }
  const { setCurrUser } = globalContext;
  const [user, setUser] = useState<User>({
    username:"",
    password:"",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (key: keyof User, e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user,[key]:e.target.value});
  }

  const handleLogin = async () => {
      if(
        user.username.length < 2 ||
        user.password.length < 2 
      ){
        return;
      }
    setLoading(true);
    var res = await axios.post<LoginResponse>(`${import.meta.env.VITE_BASE_API_URL}/users/login`,user);
    
    if(res){
      // console.log("res :", res);
    }
    if(res.data.success){
        localStorage.setItem("user", JSON.stringify(user));
        setCurrUser(user);
        navigate("/");
    }
    setLoading(false);
    setUser({
      username:"",
      password:""
    });
  }

  return (
    <div className={`relative w-screen h-screen pl-16 overflow-x-hidden flex items-center justify-center`}>
      {/* signup cards */}
      <div className={`w-2/5 h-4/6 rounded-2xl p-4 bg-neutral-400/20 backdrop-blur-xl flex items-center justify-center`}>
        <div className={`w-3/6 h-full flex flex-col items-center justify-between`}>
          <div className={`flex w-full h-full flex-col gap-3`}>
            <input type="text" onChange={(e)=>handleChange("username",e)} placeholder='username' className={`text-neutral-600 p-2 placeholder:text-neutral-600 rounded-md`} />
            <input type="password" onChange={(e)=>handleChange("password",e)} placeholder='password' className={`text-neutral-600 p-2 placeholder:text-neutral-600 rounded-md`} />
          </div>
          {/* button  */}
          <div className={`w-full h-fit p-2 flex flex-col gap-2 items-center justify-center`}>
            <button type="button" onClick={handleLogin} className={`w-full p-2 rounded-lg bg-green-500 text-white`}>
              {loading ? <PulseLoader size={6} color='white' /> : 'Login'}
            </button>
            <span className={`text-sm text-neutral-900`}>
              Or 
              <Link to="/signup" className='underline px-2'>
                Sign up
              </Link>
            </span>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Login