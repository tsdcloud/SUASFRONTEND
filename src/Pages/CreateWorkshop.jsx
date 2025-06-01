import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, DatePicker, AutoComplete } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useFetch } from "../hooks/useFetch";
import toast, { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from "../context/AuthProvider";

function CreateWorkshop() {
    const { id } = useParams();
  // console.log("event Id :",id)
 document.title = "Créer un atélier"

 const { handlePost, handleFetch, err, setErr, handlePostFile } = useFetch()
  const { userData } = useContext(AUTHCONTEXT)

  const [idUser, setIdUser] = useState(userData)
  const [inputName, setInputName] = useState()
  const [inputDescription, setInputDescription] = useState();
  const [inputRoom, setInputRoom] = useState();
  const [inputPhoto, setInputPhoto] = useState();
  const [inputNumberOfPlace, setInputNumberOfPlace] = useState()
  const [isOnlineWorkshop, setIsOnlineWorkshop] = useState(false)
  const [inputPrice, setInputPrice] = useState()
  const [inputDateStart, setInputDateStart] = useState("");
  const [inputDateEnd, setInputDateEnd] = useState("");
  const [checkIsPublic, setCheckIsPublic] = useState(true);
  const [inputOwnerId, setInputOwnerId] = useState();
  const [showAllUsers, setShowAllUser] = useState([])


  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [filePreview, setFilePreview] = useState();
  const [files, setFiles] = useState("");
  const [dataForm, setDataForm] = useState();

  const navigateToMyWorkshops = useNavigate()
  
  
    
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
    
    const [ErrorMessage, setErrorMessage] = useState()
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState();

    const nameRef = useRef()
    const salleRef = useRef()
    const dateStartRef = useRef()
    const HourStartRef = useRef()
    const HourEndRef = useRef()
    const inputImageRef = useRef()
    const descriptionRef = useRef()
    const pricePremiumRef = useRef()
    const priceVipRef = useRef()
    const numberOfPlaceRef = useRef()
    const submitedButtonRef = useRef()
    const errorMessageRef = useRef()


    const stylesImage = {
        maxWidth: '50%',
        maxHeight: '300px',
      };

    const handleChangeStatusOfEvent = (e) => {
      setCheckIsPublic(e.target.value)
    }

    useEffect(()=>{
      const handleShowAllUser = async () => {
        const urlUsers = `${import.meta.env.VITE_EVENTS_API}/users`
        try{
          setIsLoading(true);
          const response = await handleFetch(urlUsers)
          if (response) {
            const filteredUsers = response.map((user) => ({
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
               finally{
                setIsLoading(false);
               }
        };
        handleShowAllUser();
    },[])


    const handleFormCreateWorkshop = async (e) =>{
      e.preventDefault()
      const urlFile = `${import.meta.env.VITE_EVENTS_API}/files/upload`
      let imageUrl;
      try {
        setIsLoadingButton(true);
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
        toast.error("Une erreur est survenue sur l'opload de l'image", { duration: 5000 });
      }
      finally{
        setIsLoadingButton(false);
        }


      const data = { 
        "eventId": id,
        "name":inputName, 
        "description":inputDescription,
        "room":inputRoom,
        "photo":imageUrl,
        "numberOfPlaces":parseInt(inputNumberOfPlace),
        "isOnlineWorkshop":isOnlineWorkshop,
        "ownerId":inputOwnerId,
        "price":parseInt(inputPrice),
        "startDate":inputDateStart.split("-").reverse().join("-"),
        "endDate":inputDateEnd.split("-").reverse().join("-"),
        "isPublic":checkIsPublic === "true" ? true : false
      }
      // console.log(data)
      const url = `${import.meta.env.VITE_EVENTS_API}/workshops/create`
      try {
        setIsLoadingButton(true);
            const response = await handlePost(url, data);
            const err = response.error
      
            if (!err) {
              setDataForm(response?.results)
              navigateToMyWorkshops(`/events/${id}`)
            } else {
              toast.error(err, { duration: 5000});
              return;
            }
          } catch (error) {
            toast.error("Echec de création de l'atelier, veuillez réessayer",
            {
              duration: 2000}
             );
           }
           finally{
            setIsLoadingButton(false);
           }
    }

  //Options qui fourni les data à autoComplete Ant Design
    const options = showAllUsers.map((user) => ({
      id: user.id, // Valeur de l'option (ID de l'utilisateur)
      value: user.name // Nom affiché dans la liste déroulante
    }));
  return (
    <div className=" w-[380px] sm:w-[700px] md:w-[750px] lg:w-[800px]">
       
        <div className=''>
            
          <h3 className='text-lg sm:text-2xl font-extrabold'>Détails de l'atélier</h3>

          <div className='space-y-2 mt-2'>

            <div className='flex flex-col space-x-2'>
              <h3 className='w-2/5'>Titre de l'atélier :<sup className='text-red-400'>*</sup></h3>
              <input type="text" value={inputName} onChange={(e) =>setInputName(e.target.value)} 
              ref={nameRef} placeholder="Entrer le nom de l'atélier" 
              className='border border-1 border-gray-10 text-gray-900 outline-0.1 text-sm rounded-md block w-4/5 sm:w-3/5 p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400' 
              required/>
            </div>

            <div className='flex flex-col space-x-2'>
              <h3 className='w-2/5'>Indiquer la salle :<sup className='text-red-400'>*</sup></h3>
              <input type="text" value={inputRoom} onChange={(e)=>setInputRoom(e.target.value)} 
              ref={salleRef} placeholder="Entrer le lieu de l'atélier" 
              className='border border-1 border-gray-10 text-gray-900  outline-0.1 text-sm rounded-md block w-4/5 sm:w-3/5 p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400' 
              required/>
            </div>
            
          </div>
        </div>

        <div className='my-6'>

          <h3 className='text-lg sm:text-2xl font-extrabold'>Date et l'heure</h3>

          <div className='flex flex-col space-x-3 my-2'>
                <div className='w-2/5'>Session</div>
                <div className='flex flex-row space-x-4'>

                    <div className='space-x-3'>
                        <label className='font-semibold'>Date de début :<sup className='text-red-400'>*</sup></label>
                        <DatePicker 
                                      format="DD-MM-YYYY"
                                      disabledDate={disabledDate}
                                      onChange={(_, dateStart)=>{
                                        setInputDateStart(dateStart)
                                      }}
                                      className='border border-5 rounded-md'
                                    />
                    </div>
                    <div className='space-x-3'>
                        <label className='font-semibold'>Date de fin :<sup className='text-red-400'>*</sup></label>
                        <DatePicker 
                                      format="DD-MM-YYYY"
                                      disabledDate={disabledDate}
                                      onChange={(_, dateEnd)=>{
                                        setInputDateEnd(dateEnd)
                                      }}
                                      className='border border-5 rounded-md'
                                    />
                    </div>
                </div>
          </div>
        </div>


        <div className='my-6'>
          <div className='flex flex-col space-x-2'>
            <h3 className=' w-4/5 sm:w-3/5'>Importer la Bannière de votre atélier :<sup className='text-red-400'>*</sup></h3>
                  <input type="file" id='file'
                  ref={inputImageRef} accept="image/png, image/jpeg, image/jpg" 
                        onChange={handleSubmitFiles} 
                  className='bg-gray-200 border-gray-10 
                  text-gray-900 outline-0.1 text-sm rounded-md block w-5/6 sm:w-3/5 p-2.5 sm:p-3 
                  light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400' 
                  required/>
                  <img src={filePreview} alt='' style={stylesImage}/>
          </div>
          <div className='flex flex-col space-x-2 my-2'>
            <h3 className=' w-3/5'>Décrivez votre atélier :<sup className='text-red-400'>*</sup></h3>
                  <textarea type="text" ref={descriptionRef} value={inputDescription}
                    onChange={(e)=>setInputDescription(e.target.value)} 
                    placeholder="Décrivez les particularités de votre atélier et les autres détails importants." 
                  className='border border-1 border-gray-10 
                  text-gray-900  outline-0.1 text-xs rounded-md block w-5/6 sm:w-3/5 p-2.5 
                  light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400' 
                  required/>
          </div>
        </div>

        <div className='my-2'>

            <h3 className='text-lg sm:text-2xl font-extrabold'>Informations additionnelles</h3>

            <div className='flex flex-col space-x-2 pt-2'>
              <h3 className=' w-4/5'>Indiquer le prix de votre atélie :<sup className='text-red-400'>*</sup></h3>
              <input type='number' value={inputPrice}
              onChange={(e)=>setInputPrice(e.target.value)}
              ref={pricePremiumRef}
              className="text-sm px-1 border border-1 resize rounded-md h-10 w-5/6 sm:w-3/5"/>
            </div>

            <div className='flex flex-col space-x-2  pt-2'>
              <h3 className='w-2/5'>Nombre de places :<sup className='text-red-400'>*</sup></h3>
              <input type='number' value={inputNumberOfPlace}
              onChange={(e)=>setInputNumberOfPlace(e.target.value)}
              ref={numberOfPlaceRef}
              className="text-sm px-1 border border-1 resize rounded-md h-10 w-5/6 sm:w-3/5"/>
            </div>

            <div className='flex flex-col space-x-2 pt-2'>
              <h3 className='w-3/5'>Définir un propriétaire :<sup className='text-red-400'>*</sup></h3>
              <AutoComplete
                    className="w-5/6 sm:w-3/5"
                    options={options}
                    placeholder="Commencez à écrire…"
                    filterOption={(inputValue, option) =>
                      option.value.toUpperCase().includes(inputValue.toUpperCase())
                    }

                    onChange={(value) => {
                      // Trouver l'option correspondante à la valeur sélectionnée
                      const selectedOption = options.find(option => option.value === value);
                  
                      // Si une option est trouvée, récupérer son ID et le stocker dans inputOwnerId
                      if (selectedOption) {
                        setInputOwnerId(selectedOption.id);
                      }
                    }}
                    
                  />
              
            </div>
        </div>

        <div className="my-2">
                                <div className='flex flex-col sm:flex-row'>
                                          <div>
                                                Quel est le statut de votre atélier :<sup className='text-red-400'>*</sup>
                                          </div>
                                            <div className=' mx-2 space-x-2 flex flex-row'>
                                                <div className='space-x-1 flex flex-row'>
                                                    <label htmlFor="public"> Public </label>
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
                className={`${isLoadingButton ? "bg-primary cursor-not-allowed":" hover:bg-green-700"} bg-primary text-white px-4 py-3 mt-5 rounded shadow-sm text-xs`} 
                disabled={isLoadingButton}
                onClick={(e)=>handleFormCreateWorkshop(e)} ref={submitedButtonRef}
                >
                  {isLoadingButton ? "Création en cours...":"Créer un atélier"}
                </button>
                <p ref={errorMessageRef} className='text-red-400'>{ErrorMessage}</p>
        </div>
      <Toaster/>
</div>
  )
}

export default CreateWorkshop