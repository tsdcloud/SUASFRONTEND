
import React, { useState } from "react"
import LogoutLayout from "../Layout/LogoutLayout";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Preloader from "../Components/Preloader";
import toast, { Toaster } from 'react-hot-toast';
import { useFetch } from '../hooks/useFetch';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

const ResetPassword = (props) => {

    const [isLoading, setIsLoading] = useState(false);

    const navigateTo = useNavigate();

    const [newPassword, setNewPassword] = useState("")

    const [cPassword, setCPassword] = useState("")

    const [showCPassword, setShowCPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const { token: tokenParam } = useParams();

    const { handlePost } = useFetch();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!newPassword) return toast.error('Veuillez renseigner le nouveau mot de passe', { duration: 3000 })

        if (!cPassword) return toast.error('Veuillez renseigner le mot de passe de confirmation', { duration: 3000 })

        if (newPassword !== cPassword) return toast.error('Les deux mots de passes doivent être identiques', { duration: 3000 })

        if (newPassword.length < 4) {
            return toast.error("Le mot de passe doit contenir au moins 4 caractères.", { duration: 5000 });
        }

        const url = `${import.meta.env.VITE_EVENTS_API}/users/reset-password/${tokenParam}`;

        setIsLoading(true);

        try {
            const data = { password: newPassword };
            const response = await handlePost(url, data, false);

            if (response.success) {

                toast.success("Mot de passe réinitialiser avec succès", { duration: 2000 });

                setTimeout(() => {
                    navigateTo('/signin');
                }, 2000);

                // console.log("response", response);
            } else {
                toast.error(response.message, { duration: 5000 });
                return;
            }


        } catch (error) {
            console.error(error);
            toast.error("Une erreur inatendu est survenue", { duration: 5000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LogoutLayout>
            <div className="shadow-xl border rounded-xl sm:w-[400px] min-h-[340px] max-h-[340px] mt-4 bg-white flex flex-col items-center justify-center">

                <div className="w-full">
                    <h1 className="mx-4 font-bold text-2xl">changez mot de passe</h1>
                    <form className="mt-10 mx-9 text-sm flex flex-col space-y-4" onSubmit={handleChangePassword}>
                        {/* Password */}
                        <div className="space-y-4">

                            <div className="relative">
                                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                <div className="flex items-center">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(prev => !prev)}
                                    className="absolute right-3 top-8 text-gray-500"
                                >
                                    {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>


                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Confirmez le mot de passe</label>
                                <div className="flex items-center">
                                    <input
                                        type={showCPassword ? "text" : "password"}
                                        id="Cpassword"
                                        value={cPassword}
                                        onChange={(e) => setCPassword(e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowCPassword(prev => !prev)}
                                    className="absolute right-3 top-8 text-gray-500"
                                >
                                    {showCPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Bouton submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${isLoading ? 'bg-[#edaa73] cursor-not-allowed' : 'hover:bg-[#edaa73] bg-[#ef9247]'
                                } text-white px-3 py-2 mt-5 rounded-full shadow-sm text-xs flex space-x-4 items-center`}
                        >
                            {isLoading && <Preloader className="w-[20px] sm:w-[25px] sm:h-[25px] h-[20px]" />}
                            <span>{isLoading ? "modification en cours..." : "modifier"} </span>
                        </button>

                    </form>

                </div>
            </div>
        </LogoutLayout>
    )
};

export default ResetPassword;

