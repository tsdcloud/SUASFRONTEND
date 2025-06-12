import { useContext, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AUTHCONTEXT } from "../context/AuthProvider";
import VerifyPermission from "../Utils/VerifyPermission";
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Roles from "../Utils/Roles";
import { dropdown } from "@nextui-org/react";

function DashboardLayout({ children }) {
  let token = localStorage.getItem("token");
  const location = useLocation();
  const pathName = location.pathname;
  const navigate = useNavigate();
  const { userData } = useContext(AUTHCONTEXT);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour gérer l'affichage du menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // console.log("entrer")
  };

  // Création d'une référence pour le conteneur complet du composant
  const componentRef = useRef(null);

  // Gestion du clic en dehors du composant
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* {!pathName.includes("room") && <Header />} */}

      <div className={`min-h-screen w-full max-w-[100vw] flex animate-fade-in ${!pathName.includes("room") && 'p-1 sm:p-5'}`}>
        {(token && !pathName.includes("room")) && (

          <div className="relative">
            {/* Menu normale */}
            <div className="hidden lg:block mx-4 lg:sticky top-[90px] md:sticky border border-1 outline-1 w-[250px] rounded">
              <div className='m-5 space-y-2 '>
                <div className='flex flex-row space-x-2 items-center hover:cursor-pointer' onClick={() => navigate(-1)}>
                  <ArrowLeftIcon className="h-6 w-6 text-green-500" />
                  <Link className='text-md'>Retour</Link>
                </div>
                <hr className="" />
                <ul className='ml-8 text-gray-500 text-sm flex flex-col space-y-2'>
                  {/* <Link to="/profile" className={`cursor-pointer ${pathName.includes("profile") && 'text-primary'}`}>Mon profil</Link> */}
                  <Link to="/categories" className={`cursor-pointer hover:text-green-500 ${pathName.includes("categories") && 'text-green-500'}`}>Catégories</Link>
                  <hr />
                  <Link to="/events" className={`cursor-pointer hover:text-green-500 ${pathName.includes("events") && 'text-green-500'}`}>Evènements</Link>
                  <hr />
                  <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                    <div className="space-y-2 flex flex-col">
                      <Link to="/users" className={`cursor-pointer hover:text-green-500 ${pathName.includes("users") && 'text-green-500'}`}>Utilisateurs</Link>
                      <hr />
                      <Link to="/permissions" className={`cursor-pointer hover:text-green-500 ${pathName.includes("permissions") && 'text-green-500'}`}>Permissions</Link>
                      <hr />
                      <Link to="/userRole" className={`cursor-pointer hover:text-green-500 ${pathName.includes("userRole") && 'text-green-500'}`}>Roles utilisateurs</Link>
                      <hr />
                      <Link to="/participantRole" className={`cursor-pointer hover:text-green-500 ${pathName.includes("participantRole") && 'text-green-500'}`}>Role participants</Link>
                      <hr />
                      <Link to="/eventRole" className={`cursor-pointer hover:text-green-500 ${pathName.includes("eventRole") && 'text-green-500'}`}>Role évènement</Link>
                    </div>
                  </VerifyPermission>
                </ul>
              </div>
              <br />
              {/* <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                    <div className="flex py-3 px-2 drop-shadow-xl bg-orange-400 text-white 
                    font-semibold rounded-lg shadow-md hover:bg-green-700  justify-center 
                    self-end mt-8 text-sm text-center">
                      <Link to="/events/create">Créer un évènement</Link>
                    </div>
                  </VerifyPermission> */}
            </div>

            {/* Menu flottant et bouton flottant */}
            <div className="block lg:hidden fixed bottom-[25px] right-4 z-50" ref={componentRef}>
              {!isMenuOpen ?
                <PlusIcon onClick={() => toggleMenu()} className="text-white cursor-pointer h-12 w-12 bg-green-400 border border-green-400 p-2 rounded-full shadow" />
                :
                <XMarkIcon onClick={() => toggleMenu()} className={`${isMenuOpen ? 'bg-primary' : 'bg-green-500'} text-white cursor-pointer h-12 w-12 border border-green-400 p-2 rounded-full shadow`} />
              }

              {/* Menu flottant */}
              {
                isMenuOpen && (
                  <div className="absolute right-0 bottom-14 bg-white border rounded-lg shadow-sm p-4 w-60 z-10 animate-fade-in">
                    <div className='flex flex-row space-x-2 items-center hover:cursor-pointer' onClick={() => navigate(-1)}>
                      <ArrowLeftIcon className="h-6 w-6 text-green-500" />
                      <Link >Retour</Link>
                    </div>
                    <hr className="my-2" />
                    <ul className='ml-8 text-gray-500 text-sm flex flex-col space-y-2'>
                      {/* <Link to="/profile" className={`cursor-pointer ${pathName.includes("profile") && 'text-primary'}`}>Mon profil</Link> */}
                      <Link to="/categories" className={`cursor-pointer hover:text-green-500 ${pathName.includes("categories") && 'text-green-500'}`}>Catégories</Link>
                      <hr />
                      <Link to="/events" className={`cursor-pointer hover:text-green-500 ${pathName.includes("events") && 'text-green-500'}`}>Evènements</Link>
                      <hr />

                      <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                        <div className="space-y-2 flex flex-col">
                          <Link to="/users" className={`cursor-pointer hover:text-green-500 ${pathName.includes("users") && 'text-green-500'}`}>Utilisateurs</Link>
                          <hr />
                          <Link to="/permissions" className={`cursor-pointer hover:text-green-500 ${pathName.includes("permissions") && 'text-green-500'}`}>Permissions</Link>
                          <hr />
                          <Link to="/userRole" className={`cursor-pointer hover:text-green-500 ${pathName.includes("userRole") && 'text-green-500'}`}>Roles utilisateurs</Link>
                          <hr />
                          <Link to="/participantRole" className={`cursor-pointer hover:text-green-500 ${pathName.includes("participantRole") && 'text-green-500'}`}>Role participants</Link>
                          <hr />
                          <Link to="/eventRole" className={`cursor-pointer hover:text-green-500 ${pathName.includes("eventRole") && 'text-green-500'}`}>Role évènement</Link>
                        </div>
                      </VerifyPermission>

                    </ul>
                    <br />
                    {/* <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                          <div className="flex py-3 px-2 drop-shadow-xl bg-orange-400 text-white 
                          font-semibold rounded-lg shadow-md hover:bg-green-700 text-xs justify-center 
                          self-end mt-2 text-center">
                              <Link to="/events/create">Créer un évènement</Link>
                          </div>
                        </VerifyPermission> */}
                  </div>
                )
              }
            </div>

          </div>

        )}

        <div className='w-full flex-grow flex-wrap'>
          {children}
        </div>
      </div>

      {!pathName.includes("room") && <Footer />}
    </>
  );
}

export default DashboardLayout;
