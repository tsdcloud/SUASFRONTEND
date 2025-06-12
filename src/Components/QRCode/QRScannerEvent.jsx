// QRScannerEvent.js
import React, { useState, useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import toast, { Toaster } from 'react-hot-toast';
import { CheckBadgeIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { useFetch } from "../../hooks/useFetch";
import Preloader from '../Preloader';

const QRScannerEvent = ({ onClose, eventId }) => {
    const [decodedUrl, setDecodedUrl] = useState('');
    const [error, setError] = useState('');
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [okay, setOkay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isNotParticipant, setIsNotparticipant] = useState(false);

    const [participantInfo, setParticipantInfo] = useState("");

    const { handleFetch } = useFetch()

    const handleResult = (result, err) => {
        // if (!!result) {
        // try {
        //     const url = atob(result?.text || result); // décodage base64
        //     setDecodedUrl(url);
        //     toast.success("QR Code décodé avec succès !");
        //     onClose(); // Fermer après succès
        // } catch (e) {
        //     console.error(e);
        //     setError("Erreur lors du décodage de l'URL.");
        //     toast.error("Erreur de décodage.");
        // }
        // }

        // if (!!err) {
        // if (err.name === "AbortError") {
        //     setError("Accès à la caméra refusé.");
        //     toast.error("Accès caméra refusé.");
        // } else if (err.name !== "NotFoundException") {
        //     console.warn("Erreur QR :", err);
        // }
        // }

        if (result?.text) {
            const url = atob(result.text);
            // toast.success(`QR décodé : ${url}`);
            console.log("url", url);

            setDecodedUrl(url)
            // setOkay(true)
            // onClose();
        }

        if (error) {
            // Ignore ces erreurs fréquentes
            if (error.name !== "NotFoundException" && error.name !== "CheckFailedException") {
                console.warn("Erreur QR non critique :", error.message);
            }
        }
    };

    const checkParticipation = async () => {
        let url = `${import.meta.env.VITE_EVENTS_API}/eventparticipants/?ownerId=${decodedUrl}&eventId=${eventId}`
        try {
            setIsLoading(true);
            const response = await handleFetch(url)

            if (response.success) {
                const data = response.result.data
                if (data.length !== 0) {
                    setParticipantInfo(data[0])
                    setOkay(true)
                } else {
                    setIsNotparticipant(true)
                    setOkay(true)
                }
            }
        }
        catch (error) {
            console.error("Erreur lors de la verification de la participation:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(!decodedUrl) return
        checkParticipation()
    }, [decodedUrl])

    const handleError = (err) => {
        console.error(err);
        // setError("Erreur de scanner");
        // toast.error("Décodage du QRCode échoué", { duration: 5000 });
    };

    return (
        <div className="h-1/4 absolute inset-0 z-50 flex items-center justify-center animate-fade-in">
            {/* Arrière-plan flou cliquable pour fermer */}

            {/* Scanner */}
            <div className="relative bg-white p-6 rounded-xl z-10 shadow-xl">
                <h2 className="text-black text-center">Scanner un QR Code</h2>

                {
                    !okay &&
                    <div className="relative w-72 overflow-hidden rounded-lg mb-2">
                        <QrReader
                            constraints={{ facingMode: 'environment' }}
                            onResult={handleResult}
                            videoContainerStyle={{ width: '100%', height: '100%' }}
                            videoStyle={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                        {/* Trait rouge animé */}
                        <div className="absolute w-full h-1 bg-green-500 animate-scan flex ">
                            {/* <div className="w-4/5 h-0.5 bg-red-500 animate-scan"></div> */}
                        </div>
                    </div>

                }

                {
                    (okay && !isNotParticipant) &&
                    <div className='relative w-72 h-52 overflow-hidden rounded-lg mb-2 flex flex-col justify-center items-center bg-gray-50 backdrop-blur-sm animate-fade-in'>
                        <CheckCircleIcon className="h-40 w-40 text-green-700" />
                        <div className='text-green-500 font-semibold flex-1'>
                            <div className='text-xs text-black'>
                                Msr/Mme : {participantInfo?.owner?.name}
                            </div>
                            <div className='text-xs text-black'>
                                Role : <span className='text-green-500'>{participantInfo?.eventParticipantRole?.name}</span>
                            </div>
                        </div>
                    </div>

                }

                {
                    (okay && isNotParticipant) && <div className='relative w-72 h-52 overflow-hidden rounded-lg mb-2 flex flex-col justify-center items-center bg-gray-50 backdrop-blur-sm animate-fade-in'>
                        <XMarkIcon class="h-40 w-40 text-red-700" />
                        <div className='font-semibold flex-1'>
                            <div className='text-xs text-red-600'>
                                N'est pas participant
                            </div>
                        </div>
                    </div>
                }

                {
                    !okay ?
                        <button className="flex py-2 px-2  bg-red-400 text-white 
                            rounded-md shadow-md hover:bg-red-500 
                            self-end text-sm text-center  "
                        >
                            <span onClick={() => onClose(false)} className=' text-xs sm:text-sm'>Fermer</span>
                        </button>
                        :
                        <div className='flex space-x-2  animate-fade-in'>
                            <button className="flex py-2 px-2  bg-green-400 text-white 
                                rounded-md shadow-md hover:bg-green-500 
                                self-end text-sm text-center"
                            >
                                {/* <Link to="/users/create">Créer</Link> */}
                                <span onClick={() => {
                                    setOkay(false); setDecodedUrl("");
                                    setParticipantInfo(); setIsNotparticipant(false)
                                }} className=' text-xs sm:text-sm'>Continuer</span>
                            </button>

                            <button className="flex py-2 px-2  bg-red-400 text-white 
                                rounded-md shadow-md hover:bg-red-500 
                                self-end text-sm text-center"
                            >
                                {/* <Link to="/users/create">Créer</Link> */}
                                <span onClick={() => onClose(false)} className=' text-xs sm:text-sm'>Fermer</span>
                            </button>
                        </div>

                }

            </div>

            <Toaster />
        </div >
    );
};

export default QRScannerEvent;
