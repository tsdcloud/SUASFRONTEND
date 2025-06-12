import React, { useEffect, useState, useContext } from 'react';
import { AUTHCONTEXT } from "../context/AuthProvider";
import { useFetch } from "../hooks/useFetch";
import { Tabs } from 'antd';
import Preloader from '../Components/Preloader';
import TablePermissions from '../Components/Tables/TablePermissions';
import CreatePerm from './CreatePerm';
import TableParticipantRole from '../Components/Tables/TableParticipantRole';
import CreatePartRole from './CreatePartRole';
import TableUserRole from '../Components/Tables/TableUserRole';
import CreateUserRole from './CreateUserRole';
import AssignRoleToUser from './AssignRoleToUser';
import CreateEventRole from './CreateEventRole';
import AssignRoleEventToUser from './AssignRoleEventToUser';
import TableEventRole from '../Components/Tables/TableEventRole';

const EventRole = (props) => {
    const [eventRoles, setEventRoles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [create, setCreate] = useState(false)
    const { handleFetch } = useFetch();

    document.title = "Roles dans les évènements";
    const { userData } = useContext(AUTHCONTEXT);

    const fetchEventRoles = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/eventparticipantroles/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if(response.success){
                setEventRoles(response.result.data)
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEventRoles();
    }, [userData?.id]);

    useEffect(() => {
        return () => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    let itemsOfUsersRolesTabs = [
        {
            key: '1',
            label: 'Roles',
            children: isLoading ? (
                <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
                </div>
            ) : eventRoles ? (

                <div>
                    {create ?
                        <CreateEventRole setCreate={setCreate} fetchData={fetchEventRoles} />
                        :
                        (eventRoles.length > 0 ? <TableEventRole userRole={eventRoles} /> : <p className='text-gray-500 text-center text-sm'>Aucune donnée.</p>)}

                </div>

            ) : (
                <p className='text-gray-500 text-center text-sm'>Aucune donnée.</p>
            ),
        },
        {
            key: '2',
            label: 'Assigner a un utilisateur',
            children: (
                <AssignRoleEventToUser fetchData={fetchEventRoles} />
            ),
        },
        // {
        //     key: '3',
        //     label: 'Assigner a un utilisateur',
        //     children: (
        //         <AssignRoleToUser fetchData={fetchUsersRoles} />
        //     ),
        // },
    ];

    return (
        <>
            <div className='w-auto sm:m-0 lg:min-h-[70vh] md:min-h-[80vh] sm:min-h-[65vh] p-4 animate-fade-in'>

                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-semibold text-gray-900">Roles dans les évènements</h1>

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
                        </button>
                    }
                </div>

                <Tabs
                    defaultActiveKey="1"
                    items={itemsOfUsersRolesTabs}
                    className=''
                    //     onChange={onChangeKeyOfTabs}
                    indicator={{
                        size: (origin) => origin - 20,
                        align: 'center',
                    }}
                />
            </div>
        </>
    )
};

export default EventRole;


