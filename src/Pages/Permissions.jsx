import React, { useEffect, useState, useContext } from 'react';
import { AUTHCONTEXT } from "../context/AuthProvider";
import { useFetch } from "../hooks/useFetch";
import { Tabs } from 'antd';
import Preloader from '../Components/Preloader';
import TablePermissions from '../Components/Tables/TablePermissions';
import CreatePerm from './CreatePerm';

const Permissions = (props) => {
    const [permissions, setPermissions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [create, setCreate] = useState(false)
    const { handleFetch } = useFetch();

    document.title = "Permissions";
    const { userData } = useContext(AUTHCONTEXT);

    const fetchPermissions = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/permissions/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if(response.success){
                setPermissions(response.result.data)
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des permissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, [userData?.id]);

    useEffect(() => {
        return () => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    let itemsOfPermsTabs = [
        {
            key: '1',
            label: 'Permissions',
            children: isLoading ? (
                <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
                </div>
            ) : permissions ? (

                <div>
                    {create ?
                        <CreatePerm setCreate={setCreate} fetchData={fetchPermissions} />
                        :
                        (permissions.length > 0 ? <TablePermissions perms={permissions} /> : <p className='text-gray-500 text-center text-sm'>Aucune permission.</p>)}

                </div>

            ) : (
                <p className='text-gray-500 text-center text-sm'>Aucune permission.</p>
            ),
        },
    ];

    return (
        <>
            <div className='w-auto sm:m-0 lg:min-h-[70vh] md:min-h-[80vh] sm:min-h-[65vh] p-4 animate-fade-in'>

                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-semibold text-gray-900">Les Permissions</h1>

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
                    items={itemsOfPermsTabs}
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

export default Permissions;
