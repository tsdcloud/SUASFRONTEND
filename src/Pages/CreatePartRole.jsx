import React, { useEffect, useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";


const CreatePartRole = ({ setCreate, fetchData }) => {

    document.title = "Créer le role des participants"
    const { handlePost, handleFetch } = useFetch()

    const [roleName, setRoleName] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const navigateTo = useNavigate()

    // Charger les permissions depuis l'API
    useEffect(() => {
        const fetchPermissions = async () => {
            const url = `${import.meta.env.VITE_EVENTS_API}/permissions`
            try {
                const response = await handleFetch(url)

                if(response.success){
                    setPermissions(response.result.data)
                }

                // if (!response) return toast.error('Erreur lors du chargement des permissions', { duration: 5000 });

            } catch (err) {
                setError(err.message);
            }
        };
        fetchPermissions();
    }, []);

    console.log("selectedPermissions", selectedPermissions);

    // Gérer la sélection des permissions
    const handlePermissionChange = (e) => {
        const permission = e.target.value;
        if (e.target.checked) {
            setSelectedPermissions([...selectedPermissions, permission]);
        } else {
            setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
        }
    };

    const handleFormCreateParticipantRole = async (e) => {
        e.preventDefault()
        const url = `${import.meta.env.VITE_EVENTS_API}/participantsroles/create`

        if (!roleName || selectedPermissions.length === 0) return toast.error('Veuillez entrer un nom et sélectionner au moins une permission', { duration: 3000 })

        let data = {
            name: roleName,
            permissionList: selectedPermissions,
        };

        try {
            setIsLoading(true)
            const res = await handlePost(url, data);
            if (res.success) {
                toast.success("nouveau role créee avec succès", { duration: 1500 })
                setTimeout(() => {
                    // navigateTo('/categories');
                    setCreate(false)
                    fetchData()
                }, 1500);

                // navigateTo("/categories")
            }
            else {
                toast.error("une erreur est survenue...", { duration: 5000 });
                return;
            }
        }
        catch (error) {
            toast.error("Une erreur est survenue", { duration: 5000 });
            //   console.log("erreur");

        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4 animate-fade-in">
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-6">Creer un nouveau role aux participants</h1>
            <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-md ">
                {/* Titre */}
                {/* <h3 className="text-xl font-bold text-gray-800 mb-6">Détails de l'évènement</h3> */}

                {/* Formulaire */}
                <form onSubmit={handleFormCreateParticipantRole} className="space-y-8">

                    {/* Titre de l'événement */}
                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">Entrez le nom du role <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Entrer le nom du role"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Liste des permissions */}
                    <div className="mb-6 space-y-2">
                        <label className="font-medium text-gray-700">Sélectionnez les permissions <span className="text-red-500">*</span></label>
                        {permissions.length === 0 ? (
                            <p>Chargement des permissions...</p>
                        ) : (
                            <div className="space-y-2">
                                {permissions.map((permission) => (
                                    <label key={permission.id || permission.name} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={permission.name}
                                            checked={selectedPermissions.includes(permission.name)}
                                            onChange={handlePermissionChange}
                                            className="form-checkbox h-5 w-5 text-green-600"
                                        />
                                        <span>{permission.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bouton submit */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Création en cours...' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster />
        </div>
    )
};

export default CreatePartRole;

