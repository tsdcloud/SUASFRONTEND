import React, {useState, useEffect, useContext} from 'react'
import { useParams, useNavigate, Link, useRouteError } from 'react-router-dom'
import { useFetch } from "../hooks/useFetch";
import { Button, Modal } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import Preloader from "../Components/Preloader.jsx"
import { AUTHCONTEXT } from '../context/AuthProvider.jsx';
import { CalendarDaysIcon, ExclamationCircleIcon, CheckCircleIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/16/solid";
import VerifyPermission from '../Utils/VerifyPermission.jsx';
import Roles from '../Utils/Roles.js';
import WorkhshopStatus from '../Utils/WorkshopStatus.js';
import ParticipantForm from '../Components/participantForm.jsx';
import { UsersIcon } from '@heroicons/react/24/outline';

import avatarIcon from '../assets/avatar-icon.png'


function Workshop() {
  document.title = "Voir les détails"
  const navigateToMyEvents = useNavigate()
  const { handleFetch, err, setErr, handlePatch, handlePost } = useFetch();
  const { id } = useParams();

  const { userData } = useContext(AUTHCONTEXT);
  const [open, setOpen] = useState(false);
  const [openModerator, setOpenModerator] = useState(false);

  const [idWorkshop, setIdWorkshop] = useState("")
  const [showWorkshop, setShowWorkshop] = useState({});
  const [participantInfo, setParticipantInfo] = useState({});
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

  const [filteredRoleByModerator, setFilteredRoleByModerator] = useState([])

  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedUserRoleName, setSelectedUserRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [dataForm, setDataForm] = useState();
  const [getIdParticipant, setGetIdParticipant] = useState();
  const [participantModerator, setParticipantModerator] = useState({});

  const [infoPath, setInfoPath] = useState("moderator")
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false)

  const [participantFormIsOpen, setParticipantFormIsOpen] = useState(false)

  const navigateToMyWorkshop = useNavigate();

  console.log(userData, 'this is user data')

  const handleBecomeParticipant = async () => {
    setIsLoadingButton(true);
   const urlParticipant = `${import.meta.env.VITE_EVENTS_API}/participants/create`
   const [idRoleOnly] = filteredRole
   const data = {
     workshopId : idWorkshop,
     ownerId: userData?.id,
     name: userData?.name,
     description: userData?.description || "Participant",
     // participantRoleId: filteredRole[0]?.id,
     participantRoleId: idRoleOnly?.id,
     photo : userData?.photo,
     isOnlineParticipation : true
   }
   // console.log("dt", data)
   try {
     const response = await handlePost(urlParticipant, data);
     const err = response.error
 
     if (!err) {
       setDataForm(response)
       // console.log("resp resuls22", response)
       if (response && response?.id) {
         setGetIdParticipant(response?.id);
         // console.log("idParticipant", response.id);
         await approvedParticipant(response?.id);
         
       } else {
         console.error("ID du participant manquant dans la réponse");
       }
       
       // navigateToMyEvents(`/events/workshop/${}`)
       seeWorkshopById();
     } else {
       toast.error(err, { duration: 5000});
       return;
     }
   } catch (err) {
     toast.error(err, { duration: 5000});
    }
    finally {
     setIsLoadingButton(false);
   }
 
  }

  // console.log("this is the info participants", participantModerator);

  const seeWorkshopById = async (id) =>{
    // const url = `${import.meta.env.VITE_EVENTS_API}/workshops/${id}`
    let url = ""
    if(!idWorkshop){
      url = `${import.meta.env.VITE_EVENTS_API}/workshops/${id}`
    }else{
      url = `${import.meta.env.VITE_EVENTS_API}/workshops/${idWorkshop}`
    }

    try{
      setIsLoading(true);
      const response = await handleFetch(url)
      console.log("Workshop", response);
      setShowWorkshop(response);

      let participantList = response?.participants;
      // console.log("this is the info participants", participantList);
      handleGetCurrentParticipantInfo(participantList);

      // let participant = response?.participants?.filter(item =>item?.isApproved === true);
      let participant = response?.participants.filter(item =>item?.participantRole?.name !== "Moderator" && item?.isApproved == true);
      // console.log("voici les prticipants ",participant);
      setShowParticipant(participant);

      // let participantIsAprouved = response?.participants.filter(item =>item?.ownerId === userData?.id && item?.isApproved == false)
      // console.log("user not approuved", participantIsAprouved);
      // console.log("user data", userData);

      // console.log("show part", showParticipants)
      let moderator = response?.participants.filter(item =>item?.participantRole?.name == "Moderator" && item?.isApproved == true);
      
      setParticipantModerator(moderator);

      // console.log("part Moder", participantModerator)
      let pendingParticipants = response?.participants?.filter(participant => participant?.isApproved === false);
      setPendingList(pendingParticipants);
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
      try{
        setIsLoading(true);
        const response = await handleFetch(urlUsers)
        if (response) {
          const filteredUsers = response.map((user) => ({
            id: user.id,
            name: user.name,
            photo:user.photo
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
      try{
        setIsLoading(true);
        const response = await handleFetch(urlRoles)
        if (response) {
          const Role = response.map((role) => ({
            id: role.id,
            name: role.name
          }));
          console.log("Rôles",Role)
          setShowAllRole(Role);
          // console.log("r", showAllRole)
          // const filteredRoles = showAllRole?.filter(role => role.name !== "Moderator");
          // console.log("fi",filteredRole)
          setFilteredRole(Role?.filter(role => role?.name !== "Moderator"));
          setFilteredRoleByModerator(Role?.filter(role => role?.name === "Moderator"));
          // setFilteredRole(filteredRoles)

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
  const handleGetCurrentParticipantInfo = async (participantsList) =>{
    let isParticipant = participantsList.find(participant => participant.ownerId === userData?.id);
    if(isParticipant){ 
      setParticipantInfo(isParticipant);
      return isParticipant
    }

    return;
  }

  useEffect(()=>{
      seeWorkshopById(id);
      handleShowAllUser();
      handleShowAllRole();
      setIdWorkshop(id);
      return () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      // console.log("p", showParticipants)
  },[id]);


    const handleApproveWorkshop = async (itemId) =>{
      const url = `${import.meta.env.VITE_EVENTS_API}/workshops/approved/${itemId}`
      const confirmation = window.confirm("Êtes-vous sûr de vouloir approuver cet atélier ?");

        if (confirmation) {
          setIsLoadingButton(true)
              try {
                  await handlePatch(url)
                  seeWorkshopById();
              }
              catch(error){
                  console.error("Erreur lors de la modification de l'atélier:", error);
              }
              finally{
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
      await handlePatch(urlParticipant);
      seeWorkshopById();
      // navigateToMyWorkshop(`/mysettings/my-events`)
  }
  catch(error){
      console.error("Erreur lors de l'approbation du participant':", error);
  }finally{
    setIsApprovingParticipant(false);
  }
   console.log("Le participant a été approuvé.");

  }

 const [isCreatingModerator, setIsCreatingModerator] = useState(false);

  const createParticipant = async () =>{
    setIsCreatingModerator(true);
    const urlParticipant = `${import.meta.env.VITE_EVENTS_API}/participants/create`
    const data = {
      workshopId : id,
      ownerId: selectedUser,
      name: selectedUserName,
      description: description,
      participantRoleId: selectedRole,
      photo : selectedPhoto,
      isOnlineParticipation : false
    }
    // console.log("dt", data)
    try {
      const response = await handlePost(urlParticipant, data);
      const err = response.error
 
      if (!err) {
        setDataForm(response)
        console.log("resp resuls22", response)
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
        toast.error(err, { duration: 5000});
        return;
      }
    } catch (err) {
      toast.error(err, { duration: 5000});
     }finally{
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

        <br/>

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
          <input type='text'  value={selectedUserName}
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
  
        <div>
          Rôle attribué : {/* Affichage du rôle sélectionné */}
          <input type='text' defaultValue={selectedUserRoleName} 
          className=' text-gray-500 disabled cursor-not-allowed w-full border border-1 rounded h-[30px]' disabled readOnly/>
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
          className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full h-[40px] sm:text-sm"
        >
          <option value="">Sélectionnez un utilisateur</option>
          {showAllUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <br/>

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
          <input type='text'  value={selectedUserName}
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
  
        <div>
          Rôle attribué : {/* Affichage du rôle sélectionné */}
          <input type='text' defaultValue={selectedUserRoleName} 
          className=' text-gray-500 disabled cursor-not-allowed w-full border border-1 rounded h-[30px]' disabled readOnly/>
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


// const handlePasteLink = () =>{
//   navigator.clipboard.writeText(document.getElementById('copy-input').value)
//   .then(() => {
//     alert('Lien copié dans le presse-papiers !');
//   })
//   .catch(err => {
//     console.error('Copie du lien échouée:', err);
//     alert('Une erreur est survenue. Veuillez réessayer plus tard.');
//   });
// }

  return (
    <div className=' w-full sm:w-[700px] md:w-[770px] lg:[890px] justify-center items-center flex flex-col'>
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
                                        {/* <Modal
                                          title="Créer un paticipant"
                                          open={open}
                                          // onOk={handleOk}
                                          onCancel={handleCancel} 
                                          footer={()=>{}}
                                        >
                                                <div>
                                                  {content[currentStep]}
                                                  <div className="flex justify-end items-center space-x-2">
                                                    {currentStep !== 1 && (
                                                      <Button className="my-4" onClick={() => setCurrentStep(currentStep - 1)}>Précédent</Button>
                                                    )}
                                                    {currentStep === 2 ? (
                                                      <Button type="primary" className="my-4" onClick={createParticipant}>Créer un participant</Button>
                                                    ) : (
                                                      currentStep !== 2 && (
                                                        <Button type="primary" className="my-4" onClick={() => setCurrentStep(currentStep + 1)}>
                                                          Suivant
                                                        </Button>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                                <Toaster />
                                                      </Modal>*/}

                                        <Modal
                                          title="Créer un modérateur"
                                          open={openModerator}
                                          // onOk={handleOk}
                                          onCancel={handleCancelModerator} 
                                          footer={()=>{}}
                                        >
                                            <div>
                                              {contentModerator[currentStep]}
                                              <div className="flex justify-end items-center space-x-2">
                                                {currentStep !== 1 && (
                                                  <Button className="my-4" onClick={() => setCurrentStep(currentStep - 1)}>Précédent</Button>
                                                )}
                                                {currentStep === 2 ? (
                                                  <button type="primary" className={`p-2 text-white rounded-lg shadow-sm ${isCreatingModerator ? "bg-blue-300" : "bg-blue-500"}`} onClick={createParticipant}>{isCreatingModerator ? "Création en cours..." : "Enregistrer"}</button>
                                                ) : (
                                                  currentStep !== 2 && (
                                                    <Button type="primary" className="my-4" onClick={() => setCurrentStep(currentStep + 1)}>
                                                      Suivant
                                                    </Button>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                        <Toaster />
                                        </Modal>
                             

                                        {/* show workshop details */}
                                          <div className=' justify-center'>
                                            {
                                                showWorkshop && (

                                                    <div key={showWorkshop.id} className='rounded-lg'>

                                              {/* <img src={showWorkshop.photo} alt=''
                                              className='rounded-lg object-cover w-[1250px] h-[350px]'/> */}

                                                      <div 
                                                        className=' aspect-video h-[300px] w-full  flex justify-center items-center relative border-[1px] rounded-lg'>
                                                            <div className="h-full w-full" 
                                                            style={{background: `url(${showWorkshop.photo})`, backgroundSize:"cover", filter: `blur(1.5rem)`}}>
                                                            </div>
                                                            <img src={showWorkshop.photo} alt='' 
                                                              className='rounded-lg object-contain w-full h-full absolute'/>
                                                      </div>

                                                        <div className='w-full sm:py-3 flex flex-col sm:flex-row items-center justify-between'>
                                                                <div className='flex flex-row text-[10px] space-y-2 sm:text-md items-center font-mono text-orange-400'>
                                                                <CalendarDaysIcon className="h-4 w-4 sm:h-5 sm:w-5" />Date de début : {showWorkshop?.startDate?.split("T")[0]} - Date de fin : {showWorkshop?.endDate?.split("T")[0]}
                                                                </div>
                                                            {
                                                              showWorkshop.isApproved === false ? (
                                                                  <div className='flex flex-col items-center sm:flex-row space-x-2  space-y-3 sm:space-y-0 text-xs'>
                                                                      <div className="flex items-center space-x-2 text-xs sm:text-md">
                                                                        <CheckCircleIcon className="h-5 w-5 text-red-500 sm:mr-2" />
                                                                        <span>Non Approuvé</span>
                                                                      </div>
                                                                      <div onClick={() =>{handleApproveWorkshop(showWorkshop?.id)}} 
                                                                               className={`${isLoadingButton ? "bg-green-700  cursor-not-allowed":" hover:bg-green-700"} bg-green-700 text-white px-3 py-2 cursor-pointer rounded shadow-sm text-xs`} 
                                                                               disabled={isLoadingButton} >   
                                                                           
                                                                           {isLoadingButton ? "Approbation en cours..." : "Approuver cet atélier"}
                                                                      </div>

                                                      </div>
                                                  ):
                                                  (

                                                                  <div className="flex items-center text-xs sm:text-md">
                                                                  <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 sm:mr-2" />
                                                                  <span>Approuvé</span>
                                                                </div>
                                                              )
                                                            }

                                                        </div>
                                                        <div className='my-4 sm:my-0'>

                                                            <div className='font-extrabold text-md sm:text-lg'>{showWorkshop?.name}</div>
                                                            <div className='font-normal text-xs sm:text-md justify-center items-center'>{showWorkshop?.description}</div>
                                                            <div className='font-medium text-sm sm:text-md '>Propriétaire : {showWorkshop?.owner?.name}</div>
                                                            <div className='font-normal text-sm sm:text-md '>Prix : {showWorkshop?.price} Xaf</div>
                                                            <div className='text-green-700 flex flex-row text-sm sm:text-md'>Salle : {showWorkshop?.room}</div>
                                                            <div className="text-gray-700 text-sm sm:text-md">Type : {showWorkshop?.isPublic === true ? "Public" : "Privé"}</div>
                                                            <div className=" text-gray-700 text-sm sm:text-md ">État : {showWorkshop?.isOnlineWorkshop === false ? "En présentiel" : "En ligne"}</div>
                                                            
                                                                    {
                                                                          showWorkshop?.isApproved === false ? (
                                                                            null
                                                                            ):(
                                                                              
                                                                              <>
                                                                                <VerifyPermission
                                                                                  expected={[Roles.SUPPORT, Roles.MODERATOR]}
                                                                                  received={ 
                                                                                    userData?.userRole?.name === Roles.SUPPORT ? Roles.SUPPORT : 
                                                                                      showWorkshop
                                                                                      ?.participants?.find(participant => participant?.ownerId === userData?.id )
                                                                                      ?.participantRole?.name === Roles.MODERATOR ? Roles.MODERATOR : "failed"
                                                                                    // (
                                                                                    //   userData?.userRole?.name === Roles.SUPPORT || 
                                                                                    //   showWorkshop
                                                                                    //   ?.participants?.find(participant => participant?.ownerId === userData?.id )
                                                                                    //   ?.participantRole?.name === Roles.MODERATOR) ? Roles.SUPPORT : "failed"
                                                                                  }
                                                                                >
                                                                                  <div className='my-5'>
                                                                                      <a target="_blank" href={`/room/${idWorkshop}`} className=' my-5 px-4 py-2  text-xs bg-blue-500 text-white rounded '>
                                                                                        Démarrer l'atélier
                                                                                      </a>
  
                                                                                  </div>
                                                                                </VerifyPermission>
                                                                                <VerifyPermission
                                                                                expected={[Roles.PARTICIPANT, Roles.EXPERT]}
                                                                                received={
                                                                                  showWorkshop?.participants?.find(participant => participant?.ownerId === userData?.id )?.participantRole?.name
                                                                                }
                                                                              >
                                                                                {
                                                                                  // <div className='my-5'>
                                                                                  //   <a target="_blank" href={/room/${idWorkshop}} className=' my-5 px-4 py-2  text-xs bg-blue-500 text-white rounded '>
                                                                                  //     Rejoindre l'atélier
                                                                                  //   </a>
                                                                                  // </div>
                                                                                  showWorkshop?.status === WorkhshopStatus.STARTED 
                                                                                  && showWorkshop?.participants.filter(item =>item?.ownerId === userData?.id 
                                                                                    && item?.isApproved == false).length === 0 &&
                                                                              <div className='my-5'>
                                                                                    <a target="_blank" href={`/room/${idWorkshop}`} className=' my-5 px-4 py-2  text-xs bg-blue-500 text-white rounded '>
                                                                                      Rejoindre l'atélier
                                                                                    </a>
                                                                                  </div>
                                                                                }
                                                                              </VerifyPermission>
                                                                              </>
                                                                            )
                                                                          }
                                                                        
                                                        </div>
                                                      
                                                    </div>
                                                )
                                                      }
                                          </div>       
                              </div>


                                {
                                  showWorkshop && (

                                    showWorkshop.isApproved === false ? (
                                      <div className='flex justify-center items-center space-x-2'>
                                        <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
                                        <div className='text-xs sm:text-md'>Vous devez d'abord approuver cet atélier</div>
                                      </div>
                                    ):(
                                      <div className=' w-full lg:my-10'>
                                          <div className='flex flex-col-reverse sm:flex-row justify-between items-center space-x-2 px-2 mt-3'>
                                               
                                                <div className='my-4 sm:my-0'>
                                                  <ul className='flex space-x-3'>
                                                    <li onClick={()=>setInfoPath("moderator")} className={`p-2 text-gray-500 cursor-pointer ${infoPath === "moderator" && 'border-b-blue-500 border-b-2'} text-xs`}>Modérateur(s)</li>
                                                    <li onClick={()=>setInfoPath("participant")} className={`p-2 text-gray-500 cursor-pointer  ${infoPath === "participant" && 'border-b-blue-500 border-b-2'} text-xs`}>Participant(s)</li>
                                                    <VerifyPermission
                                                        expected={[Roles.SUPPORT]}
                                                        received={userData?.userRole?.name}
                                                      >
                                                      <li onClick={()=>setInfoPath("pending")} className={`p-2 text-gray-500 cursor-pointer  ${infoPath === "pending" && 'border-b-blue-500 border-b-2'} text-xs`}>En attente d'approbation(s)</li>
                                                    </VerifyPermission>
                                                  </ul>
                                                </div>

                                                <div className='space-y-3 sm:space-y-0 sm:space-x-1 sm:flex sm:flex-row sm:items-center'>

                                                  <div className='space-y-3 sm:my-6 flex-row sm:flex-normal'>

                                                            <VerifyPermission
                                                              expected={[Roles.SUPPORT]}
                                                              received={userData?.userRole?.name}
                                                            >
                                                                <div className='px-4 sm:px-3'> 
                                                                  <Button type="primary" onClick={()=>setParticipantFormIsOpen(true)}> Créer un participant </Button>
                                                                </div>
                                                            </VerifyPermission>

                                                            {showWorkshop?.participants?.filter(participant=>participant.ownerId == userData?.id ).length !== 0 &&
                                                            <div className='px-4 sm:px-3'> 
                                                              {
                                                                participantInfo?.isApproved === false &&
                                                                <span type="primary" className={`text-xs rounded-md bg-green-200 text-green-700 px-3 py-3`}>
                                                                  En cours d'approbation...
                                                                </span>
                                                              }
                                                            </div>}

                                                  </div>
                                                  <div className='sm:mt-5'>
                                                        {
                                                            showWorkshop?.participants?.filter(participant=>participant.ownerId == userData?.id).length < 1 &&
                                                            userData?.userRole?.name !== Roles.SUPPORT                                                 
                                                            &&
                                                            <button onClick={()=>setParticipantFormIsOpen(true)} 
                                                              className = {
                                                                          isLoadingButton ?
                                                                            "cursor-not-allowed text-xs sm:text-[10px] px-4 sm:px-2 sm:py-2 py-3 bg-green-800 rounded text-white shadow-sm" :
                                                                            "cursor-pointer text-xs sm:text-[10px] px-4 sm:px-2 sm:py-2 py-3 bg-green-800 rounded text-white hover:bg-green-700 shadow-sm"
                                                                        }
                                                                    disabled={isLoadingButton}>
                                                                      {isLoadingButton ? "Inscription en cours..." : "S'inscrire comme participant"}
                                                            </button>
                                                          }
                                                  </div>
                                                </div>
                                                
                                                       
                                                    
                                          </div>

                                          <div className='sm:mx-8 mt-5'>
                                              {
                                                  infoPath === "moderator" ? (
                                                    // <div className="space-x-3 items-center bg-gray-100 h-[50px] rounded-md sm:rounded-lg my-1 p-2">
                                                      <div className="flex flex-col h-[180px] sm:h-[250px] overflow-auto">
                                                      {
                                                        participantModerator.length > 0 ? (

                                                          // <div className="flex space-x-2 w-10 h-10 rounded-full ">
                                                          //       <img
                                                          //         className="w-full h-full object-cover rounded-full"
                                                          //         src={participantModerator?.photo}
                                                          //         alt={participantModerator?.name}
                                                          //       />
                                                          //       <div className=''>
                                                          //           <div className='text-xs'>{participantModerator.name}</div>
                                                          //           <div className='text-xs'>{participantModerator.participantRole?.name}</div>
                                                          //       </div>
                                                          // </div>
                                                          participantModerator.map((item) => (
                                                            <div key={item?.id} 
                                                            className="flex space-x-2 items-center bg-gray-100 rounded-lg my-1 p-2">
                                                              <div className="w-10 h-10 rounded-full">
                                                                <img
                                                                  className="w-full h-full object-cover rounded-full"
                                                                  src={item?.photo || avatarIcon}
                                                                  alt={item?.name}
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
                                                          <div className='flex flex-row py-2 space-x-1 sm:m-2 bg-gray-100'>
                                                             <VerifyPermission
                                                                expected={[Roles.SUPPORT]}
                                                                received={userData?.userRole?.name}
                                                              >
                                                                <button className="px-2 text-xs text-blue-500 font-bold" onClick={showModalModerator}>
                                                                  Créer un modérateur
                                                                </button>
                                                             </VerifyPermission>
                                                            <div className="text-xs">Pas de modérateur</div>
                                                          </div>
                                                          
                                                        )
                                                        
                                                      }
                                                    </div>
                                                  ) : infoPath === "participant" ? (
                                                    <div className="flex flex-col h-[180px] sm:h-[250px] overflow-auto">
                                                      {
                                                        showParticipant.length > 0 ? ( // Affichage de la liste des participants si elle n'est pas vide
                                                        
                                                          showParticipant.map((item) => (
                                                              <div key={item?.id} 
                                                              className="flex space-x-2 items-center bg-gray-100 rounded-lg my-1 p-2">
                                                                <div className="w-10 h-10 rounded-full">
                                                                  <img
                                                                    className="w-full h-full object-cover rounded-full"
                                                                    src={item?.photo || avatarIcon}
                                                                    alt={item?.name}
                                                                  />
                                                                </div>
                                                                <div>
                                                                  <div className="text-xs">{item.name}</div>
                                                                  <div className="text-xs">{item.participantRole.name}</div>
                                                                </div>
                                                              </div>
                                                          ))
                                                        ) : ( // Affichage du message "Pas de participants" si la liste est vide
                                                          <div className="text-xs text-center flex space-x-2 items-center bg-gray-100 rounded-md sm:rounded-lg my-1 p-2">
                                                            Pas de participants
                                                          </div>
                                                        )
                                                      }
                                                    </div>
                                                  ) : infoPath === "pending" &&
                                                  (
                                                    pendingList.length > 0 ?
                                                    <div className='flex flex-col space-y-2'>
                                                      {
                                                        pendingList.map(participant => 
                                                          <div className='w-full bg-gray-200 rounded-md flex justify-between items-center gap-2 p-4'>
                                                            <div className="w-10 h-10 rounded-full flex items-center space-x-2">
                                                              <img
                                                                className="w-full h-full object-cover rounded-full flex items-center space-x-2"
                                                                src={participant?.photo || avatarIcon}
                                                                alt={participant?.name}
                                                              />
                                                              <div className='flex flex-col'>
                                                                <div className="text-xs">{participant?.name}</div>
                                                                <div className="text-xs">{participant?.participantRole?.name}</div>
                                                              </div>
                                                            </div>
                                                            <div>
                                                              <button 
                                                                className={`p-2 rounded-lg shadow-md text-xs hover:bg-orange-500 text-white ${isApprovingParticipant ? "bg-green-400":"bg-primary"}`}
                                                                onClick={()=>{
                                                                  let isConfirmed = confirm("Voulez-vous approuver ?");
                                                                  if(isConfirmed){
                                                                    approvedParticipant(participant?.id);
                                                                  }
                                                                }}
                                                              >
                                                                {isApprovingParticipant ? "Approbation en cours..." : "Approuver"}
                                                              </button>
                                                            </div>
                                                          </div>
                                                        )
                                                      }
                                                    </div>:
                                                    <div className='flex justify-center items-center flex-col'>
                                                      <div>
                                                        <UsersIcon className='h-12 text-gray-400'/>
                                                      </div>
                                                      <p className='text-sm text-gray-400'>Aucun participant en attente de validation</p>
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

      <Modal
        open={participantFormIsOpen}
        title="Devenir paticipant"
        onCancel={()=>setParticipantFormIsOpen(false)} 
        footer={()=>{}}
      >
        <ParticipantForm 
          onSubmit={()=>{
            setParticipantFormIsOpen(false);
            seeWorkshopById();
            toast.success("Demande de participation envoyé.",{ duration: 5000});
          }}
        />
      </Modal>
  
    </div>
  )
}

export default Workshop