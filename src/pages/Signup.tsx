import axios from 'axios';
import React, { useState } from 'react'
import { FaCircleCheck } from 'react-icons/fa6';
import { ImCross } from 'react-icons/im';
import { Link } from 'react-router-dom'
import { PulseLoader } from 'react-spinners';

type User = {
  name:     string;
  username: string;
  email:    string;
  password: string;
}
interface UserRes {
  message:string;
  success:boolean;
}

const Signup = () => {
  const [user, setUser] = useState<User>({username:'',name:'', password:"", email:''});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<boolean>(false);

  const handleChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user,[key]:e.target.value});
    // console.log(user);
  }

  const handleSignup = async () => {
    if(
      user.username.length < 2 ||
      user.password.length < 2 ||
      user.email.length < 2 ||
      user.name.length < 2
    ){
      return;
    }
    setLoading(true);
    var res = await axios.post<UserRes>(`${import.meta.env.VITE_BASE_API_URL}/users/`,user);
    if(res){
      // console.log("res :", res);
    }
    if(!res){
      setCard(true);
      setError("something went wrong");
    }
    if(!res.data.success){
      setError(res.data.message);
      setCard(true);
    }
    if(res.data.success){
      setCard(true);
    }

    setLoading(false);
    setUser({
      username:"",
      name:"",
      password:"",
      email:""
    });
  }
  return (
    <div className={`relative w-screen h-screen pl-16 overflow-x-hidden flex items-center justify-center`}>
      {/* success and error toast */}
      {
        card &&
        <div className={`fixed top-3 right-3 w-fit min-h-14 p-3 rounded-lg bg-white flex gap-2 items-center justify-between`}>
          <div className={`w-12 h-full text-3xl`}>{!error ? <ImCross /> : <FaCircleCheck />}</div>
          <div className={`max-w-28 h-full text-neutral-700`}>{error}</div>
        </div>
      }
      {/* signup cards */}
      <div className={`w-2/5 h-4/6 rounded-2xl p-4 bg-neutral-400/20 backdrop-blur-xl flex items-center justify-center`}>
        <div className={`w-3/6 h-full flex flex-col items-center justify-between`}>
          <div className={`flex w-full h-full flex-col gap-3`}>
            <input type="text" onChange={(e)=>handleChange("name",e)} placeholder='name' className={`text-neutral-600 p-2 placeholder:text-neutral-600 rounded-md`} />
            <input type="text" onChange={(e)=>handleChange("username",e)} placeholder='username' className={`text-neutral-600 p-2 placeholder:text-neutral-600 rounded-md`} />
            <input type="text" onChange={(e)=>handleChange("email",e)} placeholder='email' className={`text-neutral-600 p-2 placeholder:text-neutral-600 rounded-md`} />
            <input type="password" onChange={(e)=>handleChange("password",e)} placeholder='password' className={`text-neutral-600 p-2 placeholder:text-neutral-600 rounded-md`} />
          </div>
          
            <div className={`w-full h-fit p-2 flex flex-col gap-2 items-center justify-center`}>
              <button type="button" onClick={handleSignup} className={`w-full p-2 rounded-lg bg-green-500 text-white`}>
                {loading ? <PulseLoader size={6} color='white' /> : 'Signup'}
              </button>
              <span className={`text-sm text-neutral-900`}>
                Or 
                <Link to="/login" className='underline px-2'>
                  Login
                </Link>
              </span>
            </div>
        </div>
        
      </div>
    </div>
  )
}

export default Signup