import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from "../hooks/useFetch";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';
import { AUTHCONTEXT } from "../context/AuthProvider";
import { Pagination, Modal } from 'antd';
import Preloader from "../Components/Preloader.jsx"
import { CalendarDaysIcon, MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon, QrCodeIcon, CheckBadgeIcon, XCircleIcon, UserPlusIcon, EyeIcon } from "@heroicons/react/16/solid";
import Roles from '../Utils/Roles.js';
import VerifyPermission from '../Utils/VerifyPermission.jsx';
import toast, { Toaster } from 'react-hot-toast';

import QRScannerEvent from '../Components/QRCode/QRScannerEvent.jsx';

import atelierEv from '../assets/Atelier.webp'
import evImg from '../assets/Eventsdefault2.jpg'
import CreateWorkshop from './CreateWorkshop.jsx';
import QRCodeGenerator from '../Components/QRCode/QRCodeGenerator.jsx';


function Event() {
  const { userData } = useContext(AUTHCONTEXT)

  const [idUser, setIdUser] = useState(userData?.id);

  const [scannCode, setScannCode] = useState(false);

  const [roleId, setRoleId] = useState("")

  const [signedIn, setSignedIn] = useState(false)

  const [idEvent, setIdEvent] = useState()
  const { id: idParam } = useParams(); //Allows to get id event from url parameter
  const [event, setEvent] = useState()

  const [isApproveEvent, setIsApproveEvent] = useState()
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [isWorkshopIfApproved, setIsWorkshopIfApproved] = useState([])
  const [isWorkshopIfNotApproved, setIsWorkshopIfNotApproved] = useState([])

  const [isLoading, setIsLoading] = useState(false);

  const [modalCreateCatState, setModalCreateCaState] = useState(false);

  const { handleFetch, err, setErr, handlePatch, handlePost } = useFetch()
  // const {id} = useParams()

  const navigateToCreateWorkshop = useNavigate()
  const navigateToGoWorkshop = useNavigate()
  const navigate = useNavigate()

  const showEventById = async () => {
    const url = `${import.meta.env.VITE_EVENTS_API}/events/${idParam}`
    try {
      setIsLoading(true);
      const response = await handleFetch(url)

      if (response.success) {
        const event = response.result

        setEvent(event)
        setIdEvent(event.id);
        const checkIsApproved = event.isApproved === true
        setIsApproveEvent(checkIsApproved)

        const workshops = event.workshops || [];
        setFilteredWorkshops(workshops);

        const isApprovedWorkshop = workshops.filter(workshop => workshop.isApproved === true)
        setIsWorkshopIfApproved(isApprovedWorkshop)

        const isNotApprovedWorkshop = workshops.filter(workshop => workshop.isApproved === false)
        setIsWorkshopIfNotApproved(isNotApprovedWorkshop)

        event?.eventParticipants.some(e => e.ownerId === userData?.id)

        setSignedIn(true)
      }
    }
    catch (error) {
      console.error("Erreur lors de la récupération de l'évènement:", error);
    }
    finally {
      setIsLoading(false);
    }
  };



  const handleApproveEvent = async (eventId) => {
    const url = `${import.meta.env.VITE_EVENTS_API}/events/approved/${eventId}`
    const confirmation = window.confirm("Êtes-vous sûr de vouloir approuver cet événement ?");

    if (confirmation) {
      try {
        setIsLoading(true)
        await handlePatch(url)
        // navigateToMyEvent(`/events/${eventId}`)
        showEventById();
      }
      catch (error) {
        console.error("Erreur lors de la modification de l'évènement:", error);
      }
      finally {
        setIsLoading(false)
      }
      console.log("L'événement a été approuvé.");
    } else {
      console.log("L'approbation a été annulée.");
    }


  }

  const handleSignInToEvent = async () => {
    const confirmation = window.confirm("Voulez vous vous inscrire a cet evènement ?");

    if (confirmation) {
      const url = `${import.meta.env.VITE_EVENTS_API}/eventparticipants/create`

      console.log("clicked now for inscription");


      let data = {
        ownerId: userData?.id,
        eventParticipantRoleId: roleId,
        eventId: idParam
      };

      try {
        setIsLoading(true)
        const res = await handlePost(url, data);

        if (res.success) {
          toast.success("Inscription éffectuer avec succès", { duration: 1500 })
          setTimeout(() => {
            showEventById();
          }, 500);
        }
      }
      catch (error) {
        console.error("Erreur lors de l'inscriptiont:", error);
      }
      finally {
        setIsLoading(false)
      }
    } else {
      console.log("Une erreur est survenue.");
    }


  }

  const fetchEventRoles = async () => {
    const url = `${import.meta.env.VITE_EVENTS_API}/eventparticipantroles/`;
    try {
      setIsLoading(true);
      const response = await handleFetch(url);

      if (response.success) {
        const selectedRole = response.result.data.find(e => e.name === "participant")
        setRoleId(selectedRole.id)
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickToGoWorkshop = async (e, workshopId) => {
    e.preventDefault()
    navigateToGoWorkshop(`/workshops/${workshopId}`)
  }

  const handleCreateWorkshop = async (e) => {
    e.preventDefault();
    navigateToCreateWorkshop(`/workshops/create/${idEvent}`)
  }

  useEffect(() => {
    showEventById();
    fetchEventRoles();
  }, [idParam])

  useEffect(() => {
    let signed = event?.eventParticipants.some(e => e.ownerId === userData?.id)
    setSignedIn(signed)

    // console.log("signed", signed, "userID", idUser, "userData?.id", userData?.id);

  }, [event, idUser])


  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])


  return (
    <div className='relative animate-fade-in flex flex-col justify-between w-full sm:w-[720px] md:w-[780px] lg:w-[820px] space-y-[30px] sm:space-y-[40px]'>
      {

        isLoading ? (
          <div className='flex flex-col justify-center items-center'>
            <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
            <p className='text-xs'>Chargement…</p>
          </div>
        ) : (
          <div className='p-4'>
            <div className='flex justify-between items-center  pb-2'>

              <div className='flex items-center hover:cursor-pointer'>
                <div className='hover:cursor-pointer md:hidden mr-2' onClick={() => navigate(-1)}>
                  <ArrowLeftIcon className="h-6 w-6 text-green-500" />
                </div>
                <h1 className="font-semibold text-gray-900">Evènement {event?.name}</h1>
              </div>

              {/* <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                {!scannCode ?
                  <button className="flex py-2 px-2  bg-orange-400 text-white 
                        rounded-md shadow-md hover:bg-orange-300  
                        self-end text-sm text-center"
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

              <VerifyPermission
                expected={[Roles.STAFF]}
                received={
                  // userData?.eventParticipantsOwner?.find((e) => e?.eventId === event?.id)?.eventParticipantRole?.name
                  event?.eventParticipants?.find(participant => participant?.ownerId === userData?.id)?.eventParticipantRole?.name
                }
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

            <div className='flex space-x-3 text-sm pt-1 pb-4'>
              {

                event && (
                  <div key={event?.id} className='w-full sm:w-full rounded sm:rounded-lg'>
                    {/* Event header image */}
                    <div
                      className='aspect-video h-[300px] w-full  flex justify-center items-center relative border-[1px] rounded-lg'>
                      <div className="h-full w-full" style={{ background: `url(${event?.photo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                        <img
                          src={event.photo}
                          onError={(e) => {
                            e.currentTarget.parentNode.style.backgroundImage = `url(${evImg})`;
                          }}
                          className="hidden"
                          alt=""
                        />
                      </div>
                      <img src={event?.photo} alt='event photo'
                        className='rounded-lg object-contain w-full h-full justify-center absolute' onError={(e) => { e.target.src = evImg; }} />
                    </div>

                    {/* Event details information */}
                    <div className='m-2 lg:my-2 md:m-2 flex flex-col sm:flex-row sm:items-center justify-between lg:m-0 lg:w-full'>
                      <div className='text-xs flex flex-row items-center font-mono text-orange-500 font-bold space-x-1 '>
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        {/* <span>
                          {event?.startDate && event?.startDate.split("T")[0]} - {event?.startDate && event?.endDate.split("T")[0]}
                        </span> */}
                        <div>
                          <span>début: </span>
                          <span>
                            {new Intl.DateTimeFormat('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(new Date(event.startDate))}
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
                            }).format(new Date(event.endDate))}
                          </span>
                        </div>
                      </div>
                      <hr />

                      <div className='flex justify-between space-x-1 mt-1 items-center'>
                        <div className="text-xs p-2 text-center text-green-400 rounded sm:mt-0 bg-green-100">
                          Catégorie : {event?.category?.name}
                        </div>

                        {/* {
                          //display approve tag
                          (event?.isApproved && userData?.userRole?.name === Roles.SUPPORT) ?
                            (

                              <div className='flex sm:justify-normal mt-2 sm:mt-0 space-x-3'>

                                <div className="flex justify-center text-xs sm:text-md items-center text-center space-x-1">
                                  <CheckBadgeIcon className="h-4 w-4 text-primary" />
                                  <span>Approuvé</span>
                                </div>

                              </div>

                            )
                            :
                            userData?.userRole?.name === Roles.SUPPORT &&
                            (
                              <div onClick={() => { handleApproveEvent(event.id) }}
                                className={`${isLoading ? "bg-green-700 cursor-not-allowed" : " hover:bg-green-700"} text-center bg-green-700 text-white flex items-center justify-center mt-2 sm:mt-0 px-3 py-2 cursor-pointer rounded shadow-sm text-xs`}
                                disabled={isLoading}>

                                {isLoading ? "Approbation en cours..." : "Approuver cet évènement"}
                              </div>

                            )
                        } */}
                        {!signedIn ?
                          <div className="flex items-center text-xs text-white sm:text-md p-2 space-x-1 bg-green-600 rounded hover:cursor-pointer hover:bg-green-500" onClick={() => handleSignInToEvent()}>
                            <UserPlusIcon className="h-4 w-4 text-white " />
                            <span>S'inscrire</span>
                          </div>
                          :
                          <div className='text-xs p-2 text-center text-green-400 rounded sm:mt-0 bg-green-100'>
                            Inscrit
                          </div>
                        }
                      </div>
                    </div>

                    {/* Event description */}
                    <div className='lg:m-0 lg:w-full space-y-2 pl-2'>

                      <div className='text-xs'>Nom: <span className='font-sans'>{event?.name}</span></div>
                      <hr />
                      <div className='text-xs'> Description: <span className='font-sans'>{event?.description}</span> </div>
                      <hr />
                      <p className='text-xs'> Propriétaire : <span className='font-sans'>{event?.owner?.name}</span></p>
                      {event?.program !== null ?
                        <div className='space-y-2'>
                          <hr />
                          <p className='text-xs'> Programme : <a href={event?.program} target='_' className='font-sans underline text-green-700 hover:text-green-500'>Télécharger le programme</a></p>
                        </div>
                        :
                        ""
                      }

                      {event?.eventParticipants.length !== 0 ?
                        <div className='space-y-2'>
                          <hr />
                          <p className='text-xs'> Participants inscrits : <span className='font-sans'>{event?.eventParticipants?.length}</span></p>
                        </div>
                        :
                        ""
                      }

                    </div>
                  </div>
                )
              }
            </div>

            {
              signedIn &&
              <div>
                <hr />
                <QRCodeGenerator userData={userData?.id} />
              </div>
            }

            <hr />

            <div className=' m-2 sm:m-0 text-md sm:text-md font-medium flex justify-between items-center py-2 '>
              <div>
                Tous les Ateliers
              </div>
              {filteredWorkshops.length >= 1 &&
                (
                  <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                    <button onClick={() => setModalCreateCaState(true)}
                      className='text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500'>
                      Créer un atélier
                    </button>
                  </VerifyPermission>

                )}
            </div>

            <div className='w-full'>
              <div className='w-full h-96'>
                {
                  filteredWorkshops.length > 0 ? (
                    <div className='overflow-x-auto flex w-full h-full text-xs sm:flex-wrap sm:gap-1 items-center sm:justify-center '>
                      {
                        isWorkshopIfApproved.map((item) => (
                          <div
                            key={item.id}
                            className='max-h-[360px] h-[360px] min-w-[250px] max-w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col items-center m-1 bg-white'

                          >
                            {/* Card Header */}
                            <div className='h-2/5 w-full flex items-center justify-center relative'>
                              <div className="h-full w-full" style={{ background: `url(${item.photo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                                <img
                                  src={item.photo}
                                  onError={(e) => {
                                    e.currentTarget.parentNode.style.backgroundImage = `url(${atelierEv})`;
                                  }}
                                  className="hidden"
                                  alt=""
                                />
                              </div>

                              <img
                                src={item?.photo}
                                alt={item?.name}
                                className="object-cover rounded-lg absolute max-w-48 top-1 w-full h-full"
                                onError={(e) => { e.target.src = atelierEv; }}
                              />
                            </div>
                            {/* Card Body */}
                            <div className='w-full p-2 space-y-1 bg-white mt-2 border-t-[1px] pl-6' onClick={(e) => handleClickToGoWorkshop(e, item?.id)}>
                              <h3 className="text-xl">{item?.name}</h3>
                              <p className="font-sans">Salle : {item?.room}</p>
                              <p className="font-sans">

                                Description : {item?.description?.length > 20
                                  ? item?.description?.slice(0, 20) + "..."
                                  : item?.description}
                              </p>
                              {/* <p className='font-medium'>propriétaire : {item?.owner?.name === null ? "Pas de propriétaire" : item?.owner?.name}</p> */}
                              <p className="text-gray-700 font-sans">Prix : {item?.price} Xaf</p>
                              {/* <div className="flex items-center">
                                <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span>{item?.startDate?.split("T")[0]} - {item?.endDate?.split("T")[0]}</span>
                              </div> */}
                              <p className="text-gray-700 font-sans">Type : {item?.isPublic === true ? "Public" : "Privé"}</p>
                              <p className="text-gray-700 font-sans">Présentiel : {item?.isOnlineWorkshop === false ? "oui" : "non"}</p>
                              {/* <p className="text-gray-700 font-sans">Statut : {item?.status}</p> */}
                              <div className="flex items-center">
                                <CheckBadgeIcon className="h-5 w-5 text-green-500 mr-2" />
                                <span>Approuvé</span>
                              </div>
                            </div>
                            <div className='w-full h-12 border-t pt-1 flex items-center space-x-2 justify-center'>
                              {/* <div className="flex items-center text-xs text-white sm:text-md p-2 space-x-1 bg-green-600 rounded hover:cursor-pointer hover:bg-green-500">
                                <UserPlusIcon className="h-4 w-4 text-white " />
                                <span>S'inscrire</span>
                              </div> */}
                              <div className="flex items-center justify-center text-xs text-white sm:text-md p-2 space-x-1 bg-orange-400 rounded hover:cursor-pointer hover:bg-orange-300" onClick={(e) => handleClickToGoWorkshop(e, item?.id)}>
                                <EyeIcon className="h-4 w-4 text-white " />
                                <span>Détail</span>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                      <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                        {
                          isWorkshopIfNotApproved.map((item) => (
                            <div
                              key={item.id}
                              className='max-h-[360px] h-[360px] min-w-[250px] max-w-[250px] hover:cursor-pointer hover:border m-1 hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col items-center bg-white'
                              onClick={(e) => handleClickToGoWorkshop(e, item?.id)}
                            >
                              {/* Card Header */}
                              <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                <div className="h-full w-full" style={{ background: `url(${item.photo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                                  <img
                                    src={item.photo}
                                    onError={(e) => {
                                      e.currentTarget.parentNode.style.backgroundImage = `url(${atelierEv})`;
                                    }}
                                    className="hidden"
                                    alt=""
                                  />
                                </div>
                                <img
                                  src={item?.photo}
                                  alt={item?.name}
                                  className="object-cover rounded-lg absolute max-w-48 top-1 w-full h-full"
                                  onError={(e) => { e.target.src = atelierEv; }}
                                />
                              </div>
                              {/* Card Body */}
                              <div className='w-full p-2 space-y-2 bg-white mt-2 border-t-[1px] pl-6'>
                                <h3 className="text-xl">{item?.name}</h3>
                                <p className="font-sans">Salle : {item?.room}</p>
                                <p className="font-sans" onClick={(e) => handleClickToGoWorkshop(e, item.id)}>
                                  Descritpion : {item.description.length > 20
                                    ? item?.description.slice(0, 20) + "..."
                                    : item?.description}
                                </p>
                                {/* <p className='font-medium'>propriétaire : {item?.owner?.name === null ? "Pas de propriétaire" : item?.owner?.name}</p> */}
                                <p className="text-gray-700 font-medium"
                                  onClick={(e) => handleClickToGoWorkshop(e, item.id)}>
                                  Prix : {item.price} Xaf
                                </p>
                                {/* <div className="flex items-center">
                                  <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  <span>{item?.startDate?.split("T")[0]} - {item?.endDate?.split("T")[0]}</span>
                                </div> */}
                                <p className="text-gray-700 font-sans">Type : {item?.isPublic === true ? "Public" : "Privé"}</p>
                                <p className="text-gray-700 font-sans">État : {item?.isOnlineWorkshop === false ? "En présentiel" : "En ligne"}</p>
                                <div className="flex items-center">
                                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                                  <span>Non Approuvé</span>
                                </div>
                              </div>
                              {/* <div className='w-full h-12 border-t pt-1 flex items-center justify-center space-x-2'>
                                <div className="flex items-center justify-center text-xs text-white sm:text-md p-2 space-x-1 bg-green-600 rounded hover:cursor-pointer hover:bg-green-500">
                                  <UserPlusIcon className="h-4 w-4 text-white " />
                                  <span>S'inscrire</span>
                                </div>
                                <div className="flex items-center justify-center text-xs text-white sm:text-md p-2 space-x-1 bg-orange-400 rounded hover:cursor-pointer hover:bg-orange-300">
                                  <EyeIcon className="h-4 w-4 text-white " />
                                  <span>Détail</span>
                                </div>
                              </div> */}
                            </div>
                          ))
                        }
                      </VerifyPermission>
                    </div>
                  ) : isApproveEvent ? (
                    <div className='flex flex-col items-center justify-center'>
                      <div className='flex flex-col items-center'>
                        <ExclamationTriangleIcon className="h-12 w-12 text-gray-500" />
                        <span className='text-xs'>Pas d'atélier(s) disponible(s).</span>
                      </div>
                      <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                        <button
                          onClick={() => setModalCreateCaState(true)}
                          className='text-xs sm:text-sm border border-1 py-2 px-2 drop-shadow-xl bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-500'
                        >
                          Créer un atélier
                        </button>
                      </VerifyPermission>
                    </div>
                  ) : (
                    <div className='sm:ml-10 flex flex-col items-center justify-center'>
                      <ExclamationTriangleIcon className="h-12 w-12 text-gray-500" />
                      <span className='text-center text-xs'>Eévènement pas encore approuver.</span>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )
      }

      <Modal
        open={modalCreateCatState}
        title="Creer un nouvel atelier"
        onCancel={() => setModalCreateCaState(false)}
        footer={() => { }}
      >
        <CreateWorkshop
          onSuccess={() => {
            setModalCreateCaState(false);
            showEventById();
            toast.success("Atelier créé avec succès", { duration: 3000 });
          }}
          idEvent={idEvent}
          event={event}
        />
      </Modal>

      {scannCode ?
        <div
          className="absolute inset-0"
        // onClick={() => setScannCode(false)}
        >
          <div>
            <QRScannerEvent onClose={setScannCode} eventId={idParam} />
          </div>
        </div>
        :
        ""
      }

      <Toaster />
    </div>
  )
}

export default Event
