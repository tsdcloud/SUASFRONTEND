import React, { useEffect } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { Link } from "react-router-dom"

import suas from '../assets/suas.webp'
import webinar from '../assets/webinar.jpg'

function HomePage() {
  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])
  return (
    <>
      <Header />
      <div className="mt-4 min-h-screen z-100 sm:items-center flex items-center flex-col m-3 justify-center lg:p-9 lg:mx-[80px]">
      {/* bg-gradient-to-tr from-[#044] to-primary  */}
        <div 
        className="flex items-center sm:items-start justify-center overflow-hidden relative flex-col px-3 pt-5 pb-1 rounded-md shadow-sm min-h-[450px] sm:min-h-[400px] md:px-5 md:mr-2.5 w-full sm:w-[680px] md:w-[720px] lg:w-full sm:px-5 sm:pl-4">

              <img src={suas} alt="cover event" className="object-cover absolute inset-0 size-full " />
            
              <div className=" relative mt-32 md:mt-30 text-3xl md:text-5xl font-extrabold text-lime-400 sm:text-4xl">
                Professionnalisez vos meetings, calls, interviews avec SUAS
              </div>

              <div className="relative mt-2 text-sm md:text-lg text-white">
              un spectacle, une activité ou une grande expérience.
              </div>
                  
              <Link to="/events" className='flex relative py-3 px-3 drop-shadow-md bg-orange-500 text-white 
            font-semibold rounded-md shadow-md hover:bg-orange-400 gap-1 justify-center 
            self-end mt-8 text-xs sm:text-[10px] text-center whitespace-nowrap' >
                Explorer les évènements
              </Link>
            
        </div>
        <span className="justify-center self-start px-2 py-1 sm:ml-4 md:ml-10 lg:ml-0 sm:mr-2 mt-10 ml-0 text-center text-black 
            rounded-md inline-flex items-center lg:justify-start bg-green-200 text-xs font-medium
            ring-1 ring-inset ring-gray-500/10">
        Productivité
        </span>

        <div className="my-1 flex-col-reverse sm:flex-col-reverse sm:w-[680px] flex md:flex-col-reverse lg:flex-row lg:justify-between lg:items-start md:w-[720px] lg:w-full sm:items-center md:m-3">

          <div className="m-1 sm:m-0 sm:px-1 px-0 md:px-1 py-0 flex-col lg:justify-start flex-1 lg:flex-initial md:w-full lg:w-[600px] lg:py-0 lg:my-0 md:py-6 md:my-3 sm:w-full">

                      <div className=" text-xl md:text-2xl font-extrabold text-neutral-900 md:mr-10 md:w-full">
                        Boostez votre activité avec SUAS
                      </div>
                      <div className="mt-5 text-xs sm:text-sm md:text-md md:max-w-full sm:w-full">
                        suas est l'application tout-en-un de gestion d'événements en ligne conçue pour les professionnels.<br/> 
                        Simplifiez l'organisation de vos conférences, webinaires, ateliers et formations en ligne.
                      </div>
                      <div className='mt-3 my-[20px] mb-[20px]'>
                        <Link to="/events" className=' text-xs md:text-xs justify-center py-3 px-3 drop-shadow-md bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-400 sm:text-[9px] w-[150px] md:w-[150px] text-center mt-2' >
                                Voir les évènements
                        </Link>

                      </div>
          </div>


          <img 
          src={webinar} 
          alt="img webinar" 
          className="object-cover rounded-md h-[300px] w-full ml-0 mr-0 lg:w-[500px] lg:mr-0 lg:ml-0 sm:w-full sm:h-[300px] md:h-[330px] md:m-0 md:w-full sm:flex sm:ml-1 sm:m-1 " />
         

        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage