import React, {useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import LogoDesktop from "../assets/suas_logo.png";
import LogoMobile from "../assets/suas_logo_mobile.png";
import {AUTHCONTEXT} from '../context/AuthProvider';
import Account from './Account';

function Header() {
    const [token, setToken] = useState("");
    const { setUserData, isAuth, setIsAuth} = useContext(AUTHCONTEXT);

    let userData = JSON.parse(localStorage.getItem("userData"));
    
    useEffect(()=>{
      let token = localStorage.getItem("token");
      if(token){
        setToken(token);
      }

      let userData = JSON.parse(localStorage.getItem("userData"));
      if(userData){
        setUserData(userData);
      }
    }, []);

  return (
    <div className='bg-primary sticky w-full top-0 z-10 flex shadow-xl h-[100px] text-sm gap-5 justify-between 
    items-center px-10 max-md:flex-wrap max-md:px-3 max-md:max-w-full'>

      <Link to='/' className='h-[40px] max-h-[40px] flex justify-center items-center'>
        <img src={LogoMobile} alt="Logo mobile" className="object-fit h-full w-full block sm:hidden md:hidden lg:hidden" />
        <img src={LogoDesktop} alt="Logo desktop" className="object-fit h-full w-full hidden sm:block md:block lg:block" />
      </Link>

      <div className="flex gap-5 items-center max-md:flex-wrap max-md:max-w-full">

        <Link to="/about-us" className=" hidden sm:block md:block lg:block flex-auto my-auto text-sm text-white max-md:text-sm">
                A Propos de nous
        </Link >

        {
          token ? (
            <Account />
            ): (

            <Link to="/signin" className='text-xs justify-center py-3 px-1 drop-shadow-xs bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-500 sm:text-sm w-[130px] text-center'>
                    Se connecter
            </Link>
          )
        }
      </div>
    </div>
  )
}

export default Header