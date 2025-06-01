import { useContext, useState } from "react";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AUTHCONTEXT } from "../context/AuthProvider";
import VerifyPermission from "../Utils/VerifyPermission";
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Roles from "../Utils/Roles";

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

  return (
    <>
      {!pathName.includes("room") && <Header />}

      <div className={`min-h-screen w-full max-w-[100vw] flex ${!pathName.includes("room") && 'p-2'}`}>
        {(token && !pathName.includes("room")) && (
          
              <div className="relative">

                    {/* Menu normale */}
                    <div className="hidden lg:block text-sm m-4 lg:sticky lg:top-[120px] md:sticky md:top-[120px] border border-1 outline-1 w-[250px] h-[130px] rounded">
                      <div className='m-5 space-y-2 '>
                        <div className='flex flex-row space-x-2 items-center'>
                          <ArrowLeftIcon className="h-6 w-6 text-green-500" />
                          <Link onClick={() => navigate(-1)} className=''>Retour</Link>
                        </div>
                        <ul className='ml-10 text-gray-500 flex flex-col'>
                          <Link to="/profile" className={`cursor-pointer ${pathName.includes("profile") && 'text-primary'}`}>Mon profil</Link>
                          <Link to="/events" className={`cursor-pointer ${pathName.includes("events") && 'text-primary'}`}>Evènements</Link>
                        </ul>
                      </div>
                      <br />
                      <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                        <div className="flex py-3 px-2 drop-shadow-xl bg-orange-400 text-white 
                        font-semibold rounded-lg shadow-md hover:bg-green-700 lg:text-sm sm:text-sm justify-center 
                        self-end mt-8 text-xs text-center">
                          <Link to="/events/create">Créer un évènement</Link>
                        </div>
                      </VerifyPermission>
                    </div>

                      {/* Menu flottant et bouton flottant */}
                    <div className="block lg:hidden fixed bottom-[25px] right-4 z-50">
                        <PlusIcon onClick={() => toggleMenu()} className="cursor-pointer h-12 w-12 border border-green-400 p-2 rounded-full shadow" />
                        
                        {/* Menu flottant */}
                        {
                          isMenuOpen && (
                              <div className="absolute right-0 bottom-14 bg-white border rounded-lg shadow-sm p-4 w-60 z-10">
                                  <div className='flex flex-row space-x-2 items-center'>
                                      <ArrowLeftIcon className="h-6 w-6 text-green-500" />
                                      <Link onClick={() => navigate(-1)} className=''>Retour</Link>
                                  </div>
                                  <ul className='text-gray-500 ml-9 text-sm sm:text-md flex flex-col'>
                                      <Link to="/profile" className={`cursor-pointer ${pathName.includes("profile") && 'text-primary'}`}>Mon profil</Link>
                                      <Link to="/events" className={`cursor-pointer ${pathName.includes("events") && 'text-primary'}`}>Evènements</Link>
                                  </ul>
                                  <br />
                                  <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                                      <div className="flex py-3 px-2 drop-shadow-xl bg-orange-400 text-white 
                                      font-semibold rounded-lg shadow-md hover:bg-green-700 text-xs sm:text-md justify-center 
                                      self-end mt-2 text-center">
                                          <Link to="/events/create">Créer un évènement</Link>
                                      </div>
                                  </VerifyPermission>
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
