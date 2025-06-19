import React, { useContext, useState, useEffect } from 'react'
import { AUTHCONTEXT } from '../context/AuthProvider'
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button, Modal } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import { useFetch } from "../hooks/useFetch";

import avatar from '../assets/avatar-icon.png'
import { EnvelopeIcon, IdentificationIcon, PhoneIcon, UserCircleIcon, UserIcon } from '@heroicons/react/16/solid';

function Profile() {
  document.title = "Mon profil";
  const { userData, setUser, isAuth } = useContext(AUTHCONTEXT)
  const { handlePostFile } = useFetch();

  const [showPassword, setShowPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [files, setFiles] = useState([]);

  const [infoUser, setInfoUser] = useState({})

  const [gender, setGender] = useState();
  const [checkPassword, setCheckPassword] = useState()
  const [newPassword, setNewPassword] = useState()

  const [changePassword, setChangePassword] = useState(false)

  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const handleSubmitFiles = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles([file]);
    }
  };

  function updateLocalStorage(key, newValue) {
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  const handlePatch = async (url, data) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur PATCH:", error);
      throw error;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault()
    const url = `${import.meta.env.VITE_EVENTS_API}/users/${userData?.id}`
    const urlFile = `${import.meta.env.VITE_EVENTS_API}/files/upload`;

    let imageUrl


    // Upload de l'image

    if (files.length !== 0) {
      const imageRes = await handlePostFile(urlFile, files[0]);

      if (!imageRes.success) {
        toast.error(imageRes.message, { duration: 5000 });
        return;
      }

      imageUrl = imageRes.result[0].url;
    }


    let data = { ...infoUser, photo: imageUrl };

    if (!data.username) delete data.username

    if (!data.email) delete data.email

    if (!data.name) delete data.name

    if (!data.phone) delete data.phone

    if (!data.gender) delete data.gender

    if (!data.surname) delete data.surname

    if (!data.photo) delete data.photo

    if (changePassword) {
      if (!checkPassword) return toast.error('Veuillez renseigner le nouveau mot de passe', { duration: 3000 })

      if (!newPassword) return toast.error('Veuillez renseigner le mot de passe de confirmation', { duration: 3000 })

      if (checkPassword !== newPassword) return toast.error('Les deux mots de passes doivent être identiques', { duration: 3000 })

      if (newPassword.length < 4) {
        return toast.error("Le mot de passe doit contenir au moins 4 caractères.", { duration: 5000 });
      }

      data.password = newPassword
    }

    console.log("data", data);

    try {
      setConfirmLoading(true)
      const res = await handlePatch(url, data);

      console.log(res, "res");


      if (res.success) {
        toast.success("Informations mises a jour", { duration: 2000 })

        updateLocalStorage("userData", res.result)

        setTimeout(() => {
          // setOpen(false);
          setConfirmLoading(false);

          window.location.reload();
        }, 2000);

      }
      else {
        toast.error(res.message, { duration: 5000 });
        setConfirmLoading(false);
      }
    }
    catch (error) {
      toast.error("Une erreur est survenue", { duration: 5000 });
      setConfirmLoading(false)
      //   console.log("erreur");

    }
    finally {
      // setConfirmLoading(false)
    }
  }

  useEffect(() => {
    setInfoUser({
      username: userData?.username,
      email: userData?.email,
      name: userData?.name,
      phone: userData?.phone,
      gender: userData?.gender,
      surname: userData?.surname,
      photo: userData?.photo
    })
  }, [userData])

  console.log("infoUser", infoUser);

  const handleChangeGender = (e) => {
    setGender(e.target.value);
    setInfoUser({ ...infoUser, gender: e.target.value })
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

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

            <form onSubmit={handleUpdate} className="space-y-6">

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    id="name"
                    value={infoUser.name}
                    onChange={(e) => setInfoUser({ ...infoUser, name: e.target.value })}
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
                    onChange={(e) => setInfoUser({ ...infoUser, surname: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse mail</label>
                  <input
                    type="email"
                    id="courriel"
                    value={infoUser.email}
                    onChange={(e) => setInfoUser({ ...infoUser, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {/* Champ piège (caché) */}
                  <input
                    type="text"
                    name="email"
                    autoComplete="username"
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="number"
                    id="phone"
                    value={infoUser.phone}
                    onChange={(e) => setInfoUser({ ...infoUser, phone: e.target.value })}
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
                      checked={infoUser.gender === 'MALE'}
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
                      checked={infoUser.gender === 'FEMALE'}
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
                  accept="image/*"
                  onChange={handleSubmitFiles}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                // value={infoUser.photo[0]} onChange={(e) => setEditInfoUser({...infoUser, photo: e.target.files})}
                />
              </div>

              <div className='flex items-center justify-center'>
                {changePassword ?
                  <button type="button" onClick={() => setChangePassword(false)} className="bg-red-500 px-2 py-2 sm:text-sm text-xs hover:bg-red-400 text-white rounded-md transition">
                    annuler
                  </button>
                  :
                  <button type="button" onClick={() => setChangePassword(true)} className='px-2 py-2 sm:text-sm text-xs bg-orange-500 hover:bg-orange-400 text-white rounded-md transition'>
                    changer mot de passe
                  </button>
                }
              </div>


              {/* Mot de passe */}
              {changePassword &&
                <div className="pt-4 space-y-4">
                  <div className="relative">
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                    <div className="flex items-center">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        id="oldPassword"
                        value={checkPassword}
                        onChange={(e) => setCheckPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(prev => !prev)}
                        className="absolute right-3 text-gray-500"
                      >
                        {showOldPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>


                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Confirmez le mot de passe</label>
                    <div className="flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
              }

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
                  className={`${confirmLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} py-2 px-2 text-white text-xs sm:text-sm rounded-md transition`}
                >
                  {confirmLoading ? "Enregistrement..." : "Enregistrer"}
                </button>

                {/* <button
                  onClick={showModal}
                  className={`${confirmLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} mt-6 py-2 px-2 text-white text-xs sm:text-sm rounded-lg shadow-sm transition-colors focus:outline-none`}
                >
                  {confirmLoading ? "Modification..." : "Modifier"}
                </button> */}
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
                      <UserIcon className="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Nom</label>
                      <p className="font-medium text-gray-900">{userData.name ? userData.name : "non defini"}</p>
                    </div>
                  </div>

                  {/* Nom & Prénom */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <UserIcon className="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Prénom</label>
                      <p className="font-medium text-gray-900">
                        {userData.surname ? userData.surname : "Non défini"}
                      </p>
                    </div>
                  </div>

                  {/* Sexe */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <IdentificationIcon className="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Sexe</label>
                      <p className="font-medium text-gray-900">{userData.gender}</p>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <PhoneIcon className="h-6 w-6 text-gray-500" />
                    </span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Téléphone</label>
                      <p className="font-medium text-gray-900">{userData.phone}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 w-8">
                      <EnvelopeIcon className="h-6 w-6 text-gray-500" />
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