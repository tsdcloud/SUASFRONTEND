import React, { useContext, useState, useEffect } from 'react'
import { AUTHCONTEXT } from '../context/AuthProvider'
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button, Modal } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../Components/Header'
import Footer from '../Components/Footer'

import avatar from '../assets/avatar-icon.png'
import { EnvelopeIcon, IdentificationIcon, PhoneIcon, UserCircleIcon, UserIcon } from '@heroicons/react/16/solid';

function Profile() {
  document.title = "Mon profil";
  const { userData, setUser, isAuth } = useContext(AUTHCONTEXT)

  const [showPassword, setShowPassword] = useState(false)
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [infoUser, setInfoUser] = useState(userData)
  const [gender, setGender] = useState();
  const [checkPassword, setCheckPassword] = useState()
  const [newPassword, setNewPassword] = useState()
  const [editInfoUser, setEditInfoUser] = useState({})

  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const handleChangeGender = (e) => {
    setGender(e.target.value);
    setEditInfoUser({ ...infoUser, gender: e.target.value })
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };


  const handleUpdateUser = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  }

  return (
    <>
      <div className='min-h-screen w-full p-4'>
        <Modal
          title="Modifier mes informations"
          open={open}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          footer={() => { }}
        >
          <div className="p-1 bg-white max-w-2xl mx-auto">

            <form onSubmit={handleUpdateUser} className="space-y-6">

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    id="name"
                    value={infoUser.name}
                    onChange={(e) => setEditInfoUser({ ...infoUser, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Prénom */}
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    id="surname"
                    value={infoUser.surname}
                    onChange={(e) => setEditInfoUser({ ...infoUser, surname: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse mail</label>
                  <input
                    type="email"
                    id="email"
                    value={infoUser.email}
                    onChange={(e) => setEditInfoUser({ ...infoUser, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    value={infoUser.phone}
                    onChange={(e) => setEditInfoUser({ ...infoUser, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Genre */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Genre</p>
                <div className="flex items-center space-x-6">
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={gender === 'MALE'}
                      onChange={handleChangeGender}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>Homme</span>
                  </label>
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={gender === 'FEMALE'}
                      onChange={handleChangeGender}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>Femme</span>
                  </label>
                </div>
              </div>

              {/* Photo de profil */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                <input
                  type="file"
                  id="file"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                // value={infoUser.photo[0]} onChange={(e) => setEditInfoUser({...infoUser, photo: e.target.files})}
                />
              </div>

              {/* Mot de passe */}
              <div className="pt-4 space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={checkPassword}
                    onChange={(e) => setCheckPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 text-gray-500"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-2 py-2 sm:text-sm text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
          <Toaster />
        </Modal>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-6">Mes informations</h1>
          <div className=" bg-transparent rounded shadow-sm border border-gray-200 p-2 transition-all">

            {userData && (
              <div className='flex items-center justify-between bg-green-50 p-2 rounded'>
                <div className="space-y-5 text-sm text-gray-700">
                  {/* Nom d'utilisateur */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <UserIcon class="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Nom d'utilisateur</label>
                      <p className="font-medium text-gray-900">{userData.username ? userData.username : "non defini"}</p>
                    </div>
                  </div>

                  {/* Nom & Prénom */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <UserIcon class="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Nom complet</label>
                      <p className="font-medium text-gray-900">
                        {userData.name} {userData.surname ? userData.surname : ""}
                      </p>
                    </div>
                  </div>

                  {/* Sexe */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <IdentificationIcon class="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Sexe</label>
                      <p className="font-medium text-gray-900">{userData.gender}</p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <PhoneIcon class="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Téléphone</label>
                      <p className="font-medium text-gray-900">{userData.phone}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <EnvelopeIcon class="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Email</label>
                      <p className="font-medium text-gray-900">{userData.email ? userData.email : "non defini"}</p>
                    </div>
                  </div>

                </div>
                {/* Photo de profil */}
                <div className="pt-2 flex items-center gap-3">
                  {/* <span className="text-gray-500 w-8">&nbsp;</span> */}
                  <div className="flex items-center gap-3 w-full">
                    <img
                      src={userData.photo !== null ? userData.photo : ""}
                      alt="Profil"
                      className="w-full h-full sm:h-80 rounded-full object-cover border border-gray-200"
                      onError={(e) => { e.target.src = avatar }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bouton Modifier */}
            <div className='flex justify-center w-full'>
              <button
                onClick={showModal}
                className="mt-6 py-2 px-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm rounded-lg shadow-sm transition-colors focus:outline-none"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile