import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link, useRouteError } from 'react-router-dom'
import { useFetch } from "../hooks/useFetch";
import { Button, Modal } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import Preloader from "../Components/Preloader.jsx"
import { AUTHCONTEXT } from '../context/AuthProvider.jsx';
import { CalendarDaysIcon, ExclamationCircleIcon, CheckCircleIcon, ClipboardDocumentCheckIcon, CheckBadgeIcon, XCircleIcon, UserPlusIcon, QrCodeIcon } from "@heroicons/react/16/solid";
import VerifyPermission from '../Utils/VerifyPermission.jsx';
import Roles from '../Utils/Roles.js';
import WorkhshopStatus from '../Utils/WorkshopStatus.js';
import ParticipantForm from '../Components/participantForm.jsx';
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline';

import avatarIcon from '../assets/avatar-icon.png'
import atelierEv from '../assets/Atelier.webp'
import QRScanner from '../Components/QRCode/QRScannerEvent.jsx';
import QRCodeGenerator from '../Components/QRCode/QRCodeGenerator.jsx';
import QRScannerWorksop from '../Components/QRCode/QRScannerWorksop.jsx';
import ParticipantDetail from '../Components/ParticipantDetail.jsx';


function Workshop() {
  document.title = "Voir les détails"
  const { handleFetch, err, setErr, handlePatch, handlePost } = useFetch();
  const { id } = useParams();

  const [scannCode, setScannCode] = useState(false);

  const [signedIn, setSignedIn] = useState(false)

  const { userData } = useContext(AUTHCONTEXT);
  const [open, setOpen] = useState(false);
  const [openModerator, setOpenModerator] = useState(false);
  const [participantViewDetail, setParticipantViewDetail] = useState(false);

  const [idWorkshop, setIdWorkshop] = useState("")
  const [showWorkshop, setShowWorkshop] = useState();
  const [participantInfo, setParticipantInfo] = useState();
  const [showParticipant, setShowParticipant] = useState([]);
  const [showMessage, setShowMessage] = useState({})

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedPhoto, setSelectedPhoto] = useState();
  const [selectedRole, setSelectedRole] = useState();


  const [showAllUsers, setShowAllUser] = useState([])

  const [showAllRole, setShowAllRole] = useState([])
  const [filteredRole, setFilteredRole] = useState([])

  const [pendingList, setPendingList] = useState([]);
  const navigate = useNavigate()



  const [filteredRoleByModerator, setFilteredRoleByModerator] = useState([])

  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedUserRoleName, setSelectedUserRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [dataForm, setDataForm] = useState();
  const [getIdParticipant, setGetIdParticipant] = useState();
  const [participantModerator, setParticipantModerator] = useState({});
  console.log(participantModerator, "participantModerator");

  const [infoPath, setInfoPath] = useState("moderator")
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false)

  const [participantFormIsOpen, setParticipantFormIsOpen] = useState(false)


  console.log(userData, 'this is user data')

  const handleBecomeParticipant = async () => {

    setIsLoadingButton(true);
    const urlParticipant = `${import.meta.env.VITE_EVENTS_API}/participants/create`
    const [idRoleOnly] = filteredRole
    const data = {
      workshopId: idWorkshop,
      ownerId: userData?.id,
      name: userData?.name,
      description: userData?.description || "Participant",
      // participantRoleId: filteredRole[0]?.id,
      participantRoleId: idRoleOnly?.id,
      photo: userData?.photo,
      isOnlineParticipation: true
    }
    // console.log("dt", data)
    try {
      const response = await handlePost(urlParticipant, data);
      const err = response.error

      if (response.success) {
        setDataForm(response.result)
        // console.log("resp resuls22", response)
        if (response.result && response?.result?.id) {
          setGetIdParticipant(response?.result.id);
          // console.log("idParticipant", response.id);
          await approvedParticipant(response?.result.id);

        } else {
          console.error("ID du participant manquant dans la réponse");
        }

        // navigateToMyEvents(`/events/workshop/${}`)
        seeWorkshopById();
      } else {
        toast.error(err, { duration: 5000 });
        return;
      }
    } catch (err) {
      toast.error(err, { duration: 5000 });
    }
    finally {
      setIsLoadingButton(false);
    }

  }

  // console.log("this is the info participants", participantModerator);

  const seeWorkshopById = async (id) => {
    // const url = `${import.meta.env.VITE_EVENTS_API}/workshops/${id}`
    let url = ""
    if (!idWorkshop) {
      url = `${import.meta.env.VITE_EVENTS_API}/workshops/${id}`
    } else {
      url = `${import.meta.env.VITE_EVENTS_API}/workshops/${idWorkshop}`
    }

    try {
      setIsLoading(true);
      const response = await handleFetch(url)

      if (response.success) {
        console.log("Workshop", response);
        setShowWorkshop(response.result);

        let participantList = response?.result.participants;
        // console.log("this is the info participants", participantList);
        handleGetCurrentParticipantInfo(participantList);

        // let participant = response?.participants?.filter(item =>item?.isApproved === true);
        let participant = response?.result.participants.filter(item => item?.participantRole?.name !== "Moderator" && item?.isApproved == true);
        // console.log("voici les prticipants ",participant);
        setShowParticipant(participant);

        // console.log("show part", showParticipants)
        let moderator = response?.result.participants.filter(item => item?.participantRole?.name == "Moderator" && item?.isApproved == true);

        setParticipantModerator(moderator);

        // console.log("part Moder", participantModerator)
        let pendingParticipants = response?.result.participants?.filter(participant => participant?.isApproved === false && participant?.participantRole?.name !== Roles.STAFF);
        setPendingList(pendingParticipants);

      }
    }
    catch (error) {
      console.error("Erreur lors de la récupération de l'atélier:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleShowAllUser = async () => {
    const urlUsers = `${import.meta.env.VITE_EVENTS_API}/users`
    try {
      setIsLoading(true);
      const response = await handleFetch(urlUsers)
      if (response.success) {
        const filteredUsers = response.result.data.map((user) => ({
          id: user.id,
          name: user.name,
          photo: user.photo
        }));

        // console.log("users",filteredUsers)

        setShowAllUser(filteredUsers);
      }
    }
    catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleShowAllRole = async () => {
    const urlRoles = `${import.meta.env.VITE_EVENTS_API}/participantsroles/`
    try {
      setIsLoading(true);
      const response = await handleFetch(urlRoles)
      if (response.success) {
        const Role = response.result.data.map((role) => ({
          id: role.id,
          name: role.name
        }));
        console.log("Rôles", Role)
        setShowAllRole(Role);
        setFilteredRole(Role?.filter(role => role?.name !== "Moderator"));
        setFilteredRoleByModerator(Role?.filter(role => role?.name === "Moderator"));
      }
    }
    catch (error) {
      console.error('Erreur lors de la récupération des roles :', error);
    }
    finally {
      setIsLoading(false);
    }
  };


  /**
   * Returns the current participant information
   * @param {object[]} participantsList 
   * @returns {object}
   */
  const handleGetCurrentParticipantInfo = async (participantsList) => {
    let isParticipant = participantsList.find(participant => participant.ownerId === userData?.id);
    if (isParticipant) {
      setParticipantInfo(isParticipant);
      return isParticipant
    }

    return;
  }

  useEffect(() => {
    seeWorkshopById(id);
    handleShowAllUser();
    handleShowAllRole();
    setIdWorkshop(id);
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    // console.log("p", showParticipants)
  }, [id]);

  useEffect(() => {
    let signed = showWorkshop?.participants?.some(e => e.ownerId === userData?.id)
    setSignedIn(signed)

    // console.log("signed", signed, "userID", idUser, "userData?.id", userData?.id);

  }, [showWorkshop])


  const handleApproveWorkshop = async (itemId) => {
    const url = `${import.meta.env.VITE_EVENTS_API}/workshops/approved/${itemId}`
    const confirmation = window.confirm("Êtes-vous sûr de vouloir approuver cet atélier ?");

    if (confirmation) {
      setIsLoadingButton(true)
      try {
        const response = await handlePatch(url)

        if (response.success) {
          seeWorkshopById();
        }
      }
      catch (error) {
        console.error("Erreur lors de la modification de l'atélier:", error);
      }
      finally {
        setIsLoadingButton(false)
      }
      console.log("L'atélier a été approuvé.");
    } else {
      console.log("L'approbation a été annulée.");
    }

  }

  const [isApprovingParticipant, setIsApprovingParticipant] = useState(false);
  const approvedParticipant = async (idParticipant) => {
    const urlParticipant = `${import.meta.env.VITE_EVENTS_API}/participants/approved/${idParticipant}`
    setIsApprovingParticipant(true);
    try {
      const approuvesRes = await handlePatch(urlParticipant);

      if (approuvesRes.success) {
        seeWorkshopById();
      }
      // navigateToMyWorkshop(`/mysettings/my-events`)
    }
    catch (error) {
      console.error("Erreur lors de l'approbation du participant':", error);
    } finally {
      setIsApprovingParticipant(false);
    }
    console.log("Le participant a été approuvé.");

  }

  const [isCreatingModerator, setIsCreatingModerator] = useState(false);

  const createParticipant = async () => {
    setIsCreatingModerator(true);
    const urlParticipant = `${import.meta.env.VITE_EVENTS_API}/participants/create`
    const data = {
      workshopId: id,
      ownerId: selectedUser,
      name: selectedUserName,
      description: description,
      participantRoleId: selectedRole,
      photo: selectedPhoto,
      isOnlineParticipation: false
    }
    // console.log("dt", data)
    try {
      const response = await handlePost(urlParticipant, data);
      const err = response.error

      if (response.success) {
        setDataForm(response.result)
        console.log("resp resulst", response)
        if (response && response.id) {
          setGetIdParticipant(response.id);
          console.log("idParticipant", response.id);
          await approvedParticipant(response.id);
        } else {
          console.error("ID du participant manquant dans la réponse");
        }
        setOpenModerator(false);
        seeWorkshopById()
      } else {
        toast.error(err, { duration: 5000 });
        return;
      }
    } catch (err) {
      toast.error(err, { duration: 5000 });
    } finally {
      setIsCreatingModerator(false)
    }
  }

  const content = {
    1: (
      <div>
        {/* Premier formulaire : sélection de l'utilisateur */}
        <select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            const selectedUserObj = showAllUsers.find(user => user.id === e.target.value);
            setSelectedUserName(selectedUserObj?.name || '');
            setSelectedPhoto(selectedUserObj?.photo || '');
          }}
          className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full h-[40px] sm:text-sm"
        >
          <option value="">Sélectionnez un utilisateur</option>
          {showAllUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <br />

        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            const selectedUserObj = showAllRole.find(role => role.id === e.target.value);
            setSelectedUserRoleName(selectedUserObj?.name || '');
          }}
          className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full h-[40px] sm:text-sm"
        >
          <option value="">Définir son rôle</option>
          {filteredRole.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

      </div>
    ),
    2: (
      <div>
        {/* Second formulaire : sélection des rôles et création du participant */}
        <div>
          Nom :
          <input type='text' value={selectedUserName}
            onChange={(e) => setSelectedUserName(e.target.value)}
            className='w-full border border-1 rounded h-[30px]' />
        </div>

        <div>
          Donnez une description :
          <textarea type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full border border-1 rounded outline-0.1' />
        </div>

        <div className='p-4'>
          Rôle attribué : {/* Affichage du rôle sélectionné */}
          <input type='text' defaultValue={selectedUserRoleName}
            className=' text-gray-500 disabled cursor-not-allowed w-full border border-1 rounded h-[30px]' disabled readOnly />
        </div>
      </div>
    ),
  };

  const contentModerator = {
    1: (
      <div>
        <select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            const selectedUserObj = showAllUsers.find(user => user.id === e.target.value);
            setSelectedUserName(selectedUserObj?.name || '');
            setSelectedPhoto(selectedUserObj?.photo || '');
          }}
          className="border focus:outline-none border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 block w-full h-[40px] sm:text-sm"
        >
          <option value="">Sélectionnez un utilisateur</option>
          {showAllUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <br />

        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            const selectedUserObj = showAllRole.find(role => role.id === e.target.value);
            setSelectedUserRoleName(selectedUserObj?.name || '');
          }}
          className="border focus:outline-none border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 block w-full h-[40px] sm:text-sm"
        >
          <option value="">Définir son rôle</option>
          {filteredRoleByModerator.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

      </div>
    ),
    2: (
      <div>
        {/* Second formulaire : sélection des rôles et création du participant */}
        <div>
          Nom :
          <input type='text' value={selectedUserName}
            onChange={(e) => setSelectedUserName(e.target.value)}
            className='pl-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full h-[40px] sm:text-sm' />
        </div>

        <div>
          Donnez une description :
          <textarea type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full h-24 sm:text-sm' />
        </div>

        <div className='pt-1'>
          Rôle attribué : {/* Affichage du rôle sélectionné */}
          <input type='text' defaultValue={selectedUserRoleName}
            className=' p-4 text-gray-500 disabled cursor-not-allowed w-full border border-1 rounded h-[30px]' disabled readOnly />
        </div>
      </div>
    ),
  };



  const showModal = () => {
    setOpen(true);
  };

  const showModalModerator = () => {
    setOpenModerator(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const handleCancelModerator = () => {
    setOpenModerator(false);
  };


  return (
    <div className='animate-fade-in w-full sm:w-[700px] md:w-[770px] lg:[890px] justify-center items-center flex flex-col'>
      {
        isLoading ? (
          <div className='flex flex-col justify-center items-center'>
            <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
            <p className='text-xs'>Chargement…</p>
          </div>
          // <p className="flex items-center justify-center text-center text-green-700">Chargement...</p>
        ) :
          (

            <>
              <div className=' w-full lg:w-full'>

                <Modal
                  title="Créer un modérateur"
                  open={openModerator}
                  // onOk={handleOk}
                  onCancel={handleCancelModerator}
                  footer={() => { }}
                >
                  <div>
                    {contentModerator[currentStep]}
                    <div className="flex justify-end items-center space-x-2">
                      {currentStep !== 1 && (
                        // <Button className="my-4" onClick={() => setCurrentStep(currentStep - 1)}>Précédent</Button>
                        <button className={`text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl mt-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500`} onClick={() => setCurrentStep(currentStep - 1)}>
                          Précédent
                        </button>
                      )}
                      {currentStep === 2 ? (
                        <button type="primary" className={`text-xs sm:text-sm border border-1 py-2 px-2 mt-2 drop-shadow-xl text-white font-semibold rounded-lg shadow-md hover:bg-orange-400 ${isCreatingModerator ? "bg-orange-300" : "bg-orange-500"}`} onClick={createParticipant}>{isCreatingModerator ? "Création en cours..." : "Enregistrer"}</button>
                      ) : (
                        currentStep !== 2 && (
                          // <Button type="primary" className="my-4 bg-black" onClick={() => setCurrentStep(currentStep + 1)}>
                          //   Suivant
                          // </Button>
                          <button className={`text-xs sm:text-sm border border-1 py-2 mt-2 px-2 drop-shadow-xl bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500`} onClick={() => setCurrentStep(currentStep + 1)}>
                            Suivant
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <Toaster />
                </Modal>


                {/* show workshop details */}
                <div className=' justify-center p-4'>
                  {
                    showWorkshop && (

                      <div key={showWorkshop.id} className='rounded-lg'>
                        <div className='flex justify-between items-center pb-2'>
                          <div className='flex items-center pb-2'>
                            <div className='hover:cursor-pointer md:hidden mr-2' onClick={() => navigate(-1)}>
                              <ArrowLeftIcon className="h-6 w-6 text-green-500" />
                            </div>
                            <h1 className="font-semibold text-gray-900">Atelier {showWorkshop?.name}</h1>
                          </div>

                          {/* <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                            {!scannCode ?
                              <button className="flex py-2 px-2  bg-orange-400 text-white rounded-md shadow-md hover:bg-orange-300  self-end text-sm text-center"
                              >
                                <div onClick={() => setScannCode(true)} className='flex items-center text-xs sm:text-sm'><QrCodeIcon className='w-4 h-4 sm:w-5 sm:h-5 mr-1' />Scan</div>
                              </button>
                              :
                              <button className="flex py-2 px-2  bg-red-400 text-white 
                                                rounded-md shadow-md hover:bg-red-500 
                                                self-end text-sm text-center"
                              >
                                <span onClick={() => setScannCode(false)} className=' text-xs sm:text-sm'>Annuler</span>
                              </button>}
                          </VerifyPermission> */}

                          <VerifyPermission expected={[Roles.STAFF]}
                            // received={userData?.participantsOwner?.find((e) => e?.workshopId === showWorkshop?.id)?.participantRole?.name}
                            received={showWorkshop?.participants?.find(e => e.ownerId === userData?.id)?.participantRole?.name}
                          >
                            {!scannCode ?
                              <button className="flex py-2 px-2  bg-orange-400 text-white 
                                                  rounded-md shadow-md hover:bg-orange-300  
                                                  self-end text-sm text-center"
                              >
                                {/* <Link to="/users/create">Créer</Link> */}
                                <div onClick={() => setScannCode(true)} className='flex items-center text-xs sm:text-sm'><QrCodeIcon className='w-4 h-4 sm:w-5 sm:h-5 mr-1' />Scan</div>
                              </button>
                              :
                              <button className="flex py-2 px-2  bg-red-400 text-white 
                                                  rounded-md shadow-md hover:bg-red-500 
                                                  self-end text-sm text-center"
                              >
                                {/* <Link to="/users/create">Créer</Link> */}
                                <span onClick={() => setScannCode(false)} className=' text-xs sm:text-sm'>Annuler</span>
                              </button>}
                          </VerifyPermission>
                        </div>

                        <div
                          className=' aspect-video h-[300px] w-full  flex justify-center items-center relative border-[1px] rounded-lg'>
                          <div className="h-full w-full"
                            style={{ background: `url(${showWorkshop.photo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                            <img
                              src={showWorkshop.photo}
                              onError={(e) => {
                                e.currentTarget.parentNode.style.backgroundImage = `url(${atelierEv})`;
                              }}
                              className="hidden"
                              alt=""
                            />
                          </div>
                          <img src={showWorkshop.photo} alt=''
                            className='rounded-lg object-contain w-full h-full absolute' onError={(e) => { e.target.src = atelierEv; }} />
                        </div>

                        <div className='m-2 lg:my-2 md:m-2 flex sm:flex-row sm:items-center justify-between lg:m-0 lg:w-full'>
                          <div className='text-xs flex flex-row items-center font-mono text-orange-500 font-bold space-x-1'>
                            <div>
                              <CalendarDaysIcon className="h-4 w-4 mr-1" />
                            </div>
                            <div>
                              <span>début: </span>
                              <span>
                                {new Intl.DateTimeFormat('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }).format(new Date(showWorkshop?.startDate))}
                              </span>
                            </div>
                            <div>
                              <span>fin: </span>
                              <span>
                                {new Intl.DateTimeFormat('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }).format(new Date(showWorkshop?.endDate))}
                              </span>
                            </div>
                          </div>
                          {/* {!signedIn && <div className="flex items-center text-xs text-white sm:text-md p-2 space-x-1 bg-green-600 rounded hover:cursor-pointer hover:bg-green-500">
                            <UserPlusIcon className="h-4 w-4 text-white " />
                            <span>S'inscrire</span>
                          </div>} */}
                          {
                            !showWorkshop?.participants?.some(participant => participant.ownerId == userData?.id) ?
                              // userData?.userRole?.name !== Roles.SUPPORT
                              // &&
                              <div onClick={() => setParticipantFormIsOpen(true)} className="flex items-center text-xs text-white sm:text-md p-2 space-x-1 bg-green-600 rounded hover:cursor-pointer hover:bg-green-500">
                                {/* <UserPlusIcon className="h-4 w-4 text-white " /> */}
                                <span>S'inscrire</span>
                              </div>
                              :
                              <div className='text-xs p-2 text-center text-green-400 rounded sm:mt-0 bg-green-100'>
                                Inscrit
                              </div>
                          }
                          {/* {
                            showWorkshop.isApproved === false ? (
                              <div className='flex flex-col items-center sm:flex-row space-x-2  space-y-3 sm:space-y-0 text-xs'>
                                <div className="flex items-center text-xs sm:text-md">
                                  <XCircleIcon className="h-4 w-4 text-red-500 sm:mr-2" />
                                  <span>Non Approuvé</span>
                                </div>
                                <div onClick={() => { handleApproveWorkshop(showWorkshop?.id) }}
                                  className={`${isLoadingButton ? "bg-green-700  cursor-not-allowed" : " hover:bg-green-700"} bg-green-700 text-white px-2 py-2 cursor-pointer rounded shadow-sm text-xs`}
                                  disabled={isLoadingButton} >

                                  {isLoadingButton ? "Approbation en cours..." : "Approuver cet atélier"}
                                </div>

                              </div>
                            ) :
                              (
                                <div className="hidden sm:flex items-center text-xs sm:text-md">
                                  <CheckBadgeIcon className="h-4 w-4 text-green-500 " />
                                  <span>Approuvé</span>
                                </div>
                              )
                          } */}

                        </div>
                        <div className='lg:m-0 lg:w-full space-y-2 pl-2 '>

                          <div className='font-bold text-md sm:text-xl'>{showWorkshop?.name}</div>
                          <hr />
                          <div className='text-xs justify-center items-center'>Description : <span className='font-sans'>{showWorkshop?.description}</span></div>
                          <hr />
                          <div className='text-xs '>Propriétaire : <span className='font-sans'>{showWorkshop?.owner?.name}</span></div>
                          <hr />
                          <div className='text-xs'>Salle : <span className='font-sans'>{showWorkshop?.room}</span></div>
                          <hr />
                          <div className="text-xs">Type : <span className='font-sans'> {showWorkshop?.isPublic === true ? "Public" : "Privé"}</span></div>
                          <hr />
                          {/* <div className="text-xs ">État : <span className='font-sans'>{showWorkshop?.isOnlineWorkshop === false ? "En présentiel" : "En ligne"}</span></div> */}
                          <div className="text-xs ">État : <span className='font-sans'>{showWorkshop?.status === WorkhshopStatus.STARTED ? "En cours" : showWorkshop?.status === WorkhshopStatus.FINISHED ? "Terminé" : "Pas commencé"}</span></div>
                          <hr />
                          <div className='text-xs '>Prix : <span className='font-sans'>{showWorkshop?.price} Xaf</span> </div>
                          <hr />
                          <div className='text-xs '>Places : <span className='font-sans'>{showWorkshop?.numberOfPlaces}</span> </div>

                          {showWorkshop?.program !== null ?
                            <div className='space-y-2'>
                              <hr />
                              <p className='text-xs'> Programme : <a href={showWorkshop?.program} target='_' className='font-sans underline text-green-700 hover:text-green-500'>Télécharger le programme</a></p>
                            </div>
                            :
                            ""
                          }

                          {showWorkshop?.participants.length !== 0 ?
                            <div className='space-y-2'>
                              <hr />
                              <p className='text-xs'> Participants validé(s) : <span className='font-sans'>{showParticipant?.length}/{showWorkshop?.numberOfPlaces}</span></p>
                            </div>
                            :
                            ""
                          }

                          {showWorkshop?.participants.length !== 0 ?
                            <div className='space-y-2'>
                              <hr />
                              <p className='text-xs'> Participants inscrits : <span className='font-sans'>{showWorkshop?.participants?.filter(e => e?.participantRole.name !== Roles.STAFF).length}</span></p>
                            </div>
                            :
                            ""
                          }

                          {(showWorkshop?.participants?.find(participant => participant.ownerId == userData?.id)?.length !== 0 && showWorkshop?.participants?.find(participant => participant.ownerId == userData?.id)?.isApproved) &&
                            <div className='text-xs p-2 text-center text-green-400 rounded sm:mt-0 bg-green-100'>
                              Inscription approuvée
                            </div>
                          }

                          {(showWorkshop?.participants?.find(participant => participant.ownerId == userData?.id)?.length !== 0 && showWorkshop?.participants?.find(participant => participant.ownerId == userData?.id)?.isApproved === false) &&
                            <div className='text-xs p-2 text-center text-orange-400 rounded sm:mt-0 bg-orange-100'>
                              Inscription en attente d'approbation
                            </div>
                          }

                          <div className='py-4 flex items-center justify-center'>
                            {
                              showWorkshop?.isApproved === false ? (
                                null
                              ) : (

                                <>
                                  <VerifyPermission
                                    expected={[Roles.SUPPORT, Roles.MODERATOR]}
                                    received={
                                      (userData?.userRole?.name === Roles.SUPPORT && showWorkshop
                                        ?.participants?.some(participant => participant?.ownerId === userData?.id)) ? Roles.SUPPORT : null
                                      // userData?.userRole?.name === (Roles.SUPPORT && showWorkshop
                                      //   ?.participants?.some(participant => participant?.ownerId === userData?.id)) ? Roles.SUPPORT :
                                      //   showWorkshop
                                      //     ?.participants?.find(participant => participant?.ownerId === userData?.id)
                                      //     ?.participantRole?.name === Roles.MODERATOR ? Roles.MODERATOR : "failed"
                                      // (
                                      //   userData?.userRole?.name === Roles.SUPPORT || 
                                      //   showWorkshop
                                      //   ?.participants?.find(participant => participant?.ownerId === userData?.id )
                                      //   ?.participantRole?.name === Roles.MODERATOR) ? Roles.SUPPORT : "failed"
                                    }
                                  >
                                    <div className=''>
                                      <a target="_blank" href={`/room/${idWorkshop}`} className='text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-400'>
                                        Démarrer l'atélier
                                      </a>
                                    </div>
                                  </VerifyPermission>
                                  <VerifyPermission
                                    expected={[Roles.PARTICIPANT, Roles.EXPERT]}
                                    received={
                                      showWorkshop?.participants?.find(participant => participant?.ownerId === userData?.id)?.participantRole?.name
                                    }
                                  >
                                    {
                                      showWorkshop?.status === WorkhshopStatus.STARTED
                                      && showWorkshop?.participants.filter(item => item?.ownerId === userData?.id
                                        && item?.isApproved == false).length === 0 &&
                                      <div className='my-5'>
                                        <a target="_blank" href={`/room/${idWorkshop}`} className='text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-400'>
                                          Rejoindre l'atélier
                                        </a>
                                      </div>
                                    }
                                  </VerifyPermission>
                                </>
                              )
                            }
                          </div>


                          {
                            showWorkshop?.participants?.some(participant => participant?.ownerId === userData?.id) &&
                            <div>
                              <hr />
                              <QRCodeGenerator userData={userData?.id} />
                            </div>
                          }


                        </div>
                      </div>
                    )
                  }
                  <hr className='mt-6 sm:hidden' />
                </div>
              </div>


              {
                showWorkshop && (

                  showWorkshop.isApproved === false ? (
                    <div className='flex justify-center items-center space-x-2 p-2 my-2'>
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      <div className='text-xs sm:text-md'>Vous devez d'abord approuver cet atélier</div>
                    </div>
                  ) : (
                    <div className=' w-full lg:my-10 mb-10 sm:p-0'>
                      <div className='flex flex-col-reverse sm:flex-row justify-between items-center space-x-2 px-2 mt-3'>

                        <div className='my-4 sm:my-0 px-0 sm:px-2'>
                          <ul className='flex space-x-3'>
                            <li onClick={() => setInfoPath("moderator")} className={`p-2 text-gray-500 cursor-pointer ${infoPath === "moderator" && 'border-b-green-500 border-b-2'} text-xs`}>{participantModerator.length > 0 ? <span className='p-1'>{participantModerator.length}</span> : null}Modérateur(s)</li>
                            <li onClick={() => setInfoPath("participant")} className={`p-2 text-gray-500 cursor-pointer  ${infoPath === "participant" && 'border-b-green-500 border-b-2'} text-xs`}>{showParticipant.length > 0 ? <span className='p-1'>{showParticipant.length}</span> : null}Participant(s)</li>
                            <VerifyPermission
                              expected={[Roles.SUPPORT]}
                              // received={userData?.userRole?.name}
                              received={userData?.userRole?.name === Roles.SUPPORT ? userData?.userRole?.name : showWorkshop
                                ?.participants?.find(participant => participant?.ownerId === userData?.id)
                                ?.participantRole?.name === Roles.MODERATOR ? Roles.SUPPORT : null}
                            >
                              <li onClick={() => setInfoPath("pending")} className={`p-2 text-gray-500 cursor-pointer  ${infoPath === "pending" && 'border-b-green-500 border-b-2'} text-xs`}>En attente {pendingList.length > 0 ? <span className=''>({pendingList.length})</span> : null}</li>
                            </VerifyPermission>
                          </ul>
                        </div>

                        <div className='space-y-3 sm:space-y-0 sm:space-x-1 sm:flex sm:flex-row sm:items-center justify-center'>

                          <div className='space-y-3 sm:my-6 flex-row sm:flex-normal'>

                            <VerifyPermission
                              expected={[Roles.SUPPORT]}
                              // received={userData?.userRole?.name}
                              received={userData?.userRole?.name === Roles.SUPPORT ? userData?.userRole?.name : showWorkshop
                                ?.participants?.find(participant => participant?.ownerId === userData?.id)
                                ?.participantRole?.name === Roles.MODERATOR ? Roles.SUPPORT : null}
                            >
                              <div className='px-4 text-xs sm:px-3'>
                                {/* <Button type="primary" onClick={()=>setParticipantFormIsOpen(true)}> Créer un participant </Button> */}
                                <button className={`text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500`} onClick={() => setParticipantFormIsOpen(true)}>
                                  Créer un participant
                                </button>
                              </div>
                            </VerifyPermission>
                          </div>
                          {/* <div className='px-4 text-xs sm:px-3'>
                            {
                              showWorkshop?.participants?.filter(participant => participant.ownerId == userData?.id).length < 1 &&
                              // userData?.userRole?.name !== Roles.SUPPORT
                              // &&
                              <button onClick={() => setParticipantFormIsOpen(true)}
                                className={
                                  isLoadingButton ?
                                    "cursor-not-allowed text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl bg-green-700 text-white font-semibold rounded-lg shadow-md" :
                                    "text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500"
                                }
                                disabled={isLoadingButton}>
                                {isLoadingButton ? "Inscription en cours..." : "S'inscrire"}
                              </button>
                            }
                          </div> */}
                        </div>
                      </div>


                      <hr className='mx-4' />
                      <div className='sm:mx-8 mt-5 animate-fade-in mx-2'>
                        {
                          infoPath === "moderator" ? (
                            // <div className="space-x-3 items-center bg-gray-100 h-[50px] rounded-md sm:rounded-lg my-1 p-2">
                            <div className="h-56 overflow-hidden overflow-y-auto">
                              {
                                participantModerator.length > 0 ? (

                                  participantModerator.map((item) => (
                                    <div key={item?.id}
                                      className="w-full bg-gray-100 rounded-md flex items-center gap-2 p-4 my-2  animate-fade-in">
                                      <div className="w-10 h-10 rounded-full border border-gray-500">
                                        <img
                                          className="w-full h-full object-cover rounded-full"
                                          src={item?.photo !== null ? item?.photo : ""}
                                          alt=""
                                          onError={(e) => { e.target.src = avatarIcon; }}
                                        />
                                      </div>
                                      <div>
                                        <div className="text-xs">{item.name}</div>
                                        <div className="text-xs">{item.participantRole.name}</div>
                                      </div>
                                    </div>
                                  ))
                                ) :
                                  ( // Affichage du bouton "Créer un modérateur" si aucun modérateur n'est défini
                                    <div className='w-full flex flex-col justify-center items-center space-y-2 animate-fade-in h-56 pl-2'>
                                      {/* <VerifyPermission
                                        expected={[Roles.SUPPORT]}
                                        received={userData?.userRole?.name}
                                      >
                                        <button className="text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 animate-fade-in" onClick={()=>setParticipantFormIsOpen(true)}>
                                          Créer un modérateur
                                        </button>
                                      </VerifyPermission> */}
                                      {/* <div className="text-xs">Pas de modérateur</div> */}
                                      <div className='flex justify-center items-center flex-col animate-fade-in'>
                                        <div>
                                          <UsersIcon className='h-12 text-gray-400' />
                                        </div>
                                        <p className='text-sm text-center text-gray-400'>Pas de modérateur</p>
                                      </div>
                                    </div>

                                  )

                              }
                            </div>
                          ) : infoPath === "participant" ? (
                            <div className="flex flex-col space-y-2 h-56 overflow-hidden overflow-y-auto">
                              {
                                showParticipant.length > 0 ? ( // Affichage de la liste des participants si elle n'est pas vide

                                  showParticipant.map((item) => (
                                    <div key={item?.id}
                                      className="w-full bg-gray-100 rounded-md flex items-center gap-2 p-4 my-2  animate-fade-in">
                                      <div className="w-10 h-10 rounded-full">
                                        <img
                                          className="w-full h-full object-cover rounded-full"
                                          src={item?.photo !== null ? item?.photo : ""}
                                          alt=""
                                          onError={(e) => { e.target.src = avatarIcon; }}
                                        />
                                      </div>
                                      <div>
                                        <div className="text-xs">{item.name}</div>
                                        <div className="text-xs">{item.participantRole.name}</div>
                                      </div>
                                    </div>
                                  ))
                                ) : ( // Affichage du message "Pas de participants" si la liste est vide
                                  <div className='flex justify-center items-center flex-col animate-fade-in h-56'>
                                    <div>
                                      <UsersIcon className='h-12 text-gray-400' />
                                    </div>
                                    <p className='text-sm text-center text-gray-400'>Pas de participant</p>
                                  </div>
                                )
                              }
                            </div>
                          ) : infoPath === "pending" &&
                          (
                            pendingList.length > 0 ?
                              <div className='flex flex-col space-y-2 h-56 overflow-hidden overflow-y-auto'>
                                {
                                  pendingList.map(participant =>
                                    <div className='w-full bg-gray-100 rounded-md flex justify-between items-center gap-2 p-4  animate-fade-in'>
                                      <div className="w-10 h-10 rounded-full flex items-center space-x-2">
                                        <img
                                          className="w-full h-full object-cover rounded-full flex items-center space-x-2"
                                          src={participant?.photo !== null ? participant?.photo : ""}
                                          alt=""
                                          onError={(e) => { e.target.src = avatarIcon; }}
                                        />
                                        <div className='flex flex-col'>
                                          <div className="text-xs">{participant?.name}</div>
                                          <div className="text-xs">{participant?.participantRole?.name}</div>
                                        </div>
                                      </div>
                                      <div className='space-x-2'>
                                        <button
                                          className={`text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl text-white font-semibold rounded-lg shadow-md hover:bg-orange-500 bg-orange-600`}
                                          onClick={() => {
                                            setParticipantViewDetail(true)
                                          }}
                                        >
                                          Détail
                                        </button>
                                        <button
                                          className={`text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl text-white font-semibold rounded-lg shadow-md hover:bg-green-500 ${isApprovingParticipant ? "bg-green-500" : "bg-green-700"}`}
                                          onClick={() => {
                                            let isConfirmed = confirm("Voulez-vous approuver ?");
                                            if (isConfirmed) {
                                              approvedParticipant(participant?.id);
                                            }
                                          }}
                                        >
                                          {isApprovingParticipant ? "Approbation en cours..." : "Approuver"}
                                        </button>
                                      </div>
                                      <Modal
                                        open={participantViewDetail}
                                        title="Détail du paticipant"
                                        onCancel={() => setParticipantViewDetail(false)}
                                        footer={() => { }}
                                      >
                                        <ParticipantDetail
                                          onClose={() => {
                                            setParticipantViewDetail(false);
                                          }}
                                          dataParticipant={participant}
                                          approve={approvedParticipant}
                                        />
                                      </Modal>
                                    </div>
                                  )
                                }
                              </div> :
                              <div className='flex justify-center items-center flex-col animate-fade-in h-56'>
                                <div>
                                  <UsersIcon className='h-12 text-gray-400' />
                                </div>
                                <p className='text-sm text-center text-gray-400'>Aucun participant en attente de validation</p>
                              </div>
                          )
                        }
                      </div>
                    </div>
                  )
                )
              }
            </>
          )
      }

      {scannCode ?
        <div
          className="absolute inset-0"
        // onClick={() => setScannCode(false)}
        >
          <div>
            <QRScannerWorksop onClose={setScannCode} workshopId={id} />
          </div>
        </div>
        :
        ""
      }

      <Modal
        open={participantFormIsOpen}
        title="Devenir paticipant"
        onCancel={() => setParticipantFormIsOpen(false)}
        footer={() => { }}
      >
        <ParticipantForm
          onSubmit={() => {
            setParticipantFormIsOpen(false);
            seeWorkshopById();
            toast.success("Demande de participation envoyé.", { duration: 5000 });
          }}
          workshopData={showWorkshop}
        />
      </Modal>

    </div>
  )
}

export default Workshop
