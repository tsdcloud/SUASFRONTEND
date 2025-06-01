import React, {useState, useContext, useEffect, useRef} from 'react'
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import {Link, useNavigate} from 'react-router-dom'
import { useFetch } from '../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import MapSuas from "../assets/Map suas.png"
import whiteLogo from "../assets/suas_logo.png"

import { AUTHCONTEXT } from '../context/AuthProvider';
import Preloader from '../Components/Preloader'
import LogoutLayout from '../Layout/LogoutLayout';
export default function SignIn() {
  document.title = 'Se connecter'

  const { setIsAuth, setUserData } = useContext(AUTHCONTEXT)

  const [username, setUsername] = useState()
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const userNameRef = useRef(null)

  const navigateToHome = useNavigate()
  
  const { handlePost, err, setErr } = useFetch()

  const handleSubmitFormLogin = async (e) => {
    e.preventDefault()
    const url = `${import.meta.env.VITE_EVENTS_API}/users/login`
    const data = { username, password }
    setIsLoading(true);
    try {

      const response = await handlePost(url, data, false);
      if(response.error){
        toast.error(response.error, { duration: 5000});
        return;
      }

      let token = response?.token;
      localStorage.setItem('token', token);

      let userData = JSON.stringify(response?.current_user);
      localStorage.setItem('userData', userData);
      setIsAuth(token);
      setUserData(response?.current_user);
      navigateToHome("/")
      // if (!err) {
      //   // console.log("ola")
      //   // setToken(response?.token);

      // } 
      // else {
      //   // console.log("object : ", response.error)
      //   setErr(response.error);
      //   toast.error(err, { duration: 5000});
      // }
    } 
    catch (error) {
      console.log(error);
      toast.error("Une erreur serveur est survenue.", { duration: 5000});
      // toast.error(error?.error, { duration: 5000});
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    userNameRef.current.focus();

    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <LogoutLayout>
      <div className=' shadow-xl border rounded-xl w-[400px] h-[340px] bg-white'>
          <h1 className='mt-5 mx-4 font-bold text-2xl'>Se connecter</h1>
            <form className='mt-10 mx-9 text-sm flex flex-col space-y-4' onSubmit={(e)=>handleSubmitFormLogin(e)}>
              
              <div className='mt-2'>
                {/* <label htmlFor="username">Nom d'utilisateur ou adresse mail :<sup className='text-red-400'>*</sup> </label> */}
                <input type="text" id="username" 
                ref={userNameRef}
                className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2'
                placeholder="Nom d'utilisateur"
                value={username} onChange={(e) =>setUsername(e.target.value)}/>
              </div>

              <div className='relative mt-2'>
                {/* <label htmlFor="password">Mot de passe : <sup className='text-red-400'>*</sup></label> */}
                  <input type={showPassword ?("text"):("password")} 
                  id="password"
                  className='outline-0 border-b-2 focus:border-[#ef9247] border-[#104e45] w-full text-sm py-2 pr-4'
                  value={password} onChange={(e) =>setPassword(e.target.value)}
                  placeholder='Mot de passe *'
                  autoComplete={false}
                  />
                      <span 
                        className="absolute cursor-pointer top-[40%] right-0"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {
                              showPassword ? 
                              
                              (<EyeSlashIcon className="h-4 w-4 text-gray-500" />) : 

                              (<EyeIcon className="h-4 w-4 text-gray-500" />) 
                          
                          }
                      </span>
              </div>

              <button className={`${isLoading ? "bg-[#edaa73] cursor-not-allowed":" hover:bg-[#edaa73] bg-[#ef9247]"} text-white px-3 py-2 mt-5 rounded-full shadow-sm text-xs flex space-x-4 items-center`} disabled={isLoading}>
                {isLoading && <Preloader className='w-[30px] h-[30px]' />}
                <span>{isLoading ? "Connexion en cours...":"Se connecter"}</span>
              </button>

            </form>
            <p className='text-xs ml-8 m-3'>Pas de compte ? <Link to="/signup" className='text-[#104e45]'>Créez en un compte ici.</Link></p>
      </div>
    </LogoutLayout>
  )
}
