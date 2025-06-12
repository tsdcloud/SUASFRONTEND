import React, { useEffect, useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";


const AssignRoleEventToUser = ({ fetchData }) => {

    document.title = "Assigner role utilisateurs"
    const { handlePost, handleFetch } = useFetch()

    const [roleId, setRoleId] = useState("")
    const [userId, setUserId] = useState("")
    const [eventId, setEventId] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [roles, setRoles] = useState([]);

    const navigateTo = useNavigate()

    const fetchEventRoles = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/eventparticipantroles/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if (response.success) {
                setRoles(response.result.data)
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/users/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if (response.success) {
                setUsers(response.result.data)
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEvents = async () => {
        const url = `${import.meta.env.VITE_EVENTS_API}/events/`;
        try {
            setIsLoading(true);
            const response = await handleFetch(url);

            if (response.success) {
                const events = response.result.data;
                setEvents(events);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des évènements:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEventRoles()
        fetchUsers()
        fetchEvents()
    }, []);

    // console.log("roleId", roleId);
    // console.log("userId", userId);


    const handlePatch = async (url, data) => {
        const token = localStorage.getItem("token"); // ou depuis un contexte
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour");
            }

            return await response.json();
        } catch (error) {
            console.error("Erreur PATCH:", error);
            throw error;
        }
    };

    const handleFormAssignRole = async (e) => {
        e.preventDefault()
        const url = `${import.meta.env.VITE_EVENTS_API}/eventparticipants/create`

        if (!userId || !roleId || !eventId) return toast.error('Veuillez renseigner tout les champs', { duration: 3000 })

        const userObject = users.find((e) => (e.id === userId))

        let data = {
            ownerId: userId,
            eventParticipantRoleId: roleId,
            eventId: eventId
        };

        try {
            setIsLoading(true)
            const res = await handlePost(url, data);

            if (res.success) {
                toast.success("nouveau role assignée avec succès", { duration: 1500 })
                setTimeout(() => {
                    // navigateTo('/categories');
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
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-6">Assigner un nouveau role evènement a un utilisateur</h1>
            <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-md shadow-md">
                {/* Formulaire */}
                <form onSubmit={handleFormAssignRole} className="space-y-8">
                    {/* Sélection de l'utilisateur */}
                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">
                            Sélectionner l'utilisateur <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            required
                        >
                            <option value="">-- Sélectionnez un utilisateur --</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.phone})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sélection du rôle */}
                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">
                            Sélectionnez le rôle <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            required
                        >
                            <option value="">-- Sélectionnez un rôle --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sélection de l'évènement */}
                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">
                            Sélectionnez l'évènement <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={eventId}
                            onChange={(e) => setEventId(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            required
                        >
                            <option value="">-- Sélectionnez l'évènement --</option>
                            {events.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bouton submit */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Assignation en cours...' : 'Assigner'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster />
        </div>
    )
};

export default AssignRoleEventToUser;



