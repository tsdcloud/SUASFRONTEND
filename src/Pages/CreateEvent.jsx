import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useFetch } from "../hooks/useFetch";
import toast, { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from "../context/AuthProvider";
import Preloader from '../Components/Preloader';

function CreateEvent() {
    document.title = "Créer un évènement"
    const { handlePost, handleFetch, err, setErr, handlePostFile } = useFetch()
  const { userData } = useContext(AUTHCONTEXT)

  const [idUser, setIdUser] = useState(userData?.id)
  // console.log("owner id",idUser)
  const [inputTitle, setInputTitle] = useState()
  const [inputCategorie, setInputCategorie] = useState("")
  const [inputDateStart, setInputDateStart] = useState("");
  const [inputDateEnd, setInputDateEnd] = useState("");
  const [inputDescription, setInputDescription] = useState();
  const [checkIsPublic, setCheckIsPublic] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

const navigateToMyEvent = useNavigate()


  // const [base64Image, setBase64Image] = useState('')
  const [ErrorMessage, setErrorMessage] = useState('')
  const [filePreview, setFilePreview] = useState();
  const [files, setFiles] = useState("");
  const [dataForm, setDataForm] = useState();

  
  const [categoriesOfEvent, setCategoriesOfEvent] = useState([])

  const [visible, setVisible] = useState(false);

  const inputTitleRef = useRef(null)
  const selectRef = useRef(null)
  const DateStartRef = useRef(null)
  const DateEndRef = useRef(null)
  const inputLocationRef = useRef(null)
  const inputImageRef = useRef(null)
  const textAreaRef = useRef(null)
  const errorMessageRef = useRef(null)
  const submitedButtonRef = useRef(null)

  const handleChangeStatusOfEvent = (e) => {
    setCheckIsPublic(e.target.value)
    // if(checkIsPublic === 'isPublic'){
    //   return true
    // }
    // else{
    //   return false
    // }
  }

  const stylesImage = {
    maxWidth: '40%',
    maxHeight: '300px',
  };

  const handleSubmitFiles =(event)=>{
    setFiles(event.target.files);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result); // URL de l'image pour la prévisualisation
    };
    reader.readAsDataURL(file);
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

  
  
  const showCategoriesOfEvent = async () => {
  const url = `${import.meta.env.VITE_EVENTS_API}/categories/`
  try{
    setIsLoading(true);
    const response = await handleFetch(url);
    if (response) {
      setCategoriesOfEvent(response)
      console.log("list cat of event",categoriesOfEvent)
          } 
      } 
      catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
         }
         finally {
          setIsLoading(false);
      }
  };


  useEffect(()=>{
    showCategoriesOfEvent();
  },[])

  const emptyFormCreateEvent = (e) =>{
    e.preventDefault();
    setInputCategorie("")
    setInputTitle("")
    setFiles("")
    setInputDescription("")
    setInputDateStart("")
    setInputDateEnd("")
    setCheckIsPublic(false)
   }


  const handleFormCreateEvent = async (e) =>{
    e.preventDefault()
    const urlFile = `${import.meta.env.VITE_EVENTS_API}/files/upload`
    let imageUrl;
    try {
      setIsLoadingButton(true)
      const res = await handlePostFile(urlFile, files[0]);
      const err = res.error
        if(!err){
          imageUrl = res[0].url;
          // console.log("Check",imageUrl)
        }
        else {
          toast.error(err, { duration: 5000});
          return;
        }
    }
    catch (error) {
      toast.error("Une erreur sur l'upload de l'image est survenue", { duration: 5000 });
    }
    finally{
      setIsLoadingButton(false)
    }


    const data = { 
      "categoryId":inputCategorie,
      "name":inputTitle, 
      "photo":imageUrl,
      "description":inputDescription,
      "startDate":inputDateStart.split("-").reverse().join("-"),
      "endDate":inputDateEnd.split("-").reverse().join("-"),
      "ownerId":idUser?.id || userData?.id,
      "isPublic":checkIsPublic === "true" ? true : false
    }
    console.log(data)
    const url = `${import.meta.env.VITE_EVENTS_API}/events/create`
    try {
          setIsLoadingButton(true)
          const response = await handlePost(url, data);
          const err = response.error
    
          if (!err) {
            setDataForm(response?.results)
            navigateToMyEvent("/events")
          } else {
            toast.error(err, { duration: 5000});
            return;
          }
        } catch (error) {
          toast.error("Echec de création de compte, veuillez réessayer",{ duration: 2000} );
         }
         finally{
          setIsLoadingButton(false)
         }
   }



  return (
    <div className=" w-[380px] sm:w-[700px] md:w-[750px] lg:w-[800px]">
        {/* <Header/> */}
          <div className='w-full sm:flex sm:justify-center text-md'>
                    <Modal open={visible} onCancel={handleCancel} footer={null} >
                    <h3 className="text-lg font-medium">Erreur de taille d'image</h3>
                    <p className="mt-4 text-gray-500">Veuillez réduire la taille de votre image avant de l'emporter.</p>
                  </Modal>


                  <div className="w-full" >

                            <div className=''>

                              <h3 className=' text-xl sm:text-2xl font-extrabold'>Détails de l'évènement</h3>

                              <div className=' space-y-6 sm:space-y-4 mt-5 mx-3 sm:mx-0 sm:mt-8'>

                                <div className=' text-md sm:text-lg flex flex-col md:flex-col sm:justify-center space-y-2 sm:space-x-2'>

                                  <h3 className='w-3/5 sm:w-2/5'>Titre de l'évènement :<sup className='text-red-400'>*</sup></h3>

                                  <input type="text" ref={inputTitleRef} placeholder="Entrer le nom de l'évènement"
                                  name='title' value={inputTitle} onChange={(e)=>setInputTitle(e.target.value)}
                                  className='border-gray-10 
                                  text-gray-700 outline-0.1 text-sm rounded-md block w-full sm:w-3/5 p-3 bg-gray-200
                                  light:border-gray-600 light:placeholder-gray-400' 
                                  required/>

                                </div>

                                <div className='text-md my-10 sm:my-0  sm:text-lg flex flex-col space-y-2 sm:space-x-2'>
                                    <h3 className='w-3/5 sm:w-2/5'>Catégorie de l'évènement :<sup className='text-red-400'>*</sup></h3>

                                    <select name="categories" ref={selectRef} value={inputCategorie} onChange={(e)=>setInputCategorie(e.target.value)}
                                      className='border-[1px] border-gray-300 w-full sm:w-3/5 p-3 rounded-md outline-0' required>
                                        <option className="text-xs sm:tex-sm">Choisir une Catégorie</option>
                                              {  
                                              categoriesOfEvent.map((item) => (
                                                //Ici j'ajoute value={item.id} pour recuperer l'ID
                                                  <option key={item.id} value={item.id} >{item.name}</option>
                                                ))
                                              }
                                    </select>
                                </div>
                              </div>

                            </div>

                            <div className='sm:py-10 my-9 sm:my-5'>

                              <h3 className='text-xl sm:text-2xl font-extrabold'>Date et l'heure</h3>

                              <div className='flex flex-col space-x-3 my-9'>
                                    <div className='w-2/5'>Session</div>
                                    <div className='flex flex-row space-x-4'>

                                        <div className='space-x-3'>
                                            <label className='font-semibold'>Date de début :<sup className='text-red-400'>*</sup></label>
                                            <DatePicker 
                                              format="DD-MM-YYYY"
                                              disabledDate={disabledDate}
                                              ref={DateStartRef}
                                              onChange={(_, DateStart)=>{
                                                setInputDateStart(DateStart)
                                              }}
                                              className='border border-5 rounded-md'
                                            />
                                        </div>

                                        <div className='space-x-3'>
                                            <label className='font-semibold'>Date de fin :<sup className='text-red-400'>*</sup></label>
                                            <DatePicker 
                                            format="DD-MM-YYYY" 
                                            disabledDate={disabledDate} 
                                            ref={DateEndRef}
                                            onChange={(_,DateEnd)=>{
                                              setInputDateEnd(DateEnd)
                                            }}
                                            className='border border-5 rounded-md' required/>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>


                            <div className='my-5'>

                              <h3 className='text-xl sm:text-2xl font-extrabold'>Localisation</h3>

                              <div className='px-3 flex flex-col sm:space-x-2 sm:my-2'>
                                <h3 className='w-full '>Importer la Bannière de votre évènement :<sup className='text-red-400'>*</sup></h3>

                                      {/* il y'avait un fileInput sur ID */}
                                      <input type="file" id='file'
                                      accept="image/png, image/jpeg, image/jpg" 
                                      name="image"
                                      onChange={handleSubmitFiles}  
                                      className='bg-gray-200 border-gray-10 
                                      text-gray-900 outline-0.1 text-sm rounded-md block w-full sm:w-3/5 p-2.5 sm:p-3 
                                      light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400' 
                                      required/>

                                      <img className="mt-3" src={filePreview} alt='' style={stylesImage}/>
                              </div>

                            </div>

                            <div className='my-10'>

                                <h3 className='text-xl sm:text-2xl font-extrabold'>Informations additionnelles</h3>

                                <div className='flex flex-col space-x-2 pt-5'>
                                  <h3 className='w-3/5 sm:w-2/5 mx-2 sm:mx-1'>Description de l'évènemen:<sup className='text-red-400'>*</sup>t</h3>

                                  <textarea name='describedEvent' 
                                  ref={textAreaRef} value={inputDescription} 
                                  onChange={(e)=>setInputDescription(e.target.value)} 
                                  placeholder="Décrivez les particularités de votre événement et les autres détails importants." 
                                  className="text-xs py-1 px-1 border border-1 resize rounded-md h-[50px] w-[360px] sm:w-[500px]" required/>
                                </div>

                            </div>

                            <div className="my-10">
                              <div className='m-2 flex flex-col sm:flex-row'>
                                
                                        <div>
                                              Quel est le statut de votre évènement :<sup className='text-red-400'>*</sup>
                                        </div>
                                          <div className=' mx-2 space-x-2 flex flex-row'>
                                              <div className='space-x-1 flex flex-row'>
                                                  <label for="public"> Public </label>
                                                  <input 
                                                  type="radio" 
                                                  id="public" 
                                                  name='status'
                                                  className='ml-1 focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                                  value={true}
                                                  onChange={(e)=>handleChangeStatusOfEvent(e)}/>

                                              </div>
                                              <div className='space-x-1'>
                                                <label htmlFor="private"> Privé </label>
                                                  <input 
                                                  type="radio" 
                                                  id="private" 
                                                  name='status'
                                                  className=' ml-1 focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                                  value={false}
                                                  onChange={(e)=>handleChangeStatusOfEvent(e)}/>

                                              </div>
                                          </div>

                              </div>
                            </div>

                            <div className='flex justify-end'>

                                  <button 
                                      className={`${isLoadingButton ? "bg-orange-500 cursor-not-allowed":" hover:bg-orange-400"} bg-orange-500 text-white px-4 py-3 mt-5 rounded shadow-sm text-xs`} 
                                      disabled={isLoadingButton}
                                      onClick={(e)=>handleFormCreateEvent(e)} ref={submitedButtonRef}>
                                      {/* {isLoadingButton && <Preloader className='w-[30px] h-[30px] ' />} */}
                                      {isLoadingButton ? "Création en cours...":"Créer un évènement"}
                                 </button>

                                
                            </div>

                            <Toaster />
                    <p ref={errorMessageRef} className='text-red-400'>{ErrorMessage}</p>
                  </div>
                
          </div>
       {/* <Footer/> */}
    </div>
  )
}

export default CreateEvent