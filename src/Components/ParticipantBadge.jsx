import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

import logoSuas from '../assets/Logo SUAS Blanc.png'

import logo150 from '../assets/Logo 150ans du PAD.png'

import bgEvent from '../assets/badgeEventImage.jpg'

const ParticipantBadge = ({ backgroundImage, logoImage, participantData, qrcode, eventData }) => {

  const ref = useRef();

  const downloadImage = () => {
    if (ref.current === null) return;

    toPng(ref.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `badge-${participantData.name}`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Erreur lors du téléchargement :', err);
      });
  };


  return (
    <div>
      <div
        className="relative w-[350px] h-[480px] rounded-lg overflow-hidden shadow-lg border border-blue-300"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 51, 102, 0.85) 80%), url(${bgEvent})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        ref={ref}
      >
        {/* Logo en haut à gauche */}
        <div className="absolute top-4 left-4 w-[60px] h-[60px] bg-white rounded-md p-1">
          <img
            src={logo150}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Cadre intérieur pour la bordure jaune avec marge */}
        <div className="absolute inset-4 rounded-lg border-2 border-white pointer-events-none" />


        {/* Cadre blanc centré (photo du participant) */}
        <div className="flex justify-center items-center absolute top-[90px] left-1/2 transform -translate-x-1/2 w-[180px] h-[180px] bg-white rounded-[20px] border-2 border-white overflow-hidden">
          {qrcode}
        </div>

        {/* Texte en bas */}
        <div className="absolute bottom-32 w-full text-center">
          <p className="text-white font-semibold text-xl drop-shadow-md">
            {/* {eventData.name.toUpperCase().includes("150") ? "PORT DE DOUALA-BONABERI" : eventData.name.toUpperCase()} */}
            PORT DE DOUALA-BONABERI
          </p>
          <p className="text-lime-400 font-bold text-pretty text-2xl drop-shadow-md">
            {/* {eventData.description.toUpperCase().includes("150") ? "150 ANS D’HISTOIRE" : ""} */}
            {/* {eventData.description.toUpperCase()} */}
            150 ANS D’HISTOIRE
          </p>
        </div>

        {/* Nom du participant */}
        <div className="absolute bottom-20 w-full text-center">
          <p className="text-white text-lg font-semibold">{participantData.gender === "FEMALE" ? "Mme " : "M. "}{participantData.name}</p>
        </div>

        {/* Logo du SUAS */}
        <div className="absolute bottom-6 w-full text-center flex items-center space-x-2 justify-center">
          <div>
            <p className="text-white text-xs italic font-sans">Powered By</p>
          </div>
          <img src={logoSuas} alt="" className="w-24" />
        </div>
      </div>

      <div className='flex justify-center items-center'>
        <button
          onClick={downloadImage}
          className="mt-4 text-xs sm:text-sm px-2 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Télécharger
        </button>
      </div>

    </div>
  );
};

export default ParticipantBadge;
