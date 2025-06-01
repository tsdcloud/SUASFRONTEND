import React, {useState, useEffect, useContext} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../context/AuthProvider';
import { EyeSlashIcon, EyeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useFetch } from '../hooks/useFetch';
import Preloader from '../Components/Preloader';
import LogoutLayout from '../Layout/LogoutLayout';
import { ArrowRightIcon } from '@heroicons/react/16/solid';

function SignUp() {
    document.title = "Créer votre compte"

  const { handlePost, err, setErr, handlePostFile } = useFetch()
  const { setNameAs, setToken, setIsAuth, setUser} = useContext(AUTHCONTEXT)
  const navigateToSignIn = useNavigate()

  const [steps, setSteps] = useState(0);

  const [name, setName] = useState()
  const [surname, setSurname] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const [gender, setGender] = useState("MALE")
  const [profilePicture, setProfilePicture] = useState()
  const [files, setFiles] = useState("");

  const [phoneNumber, setPhoneNumber] = useState()

  const [dataForm, setDataForm] = useState({})
  // const [dataFile, setDataFile] = useState()

  const [showPassword, setShowPassword] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const handleChangeGender = (e) =>{
    setGender(e.target.value);
  }

  const handleSubmitFiles =(event)=>{
    setFiles(event.target.files);
  }

  const handleFormCreateUser = async (e) => {
    e.preventDefault()
    const urlFile = `${import.meta.env.VITE_EVENTS_API}/files/upload`
    let imageUrl;
    if(files){
      try {
        setIsLoading(true)
        const res = await handlePostFile(urlFile, files[0]);
        
        // const err = res.error
        if(res){
          // console.log(`restt img`, res)
          imageUrl = res[0].url;
          // console.log("img url", imageUrl)
        }
        else {
            // console.log(`res img`, res)
            toast.error(res.message, { duration: 5000});
            return;
          }
      }
      catch (error) {
        toast.error(`Une erreur est survenue sur l'upload de l'image`, { duration: 5000 });
      }
      finally{
        setIsLoading(false);
      } 
    }
    
    const data = 
    {
      "name":name,
      "surname":surname,
      "email":email, 
      "phone":phoneNumber, 
      "gender":gender, 
      "photo":imageUrl, 
      "username":username, 
      "password":password
    }
    // console.log(data)
    const url = `${import.meta.env.VITE_EVENTS_API}/users/register`
    setIsLoading(true);
    try {
      const response = await handlePost(url, data, false);
      // console.log("res 1",response)
      // console.log("resp error888888",response.error)
      const err = response.error
      
      if (!err)  {
        // console.log("response user create",response)
        // console.log("Good")
        setDataForm(response?.result);
        toast.success("Utilisateur créer avec success.", { duration: 5000 });
        navigateToSignIn("/signIn")
      }
      else {
            console.log("resp error",response.error)
            toast.error(response.error, { duration: 5000 });
            return
          }
      } 
      catch (error) {
        toast.error(`Une erreur est survenue sur la création de l'utilisateur`, { duration: 5000 });
    }
    finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{

    return()=>{
      setSteps(0);
      setName("");
      setSurname("");
      setUsername("");
      setPassword("");
      setEmail("")
      setGender("MALE")
      setProfilePicture("")
      setFiles("");
      setPhoneNumber("");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [])

  
  return (
    <LogoutLayout>
             <div className='shadow-xl border rounded-xl w-[400px] h-[400px] bg-white'>
                 <h1 className='mt-5 mx-4 font-bold text-2xl'>Créer un compte</h1>

                   <form className='mt-10 mx-9 text-sm flex flex-col space-y-4' enctype="multipart/form-data" 
                    onSubmit={(e)=>handleFormCreateUser(e)}>
                          <div className='flex flex-row sm:space-x-0 sm:space-y-1 sm:flex-col'>
                            {
                                steps === 0 ?
                                <div className='flex flex-col w-full'>
                                      <div className='mt-2 sm:flex sm:flex-col sm:ml-4'>
                                        <input 
                                        type="text" 
                                        id="name" 
                                        placeholder='Entrer votre nom *'
                                        className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2'
                                        value={name} onChange={(e) =>setName(e.target.value)}/>
                                      </div>

                                      <div className='mt-2 sm:flex sm:flex-col sm:ml-4'>
                                        <input 
                                        type="text" 
                                        id="surname" 
                                        className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2'
                                        placeholder='Entrer votre prénom *'
                                        value={surname} onChange={(e) =>setSurname(e.target.value)}/>
                                      </div>

                                      <div className='mt-2 sm:flex sm:flex-col sm:ml-4'>
                                        <input type="text" id="username" 
                                        placeholder="Définir votre nom d'utilisateur *"
                                        className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2'
                                        value={username} onChange={(e) =>setUsername(e.target.value)}/>
                                      </div>
                                      
                                      <div className='mt-2 sm:flex sm:flex-col sm:ml-4'>
                                        <input 
                                        type="mail" 
                                        id="email" 
                                        className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2'
                                        placeholder='Entrer votre adresse mail *'
                                        value={email} onChange={(e) =>setEmail(e.target.value)}/>
                                      </div>

                                      <div className='mt-2 sm:flex sm:flex-col sm:ml-4'>
                                        <input 
                                        type="phone" 
                                        id="phone" 
                                        className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2'
                                        placeholder='Entrer votre numéro de téléphone *'
                                        value={phoneNumber} onChange={(e) =>setPhoneNumber(e.target.value)}/>
                                      </div>
                                </div>:
                                steps === 1 &&
                                <div className='flex flex-col w-full'>
                                      <div className='mt-2 sm:flex sm:flex-col sm:ml-4 flex'>
                                          <div>
                                                Spécifier votre genre :<sup className='text-red-400'>*</sup>
                                          </div>
                                            <div className='space-x-2 flex flex-row'>
                                                <div className='space-x-1 flex flex-row'>
                                                    <label for="male"> Homme </label>
                                                    <input 
                                                    type="radio" 
                                                    id="male" 
                                                    name='gender'
                                                    className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2'
                                                    value="MALE"
                                                    checked={gender === 'MALE'} 
                                                    onChange={handleChangeGender}/>

                                                </div>
                                                <div className='space-x-1'>
                                                  <label htmlFor="female"> Femme </label>
                                                    <input 
                                                    type="radio" 
                                                    id="female" 
                                                    name='gender'
                                                    className=' ml-1 focus:outline-green-500 focus:ring-1 focus:ring-green-300 border border-gray-300 rounded px-10 py-2'
                                                    value="FEMALE"
                                                    checked={gender === 'FEMALE'}
                                                    onChange={handleChangeGender}/>

                                                </div>
                                            </div>

                                      </div>


                                      <div className='mt-2 sm:flex sm:flex-col sm:ml-4'>
                                        <label htmlFor="file">Importer votre photo de profil :<sup className='text-red-400'>*</sup> </label>
                                        <input type="file" id="file" 
                                        className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2'
                                        value={profilePicture} onChange={handleSubmitFiles}/>
                                      </div>

                                      <div className='relative mt-2 sm:flex sm:flex-col sm:ml-4'>
                                        <div className='w-100 flex items-center'>
                                          <input type={showPassword ?("text"):("password")} 
                                          id="password"
                                          placeholder="Mot de passe *"
                                          className='outline-0 border-b-2 focus:border-[#ef9247] border-primary w-full text-sm py-2 pr-8'
                                          value={password} onChange={(e) =>setPassword(e.target.value)}/>
                  
                                              <span 
                                                  className="absolute items-end cursor-pointer m-1 right-0"
                                                  onClick={() => setShowPassword((prev) => !prev)}
                                                >
                                                  {showPassword ? 
                                                  
                                                  (<EyeSlashIcon className="h-6 w-6 text-gray-500" />) : 
                  
                                                  (<EyeIcon className="h-6 w-6 text-gray-500" />) 
                                                  
                                                  }
                                              </span>
                                        </div>
                                      </div>
                                </div>

                            }
                          </div>
                          <div className='flex justify-end'>
                            {
                            steps === 0 ?
                            <button 
                              className={`text-[#ef9247] text-xs flex`} 
                              onClick={()=>setSteps(steps+1)}
                            >
                              <span>Suivant</span> 
                              <ArrowRightIcon className='text-[#ef9247] w-4'/>
                            </button>:
                          steps === 1 &&
                          <div className='flex items-center justify-between w-full'>
                            <button 
                              className={`text-[#ef9247] text-xs flex items-center`} 
                              onClick={()=>setSteps(steps-1)}
                            >
                              <ArrowLeftIcon className='text-[#ef9247] w-4'/>
                              <span>Précédent</span> 
                            </button>
                            <button 
                              className={`${isLoading ? "bg-[#ef9247] cursor-not-allowed":" hover:bg-"} hover:bg-[#edaa73] bg-[#ef9247]  text-white px-3 py-2 mt-5 rounded-full shadow-sm text-xs`} 
                              disabled={isLoading}>
                              {isLoading && <Preloader className='w-[30px] h-[30px]' />}
                              <span>{isLoading ? "Création en cours...":"Créer mon compte"}</span>
                            </button>
                          </div>
                          }
                          </div>
                        <p className='text-xs m-3 text-center'>
                          <Link to="/signin" className='text-[#104e45]'>J'ai deja un compte</Link>
                        </p>
                  </form>

             </div>
               <Toaster/>
    </LogoutLayout>
  )
}

export default SignUp