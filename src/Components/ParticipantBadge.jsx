import React from "react";

import logoSuas from '../assets/Logo SUAS Blanc.png'

import evImg from '../assets/Eventsdefault2.jpg'

const ParticipantBadge = ({ backgroundImage, logoImage, participantName, qrcode }) => {
  return (
    <div
      className="relative w-[350px] h-[480px] rounded-lg overflow-hidden shadow-lg border border-blue-300"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 51, 102, 0.85) 80%), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo en haut à gauche */}
      {/* <div className="absolute top-2 left-2 w-[80px] h-[80px] bg-white rounded-md p-1">
        <img
          src={logoImage}
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div> */}

      {/* Cadre intérieur pour la bordure jaune avec marge */}
      <div className="absolute inset-4 rounded-lg border-2 border-lime-400 pointer-events-none" />


      {/* Cadre blanc centré (photo du participant) */}
      <div className="absolute top-[90px] left-1/2 transform -translate-x-1/2 w-[180px] h-[180px] bg-white rounded-[20px] border-2 border-white overflow-hidden">
        {qrcode}
      </div>

      {/* Texte en bas */}
      <div className="absolute bottom-32 w-full text-center">
        <p className="text-white font-semibold text-xl drop-shadow-md">
          PORT DE DOUALA-BONABERI
        </p>
        <p className="text-lime-400 font-bold text-2xl drop-shadow-md">
          150 ANS D’HISTOIRE
        </p>
      </div>

      {/* Nom du participant */}
      <div className="absolute bottom-20 w-full text-center">
        <p className="text-white text-lg font-semibold">{participantName}</p>
      </div>

      {/* Logo du SUAS */}
      <div className="absolute bottom-6 w-full text-center flex items-center space-x-2 justify-center">
        <div>
          <p className="text-white text-xs italic font-sans">Powered By</p>
        </div>
        <img src={logoSuas} alt="" className="w-24"/>
      </div>
    </div>
  );
};

export default ParticipantBadge;
