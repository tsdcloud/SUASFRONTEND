import React, { useState, useContext, useEffect, useRef } from 'react';
import { AUTHCONTEXT } from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import maleAvatar from '../assets/male-avatar-icon.png';
import femaleAvatar from '../assets/female-avatar-icon.png';
import avatar from '../assets/avatar-icon.png'
// import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';

import { useTranslation } from "react-i18next";

export default function Account() {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const { userData, setIsAuth, setUserData } = useContext(AUTHCONTEXT);
  const navigateToHome = useNavigate();

  const size = 'md';
  const classes = `
    rounded-full overflow-hidden
    ${size === 'xs' ? 'w-8 h-8' : size === 'sm' ? 'w-10 h-10' : 'w-12 h-12'}
    border border-orange-400
  `;

  // Création d'une référence pour le conteneur complet du composant
  const componentRef = useRef(null);

  // Gestion du clic sur le bouton toggle
  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Empêche le document de capter ce click
    setShowDropdown((prev) => !prev);
  };

  // Gestion du clic en dehors du composant
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserData(null);
    setIsAuth(null);
    navigateToHome("/signin");
  };

  return (
    <div className="relative" ref={componentRef}>
      <div className='flex items-center hover:cursor-pointer' onClick={handleDropdownClick}>
        <button
          className={classes}
        // onClick={handleDropdownClick}
        >
          <img
            src={
              userData?.photo !== null ? userData?.photo : ""
            }
            alt={`Avatar for ${userData?.name}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = avatar }}
            // onError={(e) => { userData?.gender === "MALE" ? e.target.src = maleAvatar : femaleAvatar; }}
          />
        </button>
        <div>
          <ChevronDownIcon className={`h-6 w-6 text-white transition-transform ${showDropdown ? 'rotate-180' : 'rotate-0'}`} />
        </div>
      </div>

      {showDropdown && (
        <div className={`cursor-pointer absolute top-full right-0 z-50 w-[200px] rounded-md shadow-sm bg-white animate-fade-in`}>
          <ul className="list-none p-2 w-full">
            <li className="py-1 border-b">
              <p className="text-sm">{t("connected_as")} {userData?.name}</p>
            </li>
            <li className="">
              <p className="text-sm py-1 hover:bg-gray-100 border-gray-200"><Link to="/profile" className="hover:bg-gray-100">Mon profil</Link></p>
            </li>
            <li className="">
              <p onClick={(e) => handleLogout(e)} className="text-sm text-red-500 py-1 hover:bg-gray-100 border-t border-gray-200">Se déconnecter</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}