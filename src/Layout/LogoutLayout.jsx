import React, { useState, useContext, useEffect, useRef } from 'react'
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import MapSuas from "../assets/Map suas.png"
import whiteLogo from "../assets/Logo Suas 1.png"
import { useTranslation } from "react-i18next";

export default function LogoutLayout({ children }) {

  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-gradient-to-t from-[#104e45] to-[#306b6c] animate-fade-in">

      {/* Header */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 flex justify-start z-10">
        <Link to="/">
          <img src={whiteLogo} className="w-[150px] brightness-125" alt="Logo SUAS" />
        </Link>
      </div>

      {/* Image décorative */}
      <img
        className="fixed bg-cover bg-center w-[600px] h-auto sm:bottom-0 left-[100px] -z-0"
        src={MapSuas}
        alt="Carte SUAS"
      />

      {/* Contenu principal scrollable si besoin */}
      <div className="flex-1 w-full overflow-y-auto px-4 sm:px-6 z-10">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 mt-6 pb-10">
          {/* Texte d’introduction */}
          <div className="text-white flex-1">
            <h2 className="text-3xl lg:text-5xl font-bold">{t("greeting_log_layout_text")}</h2>
            <p className="mt-2 text-sm sm:text-base font-light">
              {t("greeting_log_layout_text_description")}
            </p>
          </div>

          {/* Formulaire ou autre contenu */}
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

      <Toaster />
    </div>

  );
}
