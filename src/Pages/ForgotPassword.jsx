import React, { useState } from "react"
import LogoutLayout from "../Layout/LogoutLayout";
import { Link } from "react-router-dom";
import Preloader from "../Components/Preloader";
import toast, { Toaster } from 'react-hot-toast';
import { useFetch } from '../hooks/useFetch';

const ForgotPassword = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");

    const { handlePost } = useFetch();

    const handleSendEmail = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error("veuillez entrer un email valide ", { duration: 3000 });
            return;
        }

        const url = `${import.meta.env.VITE_EVENTS_API}/users/forgot-password`;

        setIsLoading(true);
        try {
            const data = { email };
            const response = await handlePost(url, data, false);

            if (response.success) {

                toast.success("Email de réinitialisation envoyé", { duration: 5000 });

                console.log("response", response);
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
            <div className="shadow-xl border rounded-xl sm:w-[400px] min-h-[290px] max-h-[290px] mt-4 bg-white flex flex-col items-center justify-center">

                <div className="w-full">
                    <h1 className="mx-4 font-bold text-2xl">Mot de passe oublié</h1>
                    <form className="mt-10 mx-9 text-sm flex flex-col space-y-4" onSubmit={handleSendEmail}>
                        {/* Email */}
                        <div className="my-2">
                            <input
                                type="email"
                                id="email"
                                placeholder="Entrez email de recupération"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                className={`outline-0 border-b-2 w-full text-sm py-2 ${!email ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                                    }`}
                            />
                            {!email && (
                                <p className="text-xs text-red-500 mt-1">l'adresse email est réquis</p>
                            )}
                        </div>

                        {/* Bouton submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${isLoading ? 'bg-[#edaa73] cursor-not-allowed' : 'hover:bg-[#edaa73] bg-[#ef9247]'
                                } text-white px-3 py-2 mt-5 rounded-full shadow-sm text-xs flex space-x-4 items-center`}
                        >
                            {isLoading && <Preloader className="w-[20px] sm:w-[25px] sm:h-[25px] h-[20px]" />}
                            <span>{isLoading ? "envoies en cours..." : "envoyer"} </span>
                        </button>

                        <div>
                            <Link to="/signIn" className="hover:text-green-700  w-full text-[#104e45] px-3 py-2 text-xs">
                                Retour
                            </Link>
                        </div>

                    </form>

                </div>
            </div>
        </LogoutLayout>
    )
};

export default ForgotPassword;
