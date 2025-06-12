import React, { useEffect } from 'react'
import webinar from "../assets/webinar.jpg"
import Header from "../Components/Header";
import Footer from "../Components/Footer";

import { useTranslation } from "react-i18next";

function AboutUs() {
  document.title = "A propos de nous"

  const { t } = useTranslation();

  
  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, []);
  
  return (
    <>
      {/* <Header /> */}
      <div className="my-4 px-4 mx-4 mb-20 flex flex-col justify-center animate-fade-in">
        {/* Badge */}
        <span className="self-start sm:ml-6 sm:mt-6 mt-6 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800 ring-1 ring-green-300">
          Qu'est-ce que c'est ?
        </span>

        {/* Contenu principal */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between w-full gap-6 mt-8 ">

          {/* Texte */}
          <div className="w-full px-2 md:px-5">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              SUAS est l'application idéale pour les professionnels de l'événementiel.
            </h1>
            <p className="mt-5 text-gray-700 text-base leading-relaxed">
              SUAS est une solution complète et évolutive pour la gestion d'événements professionnels.
              Que vous soyez un organisateur d'événements expérimenté ou un débutant,
              SUAS peut vous aider à organiser des événements réussis et mémorables
              qui dépassent les attentes.
            </p>
            <p className="mt-5 text-gray-700 text-base leading-relaxed">
              Une application web conçue pour simplifier et rationaliser la gestion d'événements professionnels.
              Elle offre aux organisateurs une solution tout-en-un pour gérer chaque étape de leurs événements :
              de la planification initiale à l'exécution et au suivi post-événement.
            </p>
          </div>

          {/* Image avec vignettage */}
          <div className="relative w-full md:px-1">
            <img
              src={webinar}
              alt="webinar"
              className="w-full h-[300px] md:h-[350px] object-cover rounded-xl shadow-md"
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none "
              style={{ background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.3) 80%)" }}>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutUs