import React, { useEffect } from 'react'
import webinar from "../assets/webinar.jpg"
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function AboutUs() {
    document.title = "A propos de nous"
    useEffect(() => {
        return () => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, []);
    return (
      <>
        <Header/>
            <div className=' sm:mb-6 sm:p-0 sm:pt-0 p-5 pt-1 mb-20 sm:justify-center min-h-screen'>
                <span className="sm:mt-6 sm:ml-6 justify-center self-start px-2 py-1 mt-20 ml-10 text-center text-black whitespace-nowrap 
                    rounded-md  inline-flex items-center bg-green-200  text-xs font-medium
                    ring-1 ring-inset ring-gray-500/10 ">
                    Qu'est ce que c'est ?
                </span>

                <div className="flex flex-col-reverse my-2 sm:flex-col lg:flex-row justify-between sm:justify-between sm:items-center sm:m-0 md:flex-col md:w-full">

                    <div className=" sm:flex-col w-full md:w-full sm:w-full px-1 py-3 flex-col md:text-sm md:px-9">

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 md:text-3xl">
                           SUAS est l'application idéale pour les professionnels de l'événementiel.
                        </h1>
                        <p className="mt-5 text-sm">
                          SUAS est une solution complète et évolutive pour la gestion d'événements professionnels.
                          Que vous soyez un organisateur d'événements expérimenté ou un débutant,
                          SUAS peut vous aider à organiser des événements réussis et mémorables
                          qui dépassent les attentes.
                        </p>
                        <p className="sm:text-sm mt-5 text-sm">
                        une application web conçue pour simplifier et rationaliser la gestion d'événements professionnels.
                        Elle offre aux organisateurs d'événements une solution complète pour gérer
                        tous les aspects de leurs événements, de la planification initiale
                        à l'exécution et au suivi post-événement.
                        </p>
                    </div>

                    <img src={webinar} alt="webinar" className="sm:my-5 w-full float-end md:my-5 md:w-full h-[350px] md:px-7 object-cover rounded-md md:rounded-lg lg:rounded-xl sm:w-full sm:px-0 sm:h-[300px]" />
                </div>
            </div>
        <Footer/>
      </>
    )
}

export default AboutUs