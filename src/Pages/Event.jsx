import React, {useEffect, useState, useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from "../hooks/useFetch";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';
import { AUTHCONTEXT } from "../context/AuthProvider";
import { Pagination, Switch } from 'antd';
import Preloader from "../Components/Preloader.jsx"
import { CalendarDaysIcon, MapPinIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/16/solid";
import Roles from '../Utils/Roles.js';
import VerifyPermission from '../Utils/VerifyPermission.jsx';


function Event() {
    const { userData } = useContext(AUTHCONTEXT)

    const [idUser, setIdUser] = useState(userData?.id);
   
    const [idEvent, setIdEvent] = useState()
    const { id: idParam } = useParams(); //Allows to get id event from url parameter
    const [event, setEvent] = useState()
      
    const [ isApproveEvent, setIsApproveEvent ] = useState()
    const [ filteredWorkshops, setFilteredWorkshops] = useState([]);
    const [isWorkshopIfApproved, setIsWorkshopIfApproved] = useState([])
    const [isWorkshopIfNotApproved, setIsWorkshopIfNotApproved] = useState([])

    const [isLoading, setIsLoading] = useState(false);

    const { handleFetch, err, setErr, handlePatch } = useFetch()
    // const {id} = useParams()

    const navigateToCreateWorkshop = useNavigate()
    const navigateToGoWorkshop = useNavigate()
    const navigateToMyEvent = useNavigate()

    const showEventById = async () =>{
      const url = `${import.meta.env.VITE_EVENTS_API}/events/${idParam}`
      try{
        setIsLoading(true);
          const response = await handleFetch(url)
          const event = response
        //   const seeEvent = event.find(item => item.id == id)
          // console.log("event", event)
          setEvent(event)
          setIdEvent(event.id);
          const checkIsApproved = event.isApproved === true
          setIsApproveEvent(checkIsApproved)

           // Effectuer des calculs ou filtrer les données
          const workshops = event.workshops || [];
          setFilteredWorkshops(workshops);
          // setFilteredWorkshops(event.workshops)
          // console.log("event", event)
          // console.log("uno",filteredWorkshops)
          const isApprovedWorkshop = workshops.filter(workshop => workshop.isApproved === true)
          // console.log("workshop approuvé",isApprovedWorkshop)
          setIsWorkshopIfApproved(isApprovedWorkshop)
          const isNotApprovedWorkshop = workshops.filter(workshop => workshop.isApproved === false)
          // console.log("workshop non approuvé", isNotApprovedWorkshop)
          setIsWorkshopIfNotApproved(isNotApprovedWorkshop)
        //   console.log("I'm array",filteredWorkshops)
          } 
          catch (error) {
            console.error("Erreur lors de la récupération de l'évènement:", error);
             }
          finally {
          setIsLoading(false);
        }
    };
      
    useEffect(()=>{
          showEventById();
    },[idParam])

    const handleApproveEvent = async (eventId) =>{
        const url = `${import.meta.env.VITE_EVENTS_API}/events/approved/${eventId}`
        const confirmation = window.confirm("Êtes-vous sûr de vouloir approuver cet événement ?");

          if (confirmation) {
                try{
                  setIsLoading(true)
                    await handlePatch(url)
                    // navigateToMyEvent(`/events/${eventId}`)
                    showEventById();
                }
                catch(error){
                    console.error("Erreur lors de la modification de l'évènement:", error);
                }
                finally{
                  setIsLoading(false)
                  }
            console.log("L'événement a été approuvé.");
          } else {
            console.log("L'approbation a été annulée.");
          }
        
       
    }

    const handleClickToGoWorkshop = async (e,workshopId) => {
      e.preventDefault()
      navigateToGoWorkshop(`/workshops/${workshopId}`)
      // alert("bonjour")
      // console.log("workshop Id", workshopId)
      
        // const getIdOfWorkshop = await events.find(workshop => workshop.id === workshopId)
        // console.log("Son id est :", getIdOfWorkshop.id)
        // navigateToWorkshop(`/events/workshop/${getIdOfWorkshop?.id}`)
    }

    const handleCreateWorkshop = async (e) =>{
        e.preventDefault();
        navigateToCreateWorkshop(`/workshops/create/${idEvent}`)
    }

     useEffect(() => {
        return () => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, [])


  return (
    <div className='flex flex-col justify-between w-full sm:w-[720px] md:w-[780px] lg:w-[820px] space-y-[30px] sm:space-y-[40px]'>
          {
           
          isLoading ? (
              <div className='flex flex-col justify-center items-center'>
                        <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                        <p className='text-xs'>Chargement…</p>
                </div>
          ) :(
              <>
                      <div className='flex space-x-3 text-sm'>
                            {
                              
                                event && (
                                  <div key={event?.id} className=' w-full sm:w-full rounded sm:rounded-lg'>
                                      {/* Event header image */}
                                      <div 
                                      className='aspect-video h-[300px] w-full sm:w-full sm:p-3 lg:w-[820px] flex justify-center items-center relative border-[1px] rounded-md'>
                                          <div className="h-full w-full" 
                                          style={{background: `url(${event?.photo})`, backgroundSize:"cover", filter: `blur(1.5rem)`}}>
                                          </div>
                                          <img src={event?.photo} alt='event photo' 
                                            className='rounded-lg object-contain w-full h-full justify-center absolute'/>
                                      </div>

                                      {/* Event details information */}
                                      <div 
                                      className='text-xs m-2 lg:my-2 md:m-2 flex flex-col sm:flex-row ism:tems-center justify-between lg:m-0 lg:w-full'>
                                              <div className='text-[10px] flex flex-row items-center font-mono text-orange-400'>
                                              <CalendarDaysIcon className="h-4 w-4 mr-1" />Date de début : 
                                              {event?.startDate && event?.startDate.split("T")[0]} - Date de fin : {event?.startDate && event?.endDate.split("T")[0]}
                                              </div>
                                              <span className="text-xs px-3 py-2 text-center text-green-400 whitespace-nowrap 
                                                  rounded-sm sm:rounded-md mt-2 inline-flex items-center justify-center sm:justify-normal bg-green-100 
                                                  font-medium
                                                  ring-1 ring-inset ring-gray-500/10 ml-0">
                                                  Catégorie : {event?.category?.name}
                                              </span>

                                              {
                                                  //display approve tag
                                                  (event?.isApproved && userData?.userRole?.name === Roles.SUPPORT ) ? (

                                                      <div className='flex flex-row justify-between sm:justify-normal mt-2 sm:mt-0 space-x-3'>

                                                          <div className="flex items-center">
                                                            <CheckCircleIcon className="h-5 w-5 text-primary mr-2" />
                                                            <span>Approuvé</span>
                                                          </div>
                                                          {
                                                          //Display workshop button
                                                          (filteredWorkshops.length) >= 1 && (

                                                              <button onClick={(e)=>handleCreateWorkshop(e)} 
                                                                  className='text-xs border border-1 py-3 px-3 drop-shadow-xl
                                                                  bg-blue-900 text-white font-semibold rounded-lg 
                                                                  shadow-md hover:bg-blue-700'>
                                                                  Créer un atélier
                                                              </button>

                                                          )
                                                          }

                                                      </div>
                                                  
                                                  ) : 
                                                  userData?.userRole?.name === Roles.SUPPORT &&
                                                  (
                                                      <div onClick={() =>{handleApproveEvent(event.id)}} 
                                                      className={`${isLoading ? "bg-green-700 cursor-not-allowed":" hover:bg-green-700"} bg-green-700 text-white justify-center sm:items-center md:justify-normal px-3 mt-2 sm:mt-0 py-2 cursor-pointer rounded shadow-sm text-xs`} 
                                                      disabled={isLoading}>
                                                              
                                                              {isLoading ? "Approbation en cours...":"Approuver cet évènement"}
                                                      </div>
                                                  
                                                  )
                                              }

                                      </div>
                                      
                                      {/* Event description */}
                                      <div className='m-2 lg:m-0 lg:w-full'>

                                          <div className='text-xl font-medium'>{event?.name}</div>
                                          <div className=' text-sm font-light'> {event?.description} </div>
                                          <p className='font-semibold text-xs'> Propriétaire : {event?.owner?.name }</p>

                                      </div>
                                  </div>
                                )
                                
                            }
                      </div>
              
            
                        <div className=' m-2 sm:m-0 text-xs sm:text-md font-medium'>
                          Tous les Ateliers
                        </div>
                        <div className='m-5 p-5 flex flex-row sm:flex-row items-center'>
                          <div className='flex flex-row w-full h-full flex-wrap text-xs space-y-3 sm:flex-wrap sm:space-y-0 items-center justify-center'>
                            
                                      {
                                        filteredWorkshops.length > 0 ? (
                                            <>
                                              
                                                {
                                                  isWorkshopIfApproved.map((item) => (
                                                    <div
                                                      key={item.id}
                                                      className='max-h-[360px] h-[360px] w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col items-center m-2 bg-white'
                                                      onClick={(e)=>handleClickToGoWorkshop(e, item?.id)}
                                                    >
                                                      {/* Card Header */}
                                                        <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                                                      <div className="h-full w-full" style={{background: `url(${item.photo})`,  backgroundSize:"cover", filter: `blur(1.5rem)`}}>
                                                                      </div>
                                                                      <img
                                                                        src={item?.photo}
                                                                        alt={item?.name}
                                                                        className="object-cover rounded-lg h-full absolute"
                                                                      />
                                                        </div>
                                                      {/* Card Body */}
                                                        <div className='m-3 space-y-2 bg-white mt-2 border-t-[1px]'>
                                                            <h3 className="text-xl font-bold">{item?.name}</h3>
                                                            <p className="text-green-700">Salle : {item?.room}</p>
                                                            <p className="" onClick={(e)=>handleClickToGoWorkshop(e, item.id)}>
                                                              {item?.description?.length > 50
                                                                ? item?.description?.slice(0, 50) + "..."
                                                                : item?.description}
                                                            </p>
                                                            <p className='font-medium'>propriétaire : {item?.owner?.name === null ? "Pas de propriétaire" : item?.owner?.name}</p>
                                                            <p className="text-gray-700 font-medium" onClick={(e)=>handleClickToGoWorkshop(e, item.id)}>Prix : {item?.price} Xaf</p>
                                                            <div className="flex items-center">
                                                              <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                              <span>{item?.startDate?.split("T")[0]} - {item?.endDate?.split("T")[0]}</span>
                                                            </div>
                                                            <p className="text-gray-700 font-medium">Type : {item?.isPublic === true ? "Public":"Privé"}</p>
                                                            <p className="text-gray-700 font-medium">État : {item?.isOnlineWorkshop === false ? "En présentiel":"En ligne"}</p>
                                                            <div className="flex items-center">
                                                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                                              <span>Approuvé</span>
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
                                                        className='max-h-[360px] h-[360px] w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col items-center space-y-2 bg-white'
                                                        onClick={(e)=>handleClickToGoWorkshop(e, item?.id)}
                                                    >
                                                        {/* Card Header */}
                                                        <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                                            <div className="h-full w-full" style={{background: `url(${item.photo})`,  backgroundSize:"cover", filter: `blur(1.5rem)`}}>
                                                            </div>
                                                            <img
                                                                src={item?.photo}
                                                                alt={item?.name}
                                                                className="object-cover rounded-lg h-full absolute"
                                                            />
                                                        </div>
                                                    {/* Card Body */}
                                                    <div className='m-3 space-y-2 bg-white mt-2 border-t-[1px]'>
                                                                <h3 className="text-xl font-bold">{item?.name}</h3>
                                                                <p className="text-green-700">Salle : {item?.room}</p>
                                                                <p className="" onClick={(e)=>handleClickToGoWorkshop(e, item.id)}>
                                                                {item.description.length > 50
                                                                    ? item?.description.slice(0, 50) + "..."
                                                                    : item?.description}
                                                                </p>
                                                                <p className='font-medium'>propriétaire : {item?.owner?.name === null ? "Pas de propriétaire" : item?.owner?.name}</p>
                                                                <p className="text-gray-700 font-medium" 
                                                                onClick={(e)=>handleClickToGoWorkshop(e, item.id)}>
                                                                Prix : {item.price} Xaf
                                                                </p>
                                                                <div className="flex items-center">
                                                                <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                                <span>{item?.startDate?.split("T")[0]} - {item?.endDate?.split("T")[0]}</span>
                                                                </div>
                                                                <p className="text-gray-700 font-medium">Type : {item?.isPublic === true ? "Public":"Privé"}</p>
                                                                <p className="text-gray-700 font-medium">État : {item?.isOnlineWorkshop === false ? "En présentiel":"En ligne"}</p>
                                                                <div className="flex items-center">
                                                                <CheckCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                                                                <span>Non Approuvé</span>
                                                                </div>
                                                        </div>
                                                    </div>
                                                    ))
                                                    }
                                                </VerifyPermission>

                                            </>
                                        ) : isApproveEvent ? (
                                          <div className='ml-10 flex flex-col items-center justify-center'>
                                            <ExclamationTriangleIcon className="h-12 w-12 text-gray-500" />
                                            <span>Pas d'atélier(s) disponible(s).</span>
                                            <button
                                              onClick={(e) => handleCreateWorkshop(e)}
                                              className='text-xs border border-1 py-3 px-3 drop-shadow-sm bg-blue-900 text-white  rounded-lg shadow-md hover:bg-blue-700'
                                            >
                                              Créer un atélier
                                            </button>
                                          </div>
                                        ) : (
                                          <div className='sm:ml-10 flex flex-col items-center justify-center'>
                                            <ExclamationTriangleIcon className="h-12 w-12 text-gray-500" />
                                            <span>Vous devez approuver cet évènement pour créer des atéliers.</span>
                                          </div>
                                        )
                                      }
                          </div>
                        </div>
                </>
          )

          
          }
    </div>
  )
}

export default Event
