import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useFetch } from "../hooks/useFetch";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, DatePicker, AutoComplete } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';


const CreateWorkshop = ({ onSuccess, idEvent, event }) => {
  // const { id } = useParams();
  // document.title = "Créer un atelier";

  const { handlePost, handlePostFile, handleFetch, handlePatch } = useFetch();

  // États du formulaire
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputRoom, setInputRoom] = useState("");
  const [inputNumberOfPlace, setInputNumberOfPlace] = useState(0);
  const [inputPrice, setInputPrice] = useState(0);
  const [inputDateStart, setInputDateStart] = useState("");
  const [inputDateEnd, setInputDateEnd] = useState("");
  const [checkIsPublic, setCheckIsPublic] = useState(true);
  const [inputOwnerId, setInputOwnerId] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [pdfPreview, setPdfPreview] = useState("");
  const [pdf, setPdf] = useState("");

  const [showAllUsers, setShowAllUser] = useState([])
  const navigateToMyWorkshops = useNavigate()

  const nameRef = useRef();
  const descriptionRef = useRef();
  const salleRef = useRef();
  const numberOfPlaceRef = useRef();
  const priceRef = useRef();
  const dateStartRef = useRef();
  const dateEndRef = useRef();
  const inputImageRef = useRef();
  const submitButtonRef = useRef();

  const startEventDate = new Date(event?.startDate)
  const endEventDate = new Date(event?.endDate)

  const handleSubmitFiles = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles([file]);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmitPdf = (event) => {
    setPdf(event.target.files);
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);

    setPdfPreview(url)
  }

  dayjs.extend(customParseFormat);
  const disabledDate = (current) => {
    return current && current < dayjs().endOf('day');
  };

  const emptyFormCreateWorkshop = () => {
    setFiles("")
    setInputOwnerId("")
    setPdf("")
    setPdfPreview("")
    setInputDescription("")
    setInputDateStart("")
    setInputDateEnd("")
    setCheckIsPublic(false)
    setInputName("")
    setInputNumberOfPlace(0)
    setInputPrice("")
    setInputRoom("")
  }

  useEffect(() => {
    const handleShowAllUser = async () => {
      const urlUsers = `${import.meta.env.VITE_EVENTS_API}/users`
      try {
        setIsLoading(true);
        const response = await handleFetch(urlUsers)
        if (response.success) {
          const filteredUsers = response.result.data.map((user) => ({
            id: user.id,
            name: user.name
          }));
          // console.log("users",filteredUsers)
          setShowAllUser(filteredUsers);
        }
      }
      catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
      finally {
        setIsLoading(false);
      }
    };
    handleShowAllUser();
  }, [])

  const handleApproveWorkshop = async (id) => {
    const url = `${import.meta.env.VITE_EVENTS_API}/workshops/approved/${id}`

    setIsLoading(true)
    try {
      const response = await handlePatch(url)

      if (response.success) {
        toast.success("Atelier créé avec succès", { duration: 1000 });
        setTimeout(() => {
          onSuccess()
          emptyFormCreateWorkshop()
        }, 1000);
      }
    }
    catch (error) {
      console.error("Erreur lors de l'approbation de l'atélier:", error);
    }
    finally {
      setIsLoading(false)
    }

  }

  const handleFormCreateWorkshop = async (e) => {
    e.preventDefault();

    const urlFile = `${import.meta.env.VITE_EVENTS_API}/files/upload`;
    const workshopDataUrl = `${import.meta.env.VITE_EVENTS_API}/workshops/create`;

    let imageUrl;
    let pdfUrl

    try {
      setIsLoading(true);

      // Upload de l'image
      const imageRes = await handlePostFile(urlFile, files[0]);
      if (imageRes.error) {
        toast.error(imageRes.error, { duration: 5000 });
        return;
      }

      imageUrl = imageRes.result[0].url;

      if (pdf) {
        try {
          setIsLoading(true)
          const res = await handlePostFile(urlFile, pdf[0]);
          const err = res.error
          if (res.success) {
            pdfUrl = res.result[0].url;
          }
          else {
            toast.error(err, { duration: 5000 });
            return;
          }
        }
        catch (error) {
          toast.error("Une erreur est survenue lors de l'upload du pdf", { duration: 5000 });
        }
        finally {
          setIsLoading(false)
        }
      }

      if (!inputPrice) return toast.error("Veuillez entrer le prix de l'atelier", { duration: 3000 });

      if (!inputDateStart) return toast.error("Veuillez selectionner la date et heure de début", { duration: 3000 });

      if (!inputDateEnd) return toast.error("Veuillez selectionner la date heure de fin", { duration: 3000 });

      // Création de l'atelier
      const data = {
        eventId: idEvent,
        name: inputName,
        description: inputDescription,
        room: inputRoom,
        photo: imageUrl,
        numberOfPlaces: parseInt(inputNumberOfPlace),
        isOnlineWorkshop: false,
        ownerId: inputOwnerId,
        price: parseInt(inputPrice),
        startDate: dayjs(inputDateStart, "YYYY-MM-DD HH:mm:ss").toISOString(),
        endDate: dayjs(inputDateEnd, "YYYY-MM-DD HH:mm:ss").toISOString(),
        // isPublic: checkIsPublic === "true" ? true : false,
        isPublic: true,
      };

      if (pdf) data.program = pdfUrl

      const response = await handlePost(workshopDataUrl, data);

      if (response?.success) {
        handleApproveWorkshop(response.result.id)
      } else {
        toast.error(response.error || "Erreur lors de la création de l’atelier", { duration: 5000 });
      }
    } catch (error) {
      toast.error("Une erreur est survenue", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  //Options qui fourni les data à autoComplete Ant Design
  const options = showAllUsers.map((user) => ({
    id: user.id, // Valeur de l'option (ID de l'utilisateur)
    value: user.name // Nom affiché dans la liste déroulante
  }));

  console.log(inputDateStart, "inputDateStart");


  return (
    <div className="">
      {/* <h1 className="text-xl  text-gray-900 text-center mb-6">Créer un atelier</h1> */}

      <div className="w-full max-w-xl mx-auto p-4 bg-white">
        <form onSubmit={handleFormCreateWorkshop} className="space-y-6">

          {/* Nom */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">
              Titre de l’atelier <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Entrer le nom de l'atelier"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              ref={nameRef}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none font-sans"
              required
            />
          </div>

          {/* Salle */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">
              Indiquer la salle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Entrer le lieu de l'atelier"
              value={inputRoom}
              onChange={(e) => setInputRoom(e.target.value)}
              ref={salleRef}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none font-sans"
              required
            />
          </div>
          <div>
            <div className='flex'>
              <div className=''>
                <label className=''>Date de début :<sup className='text-red-400'>*</sup></label>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DDTHH:mm:ss.SSSZ"
                  disabledDate={disabledDate}
                  onChange={(_, dateStr) => setInputDateStart(dateStr)}
                  className='border border-5 rounded-md flex py-2 my-2'
                />
              </div>
              <div className='space-x-3'>
                <label className='font-medium'>Date de fin :<sup className='text-red-400'>*</sup></label>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DDTHH:mm:ss.SSSZ"
                  disabledDate={disabledDate}
                  onChange={(_, date) => setInputDateEnd(date)}
                  className='border border-5 rounded-md flex py-2 my-2'
                />
              </div>
            </div>
            <div className="flex items-center space-x-1 text-orange-500">
              <div className="text-xs font-bold border-l-2 border-l-orange-500">
                NB
              </div>
              <div className="text-xs">L'évènement commence du {event?.startDate && startEventDate.toLocaleString("fr-FR", {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
                <span> au </span>
                {event?.startDate && endEventDate.toLocaleString("fr-FR", {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">
              Importer la bannière de votre atelier <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSubmitFiles}
              ref={inputImageRef}
              className="border font-sans border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
            {filePreview && (
              <img src={filePreview} alt="Aperçu" className="mt-2 h-32 object-cover rounded" />
            )}
          </div>

          {/* pdf upload */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">Importer le programme de l'atelier</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleSubmitPdf}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-100 file:text-green-700
                        hover:file:bg-green-200"
            // required
            />
            {pdfPreview && (
              <a href={pdfPreview} target="_" className="p-2 text-green-700 hover:text-green-500">Visualiser le programme importé</a>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">
              Décrivez votre atelier <span className="text-red-500">*</span>
            </label>
            <textarea
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              ref={descriptionRef}
              placeholder="Décrivez les particularités de votre atelier..."
              className="font-sans border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"
              rows="3"
              required
            />
          </div>

          {/* Nombre de places */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">
              Nombre de places <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={inputNumberOfPlace}
              onChange={(e) => setInputNumberOfPlace(e.target.value)}
              ref={numberOfPlaceRef}
              className=" font-sans border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
              min={0}
            />
          </div>

          {/* Prix */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">
              Indiquez le prix de l’atelier <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={inputPrice}
              onChange={(e) => setInputPrice(e.target.value)}
              ref={priceRef}
              placeholder="Prix en FCFA"
              className="border font-sans border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
              min={0}
            />
          </div>
          <div className="flex flex-col pt-2">
            <label htmlFor="ownerSelect" className="font-medium text-gray-700 mb-1">
              Définir un propriétaire <sup className="text-red-500">*</sup>
            </label>

            <div className="relative">
              <select
                id="ownerSelect"
                className={`w-full font-sans border border-gray-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-green-400  focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition duration-200`}
                disabled={isLoading}
                value={inputOwnerId}
                onChange={(e) => setInputOwnerId(e.target.value)}
              >
                <option value="" disabled hidden>
                  Sélectionnez un propriétaire
                </option>
                {options.map((user) => (
                  <option key={user.id} value={user.id} className="capitalize">
                    {user.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Statut public/privé */}
          {/* <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">
              Statut de l’atelier <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-6 font-sans">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={true}
                  checked={checkIsPublic === "true" || checkIsPublic === true}
                  onChange={(e) => setCheckIsPublic(e.target.value)}
                  className="mr-2"
                />
                Public
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={false}
                  checked={checkIsPublic === "false" || checkIsPublic === false}
                  onChange={(e) => setCheckIsPublic(e.target.value)}
                  className="mr-2"
                />
                Privé
              </label>
            </div>
          </div> */}

          {/* Bouton soumission */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isLoading}
              ref={submitButtonRef}
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
  );
};

export default CreateWorkshop;