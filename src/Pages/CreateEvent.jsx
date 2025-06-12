import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useFetch } from "../hooks/useFetch";
import toast, { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from "../context/AuthProvider";
import Preloader from '../Components/Preloader';
import moment from "moment";

function CreateEvent({ setOpen, fetchData }) {
  document.title = "Créer un évènement"
  const { handlePost, handleFetch, err, setErr, handlePostFile, handlePatch } = useFetch()
  const { userData } = useContext(AUTHCONTEXT)

  const [idUser, setIdUser] = useState(userData?.id)
  // console.log("owner id",idUser)
  const [inputTitle, setInputTitle] = useState("")
  const [inputCategorie, setInputCategorie] = useState("")
  const [inputDateStart, setInputDateStart] = useState("");
  const [inputDateEnd, setInputDateEnd] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [checkIsPublic, setCheckIsPublic] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const navigateToMyEvent = useNavigate()


  // const [base64Image, setBase64Image] = useState('')
  const [ErrorMessage, setErrorMessage] = useState('')
  const [filePreview, setFilePreview] = useState("");
  const [files, setFiles] = useState("");

  const [pdfPreview, setPdfPreview] = useState("");
  const [pdf, setPdf] = useState("");


  const [categoriesOfEvent, setCategoriesOfEvent] = useState([])

  const [visible, setVisible] = useState(false);

  const handleChangeStatusOfEvent = (e) => {
    setCheckIsPublic(e.target.value)
  }

  const stylesImage = {
    maxWidth: '40%',
    maxHeight: '300px',
  };

  const handleSubmitFiles = (event) => {
    setFiles(event.target.files);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

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


  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };



  const fetchCategoriesOfEvent = async () => {
    const url = `${import.meta.env.VITE_EVENTS_API}/categories/`
    try {
      setIsLoading(true);
      const response = await handleFetch(url);
      if (response.success) {
        setCategoriesOfEvent(response.result.data)
        // console.log("list cat of event", categoriesOfEvent)
      }
    }
    catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  console.log("list cat of event", categoriesOfEvent)


  useEffect(() => {
    fetchCategoriesOfEvent();
  }, [])

  const emptyFormCreateEvent = () => {
    setInputCategorie("")
    setInputTitle("")
    setFiles("")
    setPdf("")
    setPdfPreview("")
    setInputDescription("")
    setInputDateStart("")
    setInputDateEnd("")
    setCheckIsPublic(false)
  }

  const validateCreatedEvent = async (id) => {
    const url = `${import.meta.env.VITE_EVENTS_API}/events/approved/${id}`
    const response = await handlePatch(url)

    if (response.success) {
      setOpen(false)
      fetchData()
      emptyFormCreateEvent()
    }
  }



  const handleFormCreateEvent = async (e) => {
    e.preventDefault()

    const urlFile = `${import.meta.env.VITE_EVENTS_API}/files/upload`
    let imageUrl;
    let pdfUrl
    try {
      setIsLoadingButton(true)
      const res = await handlePostFile(urlFile, files[0]);
      const err = res.error
      if (res.success) {
        imageUrl = res.result[0].url;
        // console.log("Check",imageUrl)
      }
      else {
        toast.error(err, { duration: 5000 });
        return;
      }
    }
    catch (error) {
      toast.error("Une erreur sur l'upload de l'image est survenue", { duration: 5000 });
    }
    finally {
      setIsLoadingButton(false)
    }

    if (pdf) {
      try {
        setIsLoadingButton(true)
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
        setIsLoadingButton(false)
      }
    }


    if (!inputCategorie) return toast.error("Veuillez selectionner la catégorie de l'évenement", { duration: 3000 });

    if (!inputDateStart) return toast.error("Veuillez selectionner la date et heure de début", { duration: 3000 });

    if (!inputDateEnd) return toast.error("Veuillez selectionner la date heure de fin", { duration: 3000 });


    const data = {
      "categoryId": inputCategorie,
      "name": inputTitle,
      "photo": imageUrl,
      "description": inputDescription,
      // "startDate": inputDateStart.split("-").reverse().join("-"),
      // "endDate": inputDateEnd.split("-").reverse().join("-"),
      "startDate": dayjs(inputDateStart, "YYYY-MM-DD HH:mm:ss").toISOString(),
      "endDate": dayjs(inputDateEnd, "YYYY-MM-DD HH:mm:ss").toISOString(),
      "ownerId": idUser?.id || userData?.id,
      // "isPublic": checkIsPublic === true ? true : false,
      "isPublic": true,
    }

    if (pdf) data.program = pdfUrl

    console.log(data)

    const url = `${import.meta.env.VITE_EVENTS_API}/events/create`
    try {
      setIsLoadingButton(true)
      const response = await handlePost(url, data);

      if (response.success) {
        validateCreatedEvent(response.result.id)
      }

    } catch (error) {
      toast.error("Echec de création de compte, veuillez réessayer", { duration: 2000 });
    }
    finally {
      setIsLoadingButton(false)
    }
  }

  return (
    <div className="p-1 animate-fade-in">
      <h1 className="text-xl font-semibold text-gray-900 text-center mb-6">Creer un évènement</h1>
      <div className="w-full max-w-xl mx-auto p-4 bg-transparent rounded-md bg-white">
        {/* Titre */}
        {/* <h3 className="text-xl font-bold text-gray-800 mb-6">Détails de l'évènement</h3> */}

        {/* Formulaire */}
        <form onSubmit={handleFormCreateEvent} className="space-y-8">

          {/* Titre de l'événement */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">Titre de l'évènement <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="Entrer le nom de l'évènement"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          {/* Catégorie */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">Catégorie de l'évènement <span className="text-red-500">*</span></label>
            <select
              value={inputCategorie}
              onChange={(e) => setInputCategorie(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            >
              <option>Choisir une Catégorie</option>
              {categoriesOfEvent.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Date et Heure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">Date de début <span className="text-red-500">*</span></label>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DDTHH:mm:ss.SSSZ"
                  // defaultValue={moment("2025-06-04T17:02:47.899Z")}
                  disabledDate={disabledDate}
                  onChange={(_, dateStr) => setInputDateStart(dateStr)}
                  className="w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">Date de fin <span className="text-red-500">*</span></label>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DDTHH:mm:ss.SSSZ"
                  // defaultValue={moment("2025-06-04T17:02:47.899Z")}
                  disabledDate={disabledDate}
                  onChange={(_, date) => setInputDateEnd(date)}
                  className="w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Image upload */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">Importer la Bannière de votre évènement <span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleSubmitFiles}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-100 file:text-green-700
                        hover:file:bg-green-200"
              required
            />
            {filePreview && (
              <img src={filePreview} alt="Aperçu" className="mt-2 h-40 object-cover rounded-md border-2 border-dashed" />
            )}
          </div>

          {/* pdf upload */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">Importer le programme de votre l'évènement</label>
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
            <label className="font-medium text-gray-700">Description de l'évènement <span className="text-red-500">*</span></label>
            <textarea
              placeholder="Décrivez les particularités de votre événement..."
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              rows={4}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            ></textarea>
          </div>

          {/* Statut public/privé */}
          {/* <div className="flex flex-col space-y-3">
            <p className="font-medium text-gray-700">Statut de l'événement <span className="text-red-500">*</span></p>
            <div className="flex items-center space-x-6">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="public"
                  onChange={(e) => handleChangeStatusOfEvent({ target: { value: true } })}
                  className="text-green-600 focus:ring-green-500"
                />
                <span>Public</span>
              </label>
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="private"
                  onChange={(e) => handleChangeStatusOfEvent({ target: { value: false } })}
                  className="text-green-600 focus:ring-green-500"
                />
                <span>Privé</span>
              </label>
            </div>
          </div> */}

          {/* Bouton submit */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isLoadingButton}
              className={`px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition duration-200 ${isLoadingButton ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isLoadingButton ? 'Création en cours...' : 'Créer'}
            </button>
          </div>

          {/* Message d’erreur global */}
          {ErrorMessage && <p className="text-red-500 text-sm">{ErrorMessage}</p>}
        </form>

        {/* Modal d'erreur taille image */}
        {visible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
              <h3 className="text-sm font-semibold">Erreur de taille d'image</h3>
              <p className="mt-2 text-gray-600">Veuillez réduire la taille de votre image avant de l'uploader.</p>
              <div className="mt-4 flex justify-end">
                <button onClick={handleCancel} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default CreateEvent