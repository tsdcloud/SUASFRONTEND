import React, { useEffect } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { Link } from "react-router-dom"

import webinar from '../assets/webinar.jpg'
import Carousel from '../Components/Caroussel'

function HomePage() {
  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])
  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen z-100 sm:items-center flex items-center flex-col m-3 justify-center lg:px-9 lg:py-1 lg:mx-[80px] animate-fade-in">
        {/* bg-gradient-to-tr from-[#044] to-primary  */}
        <Carousel />

        <span className="justify-center self-start px-2 py-1 sm:ml-4 md:ml-10 lg:ml-0 sm:mr-2 mt-10 ml-0 text-center text-black 
          rounded-md inline-flex items-center lg:justify-start bg-green-200 text-xs font-medium
          ring-1 ring-inset ring-gray-500/10"
        >
          Productivité
        </span>

        <div className="my-1 flex-col-reverse sm:flex-col-reverse sm:w-[680px] flex md:flex-col-reverse lg:flex-row lg:justify-between lg:items-start md:w-[720px] lg:w-full sm:items-center md:m-3 animate-fade-in">

          <div className="m-1 sm:m-0 sm:px-1 px-0 md:px-1 py-0 flex-col lg:justify-start flex-1 lg:flex-initial md:w-full lg:w-[600px] lg:py-0 lg:my-0 md:py-6 md:my-3 sm:w-full">

            <div className=" text-xl md:text-2xl font-extrabold text-neutral-900 md:mr-10 md:w-full">
              Boostez votre activité avec SUAS
            </div>
            <div className="mt-5 text-xs sm:text-sm md:text-md md:max-w-full sm:w-full">
              suas est l'application tout-en-un de gestion d'événements en ligne conçue pour les professionnels.<br />
              Simplifiez l'organisation de vos conférences, webinaires, ateliers et formations en ligne.
            </div>
            <div className='mt-6'>
              <Link to="/events" className=' text-xs md:text-xs justify-center py-3 px-3 drop-shadow-md bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-400 sm:text-[9px] w-[150px] md:w-[150px] text-center mt-2' >
                Voir les évènements
              </Link>
            </div>
          </div>

          <img
            src={webinar}
            alt="img webinar"
            className="object-cover rounded-md h-[300px] w-full ml-0 mr-0 lg:w-[500px] lg:mr-0 lg:ml-0 sm:w-full sm:h-[300px] md:h-[330px] md:m-0 md:w-full sm:flex sm:ml-1 sm:m-1 "
          />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage