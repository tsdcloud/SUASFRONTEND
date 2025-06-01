import React, { useState, useRef, useContext, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useFetch } from '../hooks/useFetch';
import { AUTHCONTEXT } from '../context/AuthProvider';
import { Button, Modal } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import VerifyPermission from '../Utils/VerifyPermission';
import Roles from '../Utils/Roles';

export default function ParticipantForm ({onSubmit}){

  const { userData } = useContext(AUTHCONTEXT);
  const {id} = useParams();
  const { handleFetch, handlePost } = useFetch();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const [rolesIsLoading, setRolesIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");

  const [usersIsLoading, setUsersIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [inputName, setInputName] = useState()
  const [inputSurname, setInputSurname] = useState()
  const [inputDescription, setInputDescription] = useState()
  const [isIntegratedAs, setIsIntegratedAs] = useState()
  const [ErrorMessage, setErrorMessage] = useState();

  // "Une erreur s'est produite, réessayez…"
  const nameRef = useRef()
  const surnameRef = useRef()
  const descriptionRef = useRef()
  const isIntegratedRef = useRef()
  const submitedButtonRef = useRef()
  const errorMessageRef = useRef()


  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };


   const createMember = () =>{
    toast.success("Votre compte vient d'être crée, veuillez patienter que nous l'approuvons.",
    {duration: 5000}
    );
   }

   const handleGetRoles = async () => {
      setRolesIsLoading(true);
      const urlRoles = `${import.meta.env.VITE_EVENTS_API}/participantsroles/`;

      try{

        const response = await handleFetch(urlRoles);
        console.log("voici les roles : ", response);

        let userRole = userData?.userRole?.name;
        // console.log(userRole);
        if(userRole?.toLowerCase() !== Roles.SUPPORT.toLowerCase()){
          let filteredRole = response.filter(role => role.name.toLowerCase() === Roles.PARTICIPANT.toLowerCase());
          setRoles(filteredRole);
          setRole(filteredRole[0]?.id);
          return
        }
        setRoles(response);
        setRole(response[0]?.id);
      }
      catch (error) {
        console.error('Erreur lors de la récupération des roles :', error);
      }
      finally {
        setRolesIsLoading(false);
      }
  };

  const handleGetUsers = async () => {
    setUsersIsLoading(true);
    const urlUsers = `${import.meta.env.VITE_EVENTS_API}/users/`;
    try{

      const response = await handleFetch(urlUsers);
      setUsers(response);

      let userRole = userData?.role?.name;

      if(userRole?.toLowerCase() !== Roles.SUPPORT.toLowerCase()){
        setUser(userData?.id);
      }

      setUsers(response);
    }
    catch (error) {
      console.error('Erreur lors de la récupération des roles :', error);
    }
    finally {
      setUsersIsLoading(false);
    }
};

const handleSubmit=async(e)=>{
  e.preventDefault();
  setConfirmLoading(true)
  const data = { 
    workshopId: id,
    name,
    description,
    participantRoleId: role,
    isOnlineParticipation: false,
    ownerId:user 
  }
  try{
    const urlParticipant = `${import.meta.env.VITE_EVENTS_API}/participants/create`;
    const response = await handlePost(urlParticipant, data);
     if(!response.error){
      setUser("");
      setRole("");
      setDescription("");
      setName("");
      onSubmit();
      return
     }
     toast.error("Echec de creation", { duration: 5000});
   } catch (err) {
    console.log(err);
     toast.error("Une erreur est survenu", { duration: 5000});
    }
    finally {
      setConfirmLoading(false);
   }
}

  useEffect(()=>{
    handleGetRoles();
    handleGetUsers();

    if(userData?.userRole?.name !== Roles.SUPPORT){
      setName(userData?.username);
    }

   return()=>{
    setUser("");
    setRole("");
    setDescription("");
    setName("");
   }
  }, []);

  return (
    <>
         <form className='space-y-2' onSubmit={handleSubmit}>
          <VerifyPermission
            expected={[Roles.SUPPORT]}
            received={userData?.userRole?.name}
          >
              <div className="flex flex-col">
                <label htmlFor="">Choisir l'utilisateur :</label>
                <select className={`w-full border-2 p-2 outline-none rounded-md ${usersIsLoading && "cursor-not-allowed"}`} value={user} onChange={e=>setUser(e.target.value)} disabled={usersIsLoading}>
                  {
                    users.map(user => <option className='uppercase' key={user?.id} value={user?.id}>{user?.name}</option>)
                  }
                </select>
              </div>
          </VerifyPermission>
          <div className='flex flex-col space-y-2'>
            <label htmlFor="" className=''>Nom (<span className='text-red-500'>*</span>) :</label>
            <input placeholder='John doe' className='w-full border-2 p-2 outline-none rounded-md' required value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div className='flex flex-col space-y-2'>
            <label htmlFor="" className=''>Choisir le rôle :</label>
            <select className={`w-full border-2 p-2 outline-none rounded-md ${rolesIsLoading && "cursor-not-allowed"}`} disabled={rolesIsLoading} value={role} onChange={e=>setRole(e.target.value)}>
              {
                roles.map(role=><option className='capitalize' key={role?.id} value={role?.id}>{role?.name}</option>)
              }
            </select>
          </div>
          <div className='flex flex-col space-y-2'>
            <label htmlFor="" className=''>Description :</label>
            <textarea placeholder='Expert en marketing digital...' className='w-full border-2 p-2 outline-none rounded-md' value={description} onChange={e=>setDescription(e.target.value)}/>
          </div>
          <div className='flex justify-end'>
            <button className={`${confirmLoading?"bg-orange-300 cursor-not-allowed":"bg-primary hover:bg-orange-500"} text-white p-2 rounded-lg shadow-md `} disabled={confirmLoading}>{confirmLoading ?"Soumission encours...":"Soumettre"}</button>
          </div>
         </form>
         <Toaster />
    </>
  );
};