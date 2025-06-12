import React, { useEffect, useState, useContext } from 'react';
import { AUTHCONTEXT } from "../context/AuthProvider";
import { useFetch } from "../hooks/useFetch";
import { Tabs } from 'antd';
import Preloader from '../Components/Preloader';
import { Link } from 'react-router-dom';
import UsersTable from '../Components/Tables/UsersTable';
import CreateUser from './CreateUser';


const Users = (props) => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [create, setCreate] = useState(false)
    const { handleFetch } = useFetch();

    document.title = "Utilisateurs";
    const { userData } = useContext(AUTHCONTEXT);

    const fetchUsers = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/users/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if(response.success){
                setUsers(response.result.data)
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [userData?.id]);

    useEffect(() => {
        return () => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    let itemsOfEventsTabs = [
        {
            key: '1',
            label: 'Utilisateurs',
            children: isLoading ? (
                <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
                </div>
            ) : users.length > 0 ? (

                <div>
                    {create ? <CreateUser setOpen={setCreate} fetchData={fetchUsers} /> : <UsersTable users={users} />}
                </div>

            ) : (
                <p className='text-gray-500 text-center text-sm'>Aucun utilisateur.</p>
            ),
        },
    ];

    return (
        <>
            <div className='w-full lg:min-h-[70vh] md:min-h-[80vh] sm:min-h-[65vh] p-4 animate-fade-in'>

                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-semibold text-gray-900">Les utilisateurs</h1>

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
                </div>

                <Tabs
                    defaultActiveKey="1"
                    items={itemsOfEventsTabs}
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

export default Users;
