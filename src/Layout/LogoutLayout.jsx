import React, {useState, useContext, useEffect, useRef} from 'react'
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import {Link, useNavigate} from 'react-router-dom'
import { useFetch } from '../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import MapSuas from "../assets/Map suas.png"
import whiteLogo from "../assets/suas_logo.png"


import Preloader from '../Components/Preloader'
export default function LogoutLayout({children}) {
  return (
   <div className='h-screen w-screen relative overflow-hidden flex flex-col items-center'>
      <div className="absolute bg-gradient-to-t from-[#104e45] to-[#306b6c] h-full w-full flex justify-center items-center -z-[2]"/>
      {/* Header */}
      <div className='px-[20px] py-[20px] w-full flex justify-start sm:justify-start sm:px-6 lg:px-10 '>
        <Link to='/'>
          <img src={whiteLogo} className='w-[150px] sm:ml-0' alt='' />
        </Link>
      </div>
      <img
        className="fixed bg-cover bg-center w-[600px] h-auto bottom-0 left-[100px] -z-0 "
        src={MapSuas}
        alt=''
        // style={{ 
        //   background: "url('/assets/Map suas.png')", 
        //   backgroundSize:'cover',
        //   backgroundPosition:'top center'
        // }}
      />
      <div className='p-2 sm:p-7 flex lg:justify-around sm:flex-grow flex-col sm:flex-row md:flex-row mt-14 sm:w-full sm:justify-evenly space-x-1 sm:space-x-6 z-[3]'>
            <div className='flex flex-col text-white items-start h-full'>
              {/* <img src={whiteLogo} alt="" className='h-[100px] aspect-auto' /> */}
              <h2 className='px-3 sm:px-0 text-3xl lg:text-[45px] font-bold'>Bienvenue sur SUAS</h2>
              <p className='px-3 sm:px-0 text-xs sm:text-sm font-light'>L'application de gestion d'évènement par excellence.</p>
            </div>

            {children}
            {/* <div className='text-xs mt-2'> &copy; 2024 SUAS. Tous les droits sont réservés.</div> */}
            <Toaster />
      </div>
   </div>
  )
}
