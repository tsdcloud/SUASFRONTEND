import React, { useEffect, useState, useContext } from 'react';
import { AUTHCONTEXT } from "../context/AuthProvider";
import { useFetch } from "../hooks/useFetch";
import { Tabs } from 'antd';
import Preloader from '../Components/Preloader';
import TablePermissions from '../Components/Tables/TablePermissions';
import CreatePerm from './CreatePerm';
import TableParticipantRole from '../Components/Tables/TableParticipantRole';
import CreatePartRole from './CreatePartRole';

const ParticipantRole = (props) => {
    const [partRoles, setPartRoles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [create, setCreate] = useState(false)
    const { handleFetch } = useFetch();

    document.title = "Roles des participants";
    const { userData } = useContext(AUTHCONTEXT);

    const fetchParticipantRoles = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/participantsroles/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if(response.success){
                setPartRoles(response.result.data)
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des permissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipantRoles();
    }, [userData?.id]);

    useEffect(() => {
        return () => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    let itemsOfPartsRolesTabs = [
        {
            key: '1',
            label: 'Roles Participants',
            children: isLoading ? (
                <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
                </div>
            ) : partRoles ? (

                <div>
                    {create ?
                        <CreatePartRole setCreate={setCreate} fetchData={fetchParticipantRoles} />
                        :
                        (partRoles.length > 0 ? <TableParticipantRole partRole={partRoles} /> : <p className='text-gray-500 text-center text-sm'>Aucune donnée.</p>)}

                </div>

            ) : (
                <p className='text-gray-500 text-center text-sm'>Aucune donnée.</p>
            ),
        },
    ];

    return (
        <>
            <div className='w-auto sm:m-0 lg:min-h-[70vh] md:min-h-[80vh] sm:min-h-[65vh] p-4 animate-fade-in'>

                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-semibold text-gray-900">Les roles des participants</h1>

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
                    items={itemsOfPartsRolesTabs}
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

export default ParticipantRole;

