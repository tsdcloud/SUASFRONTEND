import React, { useEffect, useState, useContext } from 'react';
import { AUTHCONTEXT } from "../context/AuthProvider";
import { useFetch } from "../hooks/useFetch";
import { Tabs } from 'antd';
import Preloader from '../Components/Preloader';
import { Link } from 'react-router-dom';

import catImg from '../assets/category.jpg'
import CreateCategory from './CreateCategory';
import VerifyPermission from '../Utils/VerifyPermission';



const Category = (props) => {

    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [create, setCreate] = useState(false)
    const { handleFetch } = useFetch();

    document.title = "Catégories";
    const { userData } = useContext(AUTHCONTEXT);

    const fetchCategories = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/categories/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if (response.success) {
                setCategories(response.result.data)
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des évènements:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [userData?.id]);

    useEffect(() => {
        return () => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [])

    let itemsOfEventsTabs = [
        {
            key: '1',
            label: 'Catégories',
            children: isLoading ? (
                <div className='flex flex-col justify-center items-center'>
                    <Preloader className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px]" />
                    <p className='text-xs'>Chargement…</p>
                </div>
            ) : categories ? (

                <div>
                    {!create ?
                        <div className="overflow-x-auto p-4 bg-gray-50 rounded-lg flex justify-center animate-fade-in">
                            <div className="flex flex-col justify-center sm:flex-nowrap gap-4 pb-4 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 w-full ">
                                {categories.map((item) => (
                                    <div
                                        key={item.id}
                                        className="max-w-xs w-full h-[220px] bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-xl hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                                    >
                                        {/* Card Header - Image */}
                                        <div className="relative h-3/5 w-full">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center blur-sm opacity-80"
                                                style={{ backgroundImage: `url(${catImg})` }}
                                            ></div>
                                            <img
                                                src={catImg}
                                                alt=""
                                                className="relative z-10 object-cover h-full w-full"
                                            />
                                        </div>

                                        {/* Card Body - Text */}
                                        <div className="p-4 space-y-2 bg-white">
                                            <p className="text-green-900 text-sm    ">
                                                Numéro de référence : {item.referenceNumber}
                                            </p>
                                            <p className="text-green-900 font-semibold truncate">
                                                Catégorie : {item.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        :
                        <CreateCategory setCreate={setCreate} fetchData={fetchCategories} />}

                </div>

            ) : (
                <p className='text-gray-500 text-center text-sm'>Aucune catégorie.</p>
            ),
        },
    ];

    return (
        <>
            <div className='w-auto sm:m-0 lg:min-h-[70vh] md:min-h-[80vh] sm:min-h-[65vh] p-4 animate-fade-in'>

                <div className='flex justify-between items-center'>
                    <h1 className="text-xl font-semibold text-gray-900">Les Catégories</h1>

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
                            </button>
                        }
                    </VerifyPermission>

                </div>

                <Tabs
                    defaultActiveKey="1"
                    items={itemsOfEventsTabs}
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

export default Category;
