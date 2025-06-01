import React, {useState, useContext, useEffect} from 'react'
import {AUTHCONTEXT} from '../context/AuthProvider'
import { Link, useNavigate } from 'react-router-dom';
import maleAvatar from '../assets/male-avatar-icon.png'
import femaleAvatar from '../assets/female-avatar-icon.png'

export default function Account() {

  var src ="https://i.pravatar.cc/150?u=a042581f4e29026704d" 

  const [showDropdown, setShowDropdown] = useState(false);
  // const [userData, setUserData] = useState({});
  const { userData, setIsAuth, setUserData } = useContext(AUTHCONTEXT)
  // console.log("is oth",isAuth)

  const navigateToHome = useNavigate()

  var size = "md" 
  const classes = `
    rounded-full overflow-hidden
    ${size === "xs" ? "w-8 h-8" : size === "sm" ? "w-10 h-10" : "w-12 h-12"}
    border border-orange-400
  `;

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserData(null);
    setIsAuth(null);
    navigateToHome("/signin")
  };

//  useEffect(()=>{
//   setUserData(JSON.parse(localStorage.getItem("userData")));
//  }, []);

  return (
    <div className="relative">
      <button
        className={classes}
        onClick={handleDropdownClick}
      >
        <img 
          src={
            userData?.photo != null ? userData?.photo : userData?.gender == "MALE" ? maleAvatar : femaleAvatar
            // userData?.photo != null ? userData?.photo : userData?.gender == "MALE" ? maleAvatar : femaleAvatar
          } 
          // alt={`Avatar for ${userData?.name}`} 
          className="w-full h-full object-cover" 
        />

        {/* {src ? (
          <img 
            src={
              !userData?.photo ? userData?.photo : avatarIcon
              // userData?.photo != null ? userData?.photo : userData?.gender == "MALE" ? maleAvatar : femaleAvatar
            } 
            // alt={`Avatar for ${userData?.name}`} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-200 text-gray-400">
            {userData?.name?.charAt(0).toUpperCase()}
          </div>
        )} */}
      </button>
      
      {showDropdown && (
        <div className=" cursor-pointer absolute top-full right-0 z-50 w-[200px] rounded-md shadow-sm bg-white">
          <ul className="list-none p-2">
            <li className="py-1 border-b">
              <p className="text-sm">Connecté en tant que {userData?.name}</p>
            </li>
            <li className=" py-1 w-full">
              <Link to="/profile" className="text-sm hover:bg-gray-100 w-full">Mon profil</Link>
            </li>
            {/* <li className=" hidden py-1 hover:bg-gray-100 border-t border-gray-200">
              <a href="." className="text-sm">Mes évènements</a>
            </li> */}
            <li className="">
              <p onClick={(e)=>handleLogout(e)} className="text-sm text-red-500 py-1 hover:bg-gray-100 border-t border-gray-200">Se déconnecter</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
