import React, {useContext, useState, useEffect} from 'react'
import { AUTHCONTEXT } from '../context/AuthProvider'
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button, Modal } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../Components/Header'
import Footer from '../Components/Footer'

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
  
  const handleChangeGender = (e) =>{
    // setGender(e.target.value);
    setEditInfoUser({...infoUser, gender: e.target.value})
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };


   const handleUpdateUser = () =>{
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
        footer={()=>{}}
      >

         
         <div className='text-sm'>
                      <div className='flex flex-col space-x-3'>
                            <div className=''>
                                  <div className='mt-2'>
                                    <label htmlFor="name">Nom : </label>
                                    <input type="text" id="name" 
                                    className='focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                    value={infoUser.name} onChange={(e) => setEditInfoUser({...infoUser, name: e.target.value})} />
                                  </div>

                                  <div className='mt-2'>
                                    <label htmlFor="surname">Prénom : </label>
                                    <input type="text" id="surname" 
                                    className='focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                    value={infoUser.surname} onChange={(e) => setEditInfoUser({...infoUser, surname: e.target.value})}/>
                                  </div>

                                  <div className='mt-2'>
                                    <label htmlFor="email">Adresse mail : </label>
                                    <input type="mail" id="email" 
                                    className='focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                    value={infoUser.email} onChange={(e) => setEditInfoUser({...infoUser, email: e.target.value})}/>
                                  </div>

                                  <div className='mt-2'>
                                    <label htmlFor="phone">Numéro de téléphone : </label>
                                    <input type="phone" id="phone" 
                                    className='focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                    value={infoUser.phone} onChange={(e) => setEditInfoUser({...infoUser, phone: e.target.value})}/>
                                  </div>
                            </div>
                            <div className='space-y-3'>

                                  <div className=' my-4 flex flex-row'>
                                       <div>
                                            Genre :
                                       </div>
                                        <div className=' mx-2 space-x-2 flex flex-row'>
                                            <div className='space-x-1 flex flex-row'>
                                                <label for="male"> Homme </label>
                                                <input 
                                                type="radio" 
                                                id="male" 
                                                name='gender'
                                                className='ml-1 focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                                value="MALE"
                                                checked={gender === 'MALE'}
                                                onChange={handleChangeGender}
                                                />

                                            </div>
                                            <div className='space-x-1'>
                                              <label htmlFor="female"> Femme </label>
                                                <input 
                                                type="radio" 
                                                id="female" 
                                                name='gender'
                                                className=' ml-1 focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                                value="FEMALE"
                                                checked={gender === 'FEMALE'}
                                                onChange={handleChangeGender}
                                                />

                                            </div>
                                        </div>

                                  </div>


                                  <div className='mt-2'>
                                    <label htmlFor="file">Photo de profil : </label>
                                    <input type="file" id="file" 
                                    className=' w-[300px] focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                    // value={infoUser.photo[0]} onChange={(e) => setEditInfoUser({...infoUser, photo: e.target.files})} 
                                    />
                                  </div>
                                  <div className='mt-2'>
                                    <label htmlFor="oldPassword">Définir votre ancien mot de passe : </label>
                                    <input type="text" id="oldPassword" 
                                    className=' w-[300px] focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                    value={checkPassword} onChange={(e)=>setCheckPassword(e.target.value)}/>
                                  </div>

                                  <div className='relative mt-2'>
                                    <label htmlFor="password">Définir votre nouveau mot de passe : </label>
                                    <div className=' w-100 flex items-center'>
                                      <input type={showPassword ?("text"):("password")} 
                                      id="password"
                                      className='focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded  px-10 py-2'
                                      />
              
                                          <span 
                                              className="absolute items-end cursor-pointer m-1"
                                              onClick={() => setShowPassword((prev) => !prev)}
                                            >
                                              {showPassword ? 
                                              
                                              (<EyeSlashIcon className="h-6 w-6 text-gray-500" />) : 
              
                                              (<EyeIcon className="h-6 w-6 text-gray-500" />) 
                                              
                                              }
                                          </span>
                                    </div>
                                  </div>
                            </div>
                      </div>
                        
                       <div className='flex flex-row  justify-end space-x-3 m-3'>
                        <button onClick={(e)=>handleUpdateUser(e)}
                        className='px-3 py-3 bg-green-600 w-[150px] rounded m-2 text-xs text-white'>
                          Enregistrer
                          </button>
                          <button onClick={handleCancel}
                          className='px-3 py-3 bg-gray-600 w-[150px] rounded m-2 text-xs text-white'>
                            Annuler
                          </button>
                       </div>
         </div>
         <Toaster />
            </Modal>
            <div>
                <div>
                <h1 className='text-lg font-mono font-semibold'>Mes informations</h1>
                    {userData && (
                    <div className='flex flex-col gap-3 text-sm m-5'>
                        <div>
                                <label className='font-light'>Nom d'utilisateur</label>
                                <p className='font-medium'>{userData.username}</p>
                        </div>
                        <div>
                                <label className='font-light'>Nom</label>
                                <p className='font-medium'>{userData.name}</p>
                        </div>
                        <div>
                                <label className='font-light'>Prénom</label>
                                <p className='font-medium'>{userData.surname == null ? "Pas de prénom" : userData.surname}</p>
                        </div>
                        <div>
                                <label className='font-light'>Sexe</label>
                                <p className='font-medium'>{userData.gender}</p>
                        </div>
                        <div>
                                <label className='font-light'>Numéro de téléphone</label>
                                <p className='font-medium'>{userData.phone}</p>
                        </div>
                        <div>
                                <label className='font-light'>Adresse mail</label>
                                <p className='font-medium'>{userData.email}</p>
                        </div>
                        <div>
                                <label className='font-light'>Photo de profil</label>
                                <img src={userData.photo} className='w-[50px] h-[50px] flex items-center justify-center rounded-full' alt={`profile-picture-${userData.name}`}/>
                        </div>
                    </div>
                    )}

                </div>
                <div className='cursor-pointer px-5 py-3 w-[200px] bg-green-700 rounded text-white text-xs'
                onClick={showModal}>
                Modifier mes informations
                </div>
            </div>
        </div>
    </>
  )
}

export default Profile