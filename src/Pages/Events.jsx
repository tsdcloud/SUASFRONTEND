import React, { useEffect, useState, useContext } from 'react';
import { useFetch } from "../hooks/useFetch";
import { AUTHCONTEXT } from "../context/AuthProvider";
import { CalendarDaysIcon, CheckCircleIcon } from "@heroicons/react/16/solid";
import { useNavigate } from 'react-router-dom';
import { Segmented, Tabs } from 'antd';
import Preloader from "../Components/Preloader.jsx"
import Roles from '../Utils/Roles.js';

function Events() {
  document.title = "Mes évènements";
  const { userData } = useContext(AUTHCONTEXT);
  const [infoUser, setInfoUser] = useState(userData);
  const [idUser, setIdUser] = useState(userData?.id);
  const [isApprovedEvent, setIsApprovedEvent] = useState([]);
  const [isNotApprovedEvent, setIsNotApprovedEvent] = useState([]);
  const [isPublicEvent, setIsPublicEvent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { handleFetch } = useFetch();
  const [alignValue, setAlignValue] = useState('center');
  const navigateToEvent = useNavigate();

  useEffect(() => {
    const showAllEventOfCreator = async () => {
    const url = `${import.meta.env.VITE_EVENTS_API}/events/`;
      try {
          setIsLoading(true);
          const response = await handleFetch(url);
          const events = response;
          setSelectedEvent(events);
          
          const isPublic = events.filter(item => 
              // item?.ownerId === userData?.id && 
              item?.isApproved === true && 
              item?.workshops?.some(workshop => workshop?.isApproved === true)
          );
          setIsPublicEvent(isPublic);
          
          const isApproved = events.filter(item => 
              item?.ownerId === userData?.id && 
              item?.isApproved === true
          );
          setIsApprovedEvent(isApproved);
          
          const isNotApproved = events.filter(item => 
              item?.ownerId === userData?.id && 
              item?.isApproved === false
          );
          setIsNotApprovedEvent(isNotApproved);
      } catch (error) {
          console.error('Erreur lors de la récupération des évènements:', error);
      } finally {
          setIsLoading(false);
      }
    };
    showAllEventOfCreator();
  }, [userData?.id]);

  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const handleClickToEvent = (e, eventId) => {
      e.preventDefault();
      const getIdOfEvent = selectedEvent.find(item => item?.id === eventId);
      navigateToEvent(`/events/${getIdOfEvent.id}`);
  };

  let  itemsOfEventsTabs = [
    {
        key: '1',
        label: 'Evènements publics',
        children: isLoading ? (
             <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
             </div>
        ) : isPublicEvent.length > 0 ? (
            <div className=' overflow-x-auto flex sm:flex-row sm:flex-wrap sm:space-x-2 sm:gap-2 space-x-4 p-2'>

                {
                
                isPublicEvent.map(item => (
                        <div key={item.id} onClick={(e)=>handleClickToEvent(e, item.id)}
                        className='max-h-[360px] h-[360px] min-w-[250px] max-w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col flex-grow items-center my-2 bg-white'>

                       {/* Card Header */}
                          <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                        <div className="h-full w-full" style={{background: `url(${item.photo})`,  backgroundSize:"cover", filter: `blur(1.5rem)`}}>
                                        </div>
                                        <img className="object-cover rounded-lg h-full absolute" 
                                        src={item.photo} alt='' onClick={(e)=>handleClickToEvent(e, item.id)}/>
                          </div>
                       {/* Card Body */}
                        <div className='m-3 space-y-2 bg-white mt-2 border-t-[1px]'>
                                <p className='text-lg font-bold'>{item.name}</p>
                                <p className='text-green-900'>Catégorie : {item.category.name}</p>
                                <p>{item.description.length > 50 ? item.description.slice(0, 50) + "..." : item.description}</p>
                                <p className='font-semibold text-xs'> Propriétaire : {item.owner.name }</p>
                                <p className='font-semibold text-xs'> type : {item.isPublic === true ? "Public" : "Privé" }</p>
                                <div className='flex flex-row items-center text-xs'>
                                        <CalendarDaysIcon className="h-6 w-6 text-green-700" /> {item.startDate.split("T")[0]} - {item.endDate.split("T")[0]}
                                </div>
                                <div className="flex items-center">
                                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                      <span>Approuvé</span>
                                </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className='text-gray-500 text-center text-sm'>Aucun événement public.</p>
        ),
    },
  ];

  if(userData?.userRole?.name === Roles.SUPPORT ){
    itemsOfEventsTabs = [
        ...itemsOfEventsTabs,
        {
            key: '2',
            label: 'Mes évènements approuvés',
            children: isLoading ? (
                <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
                </div>
            ) : isApprovedEvent.length > 0 ? (
                <div className='flex overflow-x-auto sm:overflow-none sm:flex-row sm:flex-wrap sm:space-x-2 sm:gap-2 space-x-4 p-2'>
                    {isApprovedEvent.map(item => (
                        <div key={item.id} onClick={(e) => handleClickToEvent(e, item.id)}
                            className='max-h-[360px] h-[360px]  min-w-[250px] max-w-[250px] sm:w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col items-center bg-white'>
    
                            {/* Card Header */}
                            <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                <div className="h-full w-full" style={{ background: `url(${item.photo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                                </div>
                                <img className="object-cover rounded-lg h-full absolute" 
                                    src={item.photo} alt='' onClick={(e) => handleClickToEvent(e, item.id)} />
                            </div>
                            {/* Card Body */}
                            <div className='m-3 space-y-2 bg-white mt-2 border-t-[1px]'>
                                <p className='text-lg font-bold'>{item.name}</p>
                                <p className='text-green-900'>Catégorie : {item.category.name}</p>
                                <p>{item.description.length > 50 ? item.description.slice(0, 50) + "..." : item.description}</p>
                                <p className='font-semibold text-xs'> Propriétaire : {item.owner.name}</p>
                                <p className='font-semibold text-xs'> type : {item.isPublic === true ? "Public" : "Privé"}</p>
                                <div className='flex flex-row items-center text-xs'>
                                    <CalendarDaysIcon className="h-6 w-6 text-green-700" /> {item.startDate.split("T")[0]} - {item.endDate.split("T")[0]}
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                    <span>Approuvé</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-gray-500 text-sm text-center'>Aucun événement approuvé.</p>
            ),
        },
        {
            key: '3',
            label: "En attente d'approbation",
            children: isLoading ? (
                <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
                </div>
            ) : isNotApprovedEvent.length > 0 ? (
                <div className='flex sm:flex-row sm:flex-wrap sm:space-x-2 sm:gap-2 overflow-x-auto sm:overflow-x-hidden space-x-4 p-2'>
                    {isNotApprovedEvent.map(item => (
                        <div key={item.id} onClick={(e) => handleClickToEvent(e, item.id)}
                            className='max-h-[360px] h-[360px] sm:w-[250px] min-w-[250px] max-w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col items-center bg-white mx-2'>
    
                            {/* Card Header */}
                            <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                <div className="h-full w-full" style={{ background: `url(${item.photo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                                </div>
                                <img className="object-cover rounded-lg h-full absolute" 
                                    src={item.photo} alt='' onClick={(e) => handleClickToEvent(e, item.id)} />
                            </div>
                            {/* Card Body */}
                            <div className='m-3 space-y-2 bg-white mt-2 border-t-[1px]'>
                                <p className='text-lg font-bold'>{item.name}</p>
                                <p className='text-green-900'>Catégorie : {item.category.name}</p>
                                <p>{item.description.length > 50 ? item.description.slice(0, 50) + "..." : item.description}</p>
                                <p className='font-semibold text-xs'> Propriétaire : {item.owner.name}</p>
                                <p className='font-semibold text-xs'> type : {item.isPublic === true ? "Public" : "Privé"}</p>
                                <div className='flex flex-row items-center text-xs'>
                                    <CalendarDaysIcon className="h-6 w-6 text-green-700" /> {item.startDate.split("T")[0]} - {item.endDate.split("T")[0]}
                                </div>
                                <div className="flex items-center">
                                    <CheckCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                                    <span>Non approuvé</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-gray-500 text-sm text-center'>Aucun événement en attente d'approbation.</p>
            ),
        },
    ];
    
  }



  useEffect(() => {
    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, []);

  return (
    <>
        <div className='w-[392px] sm:w-auto sm:w-none sm:m-0 lg:bg-transparent lg:min-h-[70vh] md:min-h-[80vh] sm:min-h-[65vh]'>
           
            {/* <Segmented
                defaultValue="center"
                // style={{ marginBottom: 8 }}
                className='bg-red-800 flex-wrap'
            //     onChange={(value) => setAlignValue(value)}
            //     options={['start', 'center', 'end']}
            /> */}

            <Tabs
                defaultActiveKey="1"
                items={itemsOfEventsTabs}
                className=''
            //     onChange={onChangeKeyOfTabs}
                indicator={{
                    size: (origin) => origin - 20,
                    align: alignValue,
                }}
            />
        </div>
    </>
  )
}

export default Events