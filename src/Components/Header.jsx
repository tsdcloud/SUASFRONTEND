import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoDesktop from "../assets/Logo Suas 1.png";
import LogoMobile from "../assets/suas_logo_mobile.png";
import { AUTHCONTEXT } from '../context/AuthProvider';
import Account from './Account';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

import { useTranslation } from "react-i18next";

function Header({ switchLanguage }) {
  const [token, setToken] = useState("");
  const { setUserData, isAuth, setIsAuth } = useContext(AUTHCONTEXT);

  // const pathname = window.location.pathname;
  // const isRoomRoute = pathname.startsWith('/room');
  // const isSignInRoute = pathname.startsWith('/signin');
  // const isSignOutRoute = pathname.startsWith('/signup');

  const location = useLocation();
  const pathName = location.pathname;

  const { t } = useTranslation();

  let userData = JSON.parse(localStorage.getItem("userData"));

  const [isOpen, setIsOpen] = useState(false);

  const [lang, setLang] = useState(localStorage.getItem("language"))

  const changeLanguage = (lng) => {
    switchLanguage(lng);
    setLang(lng)
    setIsOpen(!isOpen)
  };

  const toggleDropdownLang = () => {
    setIsOpen(!isOpen);
  };

  // Création d'une référence pour le conteneur complet du composant
  const componentRef = useRef(null);

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (token) {
      setToken(token);
    } else {
      setToken("")
    }
    
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserData(userData);
    }

    // console.log("okay");
    
  }, [pathName]);

  // console.log("token", token);

  // Gestion du clic en dehors du composant
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (pathName.includes("signin") || pathName.includes("signIn") || pathName.includes("signUp") || pathName.includes("signup")) {
    return (
      <div className="text-white flex items-end justify-end bg-primary">
        <div className='flex space-x-2'>
          <div className={`${lang !== 'en' ? 'text-orange-400' : ''} hover:cursor-pointer hover:text-orange-300`} onClick={() => changeLanguage("fr")}>
            FR
          </div>
          <div>
            |
          </div>
          <div className={`${lang === 'en' ? 'text-orange-400' : ''} hover:cursor-pointer hover:text-orange-300 pr-2`} onClick={() => changeLanguage("en")}>
            EN
          </div>
        </div>
      </div>
    )
  } else if (!pathName.includes("room")){
    return (
      <div className='bg-primary sticky w-full top-0 z-10 flex shadow-xl h-[60px] text-sm gap-5 justify-between 
        items-center sm:px-10 px-4 max-md:flex-wrap max-md:max-w-full'>

        <Link to='/' className='h-[40px] max-h-[40px] flex justify-center items-center'>
          <img src={LogoMobile} alt="Logo mobile" className="object-fit h-full w-full block sm:hidden md:hidden lg:hidden brightness-125" />
          <img src={LogoDesktop} alt="Logo desktop" className="object-fit h-full w-full hidden sm:block md:block lg:block brightness-125" />
        </Link>

        <div className="flex gap-5 items-center max-md:flex-wrap max-md:max-w-full">

          {/* <div className="relative" ref={componentRef}>
            <button
              onClick={toggleDropdownLang}
              className="flex items-center text-gray-300"
            >
              {<span className='text-bold'>{lang === "en" ? "EN" : "FR"}</span>} <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {isOpen && (
              <div className="absolute top-full mt-2 w-12 bg-white border border-gray-300 rounded shadow-lg  animate-fade-in">
                {["en", "fr"].map((lng) => (
                  <button
                    key={lng}
                    className="block w-full px-2 py-2 text-sm  hover:bg-gray-100"
                    onClick={() => changeLanguage(lng)}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div> */}

          {
            token ?
              (
                <Account />
              )
              :
              (
                <Link to="/signin" className='justify-center py-2 px-2 drop-shadow-xs bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-500 text-center'>
                  {t("login_text")}
                </Link>
              )
          }
        </div>
      </div>
    )

  }

}

export default Header