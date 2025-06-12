import React, { useEffect, useState, useContext } from 'react';
import { useFetch } from "../hooks/useFetch";
import { AUTHCONTEXT } from "../context/AuthProvider";
import { CalendarDaysIcon, CheckBadgeIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import { Link, useNavigate } from 'react-router-dom';
import { Segmented, Tabs } from 'antd';
import Preloader from "../Components/Preloader.jsx"
import Roles from '../Utils/Roles.js';
import VerifyPermission from '../Utils/VerifyPermission.jsx';
import CreateEvent from './CreateEvent.jsx';
import evImg from '../assets/Eventsdefault2.jpg'

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


    const handleGenerate = () => {
        const encoded = btoa(`${import.meta.env.VITE_EVENTS_API}/events/`); // encodage base64
        setEncodedUrl(encoded);
    };

    const [create, setCreate] = useState(false)

    const showAllEventOfCreator = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/events/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if (response.success) {
                const events = response.result.data;
                setSelectedEvent(events);

                const isPublic = events.filter(item =>
                    item?.isPublic === true
                    // item?.isApproved === true &&
                    // item?.workshops?.some(workshop => workshop?.isApproved === true)
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
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des évènements:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
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

    let itemsOfEventsTabs = [
        {
            key: '1',
            label: 'Evènements publics',
            children: isLoading ? (
                <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
                </div>
            ) : create ?
                <div className=''>
                    {<CreateEvent setOpen={setCreate} fetchData={showAllEventOfCreator} />}
                </div>
                :
                isPublicEvent.length > 0 ? (
                    <div className=' overflow-x-auto flex sm:flex-wrap sm:space-x-0 sm:gap-2 space-x-4 animate-fade-in'>

                        {

                            isPublicEvent.map(item => (
                                <div key={item.id} onClick={(e) => handleClickToEvent(e, item.id)}
                                    className='max-h-[360px] h-[360px] min-w-[250px] max-w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col flex-grow bg-white'>

                                    {/* Card Header */}
                                    <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                        <div className="h-full w-full" style={{ background: `url(${item.photo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                                            <img
                                                src={item.photo}
                                                onError={(e) => {
                                                    e.currentTarget.parentNode.style.backgroundImage = `url(${evImg})`;
                                                }}
                                                className="hidden"
                                                alt=""
                                            />
                                        </div>
                                        <img className="object-cover rounded-lg h-full absolute max-w-48 top-1 w-full"
                                            src={item.photo} alt='' onClick={(e) => handleClickToEvent(e, item.id)} onError={(e) => { e.target.src = evImg; }} />
                                    </div>
                                    {/* Card Body */}
                                    <div className='m-3 space-y-2 bg-white pl-4 border-t-[1px]'>
                                        <p className='text-lg font-bold'>{item.name}</p>
                                        <p className='text-green-900'>Catégorie : {item.category.name}</p>
                                        <p className=''>{item.description.length > 20 ? item.description.slice(0, 20) + "..." : item.description}</p>
                                        <p className='font-sans text-xs'> Propriétaire : {item.owner.name}</p>
                                        <p className='font-sans text-xs'> type : {item.isPublic === true ? "Public" : "Privé"}</p>
                                        <div className='flex flex-row text-xs items-center gap-2'>
                                            <div className='border-r-2 border-green-500'>
                                                <CalendarDaysIcon className="h-5 w-5 text-green-700" />
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
                                                    }).format(new Date(item.startDate))}
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
                                                    }).format(new Date(item.endDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="flex justify-center h-12 font-bold items-center space-x-1">
                                        <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                                        <span>Approuvé</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className='text-gray-500 text-center text-sm'>Aucun événement public.</p>
                ),
        },
    ];

    if (userData?.userRole?.name === Roles.SUPPORT) {
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
                ) : create ?
                    <div className=''>
                        {<CreateEvent setOpen={setCreate} fetchData={showAllEventOfCreator} />}
                    </div>
                    : isApprovedEvent.length > 0 ? (
                        <div className='flex overflow-x-auto sm:overflow-none sm:flex-row sm:flex-wrap sm:space-x-2 sm:gap-2 space-x-4 p-2 animate-fade-in'>
                            {isApprovedEvent.map(item => (
                                <div key={item.id} onClick={(e) => handleClickToEvent(e, item.id)}
                                    className='max-h-[360px] h-[360px]  min-w-[250px] max-w-[250px] sm:w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col bg-white'>

                                    {/* Card Header */}
                                    <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                        <div className="h-full w-full" style={{ background: `url(${item.photo || evImg})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                                            <img
                                                src={item.photo}
                                                onError={(e) => {
                                                    e.currentTarget.parentNode.style.backgroundImage = `url(${evImg})`;
                                                }}
                                                className="hidden"
                                                alt=""
                                            />
                                        </div>
                                        <img className="object-cover rounded-lg h-full absolute max-w-48 top-1 w-full"
                                            src={item.photo} alt='' onClick={(e) => handleClickToEvent(e, item.id)} onError={(e) => { e.target.src = evImg; }} />
                                    </div>
                                    {/* Card Body */}
                                    <div className='m-3 space-y-2 bg-white pl-4 border-t-[1px]'>
                                        <p className='text-lg font-bold'>{item.name}</p>
                                        <p className='text-green-900'>Catégorie : {item.category.name}</p>
                                        <p>{item.description.length > 20 ? item.description.slice(0, 20) + "..." : item.description}</p>
                                        <p className='font-sans text-xs'> Propriétaire : {item.owner.name}</p>
                                        <p className='font-sans text-xs'> type : {item.isPublic === true ? "Public" : "Privé"}</p>
                                        <div className='flex flex-row text-xs items-center gap-2'>
                                            <div className='border-r-2 border-green-500'>
                                                <CalendarDaysIcon className="h-5 w-5 text-green-700" />
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
                                                    }).format(new Date(item.startDate))}
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
                                                    }).format(new Date(item.endDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="flex justify-center h-12 font-bold items-center space-x-1">
                                        <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                                        <span>Approuvé</span>
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
                ) : create ?
                    <div className=''>
                        {<CreateEvent setOpen={setCreate} fetchData={showAllEventOfCreator} />}
                    </div>
                    : isNotApprovedEvent.length > 0 ? (
                        <div className='flex sm:flex-row sm:flex-wrap sm:space-x-2 sm:gap-2 overflow-x-auto sm:overflow-x-hidden space-x-4 p-2 animate-fade-in'>
                            {isNotApprovedEvent.map(item => (
                                <div key={item.id} onClick={(e) => handleClickToEvent(e, item.id)}
                                    className='max-h-[360px] h-[360px] sm:w-[250px] min-w-[250px] max-w-[250px] hover:cursor-pointer hover:border hover:shadow-lg hover:rounded-lg border-[1px] border-gray-400 rounded-lg flex flex-col  bg-white mx-2'>

                                    {/* Card Header */}
                                    <div className='h-2/5 w-full flex items-center justify-center relative p-5'>
                                        <div className="h-full w-full" style={{ background: `url(${item.photo})`, backgroundSize: "cover", filter: `blur(1.5rem)` }}>
                                            <img
                                                src={item.photo}
                                                onError={(e) => {
                                                    e.currentTarget.parentNode.style.backgroundImage = `url(${evImg})`;
                                                }}
                                                className="hidden"
                                                alt=""
                                            />
                                        </div>
                                        <img className="object-cover rounded-lg h-full absolute max-w-48 top-1 w-full"
                                            src={item.photo} alt='' onClick={(e) => handleClickToEvent(e, item.id)} onError={(e) => { e.target.src = evImg; }} />
                                    </div>
                                    {/* Card Body */}
                                    <div className='m-3 space-y-2 bg-white pl-4 border-t-[1px]'>
                                        <p className='text-lg font-bold'>{item.name}</p>
                                        <p className='text-green-900'>Catégorie : {item.category.name}</p>
                                        <p>{item.description.length > 20 ? item.description.slice(0, 20) + "..." : item.description}</p>
                                        <p className='font-sans text-xs'> Propriétaire : {item.owner.name}</p>
                                        <p className='font-sans text-xs'> type : {item.isPublic === true ? "Public" : "Privé"}</p>
                                        <div className='flex flex-row text-xs items-center gap-2'>
                                            <div className='border-r-2 border-green-500'>
                                                <CalendarDaysIcon className="h-5 w-5 text-green-700" />
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
                                                    }).format(new Date(item.startDate))}
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
                                                    }).format(new Date(item.endDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="flex justify-center h-12 font-bold items-center space-x-1">
                                        <XCircleIcon className="h-5 w-5 text-red-500" />
                                        <span>Non approuvé</span>
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
            <div className='w-auto sm:m-0 lg:min-h-[70vh] md:min-h-[80vh] sm:min-h-[65vh] p-4 animate-fade-in'>

                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-semibold text-gray-900">Les Evènements</h1>

                    <VerifyPermission expected={[Roles.SUPPORT]} received={userData?.userRole?.name}>
                        {!create ?
                            <button className="flex py-2 px-2  bg-orange-400 text-white 
                        rounded-md shadow-md hover:bg-orange-300 
                        self-end text-sm text-center"
                            >
                                {/* <Link to="/users/create">Créer</Link> */}
                                <span onClick={() => setCreate(true)}>Créer</span>
                            </button>
                            :
                            <button className="flex py-2 px-2  bg-red-400 text-white 
                        rounded-md shadow-md hover:bg-red-500 
                        self-end text-sm text-center"
                            >
                                {/* <Link to="/users/create">Créer</Link> */}
                                <span onClick={() => setCreate(false)}>Annuler</span>
                            </button>}
                    </VerifyPermission>
                </div>

                <Tabs
                    defaultActiveKey="1"
                    items={itemsOfEventsTabs}
                    className=''
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
