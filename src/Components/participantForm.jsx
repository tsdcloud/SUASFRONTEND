import React, { useState, useRef, useContext, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useFetch } from '../hooks/useFetch';
import { AUTHCONTEXT } from '../context/AuthProvider';
import { Button, Modal } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import VerifyPermission from '../Utils/VerifyPermission';
import Roles from '../Utils/Roles';

export default function ParticipantForm({ onSubmit, workshopData }) {

  const { userData } = useContext(AUTHCONTEXT);
  const { id } = useParams();
  const { handleFetch, handlePost, handlePostFile } = useFetch();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [rolesIsLoading, setRolesIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");

  const [usersIsLoading, setUsersIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessSector, setBusinessSector] = useState("");
  const [functionC, setFunctionC] = useState("");
  const [positionInCompany, setPositionInCompany] = useState("");
  const [description, setDescription] = useState("");

  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState(null);

  const inputImageRef = useRef();

  console.log('role', role);



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

  console.log(users, "rusers");


  const created = () => {
    toast.success("Inscription réussi, veuillez patienter que nous l'approuvons.",
      { duration: 3000 }
    );

    setTimeout(() => {
      onSubmit()
    }, 2000);
  }

  const handleGetRoles = async () => {
    setRolesIsLoading(true);
    const urlRoles = `${import.meta.env.VITE_EVENTS_API}/participantsroles/`;

    try {

      const response = await handleFetch(urlRoles);
      // console.log("voici les roles : ", response);

      if (response.success) {

        let userRole = userData?.userRole?.name;
        // console.log(userRole);
        // workshopData?.participants?.find(e => e.ownerId === userData?.id)?.participantRole?.name?.toLowerCase() !== Roles.MODERATOR.toLowerCase()
        // if (userRole?.toLowerCase() !== Roles.SUPPORT.toLowerCase()) {
        //   let filteredRole = response.result.data.filter(role => role.name.toLowerCase() === Roles.PARTICIPANT.toLowerCase());
        //   setRoles(filteredRole);
        //   setRole(filteredRole[0]?.id);
        //   return
        // }

        if (userRole?.toLowerCase() === Roles.SUPPORT.toLowerCase()) {
          setRoles(response.result.data);
          setRole(response.result.data[0]?.id);

        } else if (workshopData?.participants?.find(e => e.ownerId === userData?.id)?.participantRole?.name?.toLowerCase() === Roles.MODERATOR.toLowerCase()) {
          setRoles(response.result.data);
          setRole(response.result.data[0]?.id);

        } else {
          let filteredRole = response.result.data.filter(role => role.name.toLowerCase() === Roles.PARTICIPANT.toLowerCase());
          setRoles(filteredRole);
          setRole(filteredRole[0]?.id);
          return
        }


      }

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
    try {

      const response = await handleFetch(urlUsers);

      if (response.success) {
        let userRole = userData?.userRole?.name;

        // if (userRole?.toLowerCase() !== Roles.SUPPORT.toLowerCase()) {
        //   setUser(userData?.id);
        //   return
        // }

        if (userRole?.toLowerCase() === Roles.SUPPORT.toLowerCase()) {
          setUsers(response.result.data);

        } else if (workshopData?.participants?.find(e => e.ownerId === userData?.id)?.participantRole?.name?.toLowerCase() === Roles.MODERATOR.toLowerCase()) {
          setUsers(response.result.data);

        } else {
          setUser(userData?.id);
          return
        }
      }
    }
    catch (error) {
      console.error('Erreur lors de la récupération des roles :', error);
    }
    finally {
      setUsersIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setConfirmLoading(true)

    const urlFile = `${import.meta.env.VITE_EVENTS_API}/files/upload`;
    let imageUrl;

    // Upload de l'image
    if (files.length > 0) {
      const imageRes = await handlePostFile(urlFile, files[0]);
      if (imageRes.error) {
        toast.error(imageRes.error, { duration: 5000 });
        return;
      }

      imageUrl = imageRes.result[0].url;
    }

    if (!functionC || files.length === 0 || !name || !surname || !description || !businessSector || !companyName) return toast.error("tout les champs sont réquis", { duration: 3000 });


    const data = {
      workshopId: id,
      name,
      firstName: surname,
      description,
      participantRoleId: role,
      isOnlineParticipation: false,
      ownerId: user,
      businessSector,
      companyName,
      functionC,
      positionInCompany: functionC,
      photo: imageUrl
    }

    console.log("test");


    try {
      const urlParticipant = `${import.meta.env.VITE_EVENTS_API}/participants/create`;
      const response = await handlePost(urlParticipant, data);
      if (response.success) {
        setUser("");
        setRole("");
        setDescription("");
        setName("");
        setBusinessSector("");
        setCompanyName("");
        setFilePreview("");
        setFiles([]);
        setSurname("")
        created()
        return
      }
      toast.error("Echec de creation", { duration: 5000 });
    } catch (err) {
      console.log(err);
      toast.error("Une erreur est survenu", { duration: 5000 });
    }
    finally {
      // setConfirmLoading(false);
    }
  }

  useEffect(() => {
    handleGetRoles();
    handleGetUsers();

    if (userData?.userRole?.name !== Roles.SUPPORT) {
      setName(userData?.username);
    }

    return () => {
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
          // received={userData?.userRole?.name}
          received={userData?.userRole?.name === Roles.SUPPORT ? userData?.userRole?.name : workshopData
            ?.participants?.find(participant => participant?.ownerId === userData?.id)
            ?.participantRole?.name === Roles.MODERATOR ? Roles.SUPPORT : null}
        >
          <div className="flex flex-col">
            <label htmlFor="">Choisir l'utilisateur :</label>
            <select className={`w-full border-2 p-2 outline-none rounded-md ${usersIsLoading && "cursor-not-allowed"}`} value={user} onChange={e => setUser(e.target.value)} disabled={usersIsLoading}>
              {
                users.map(user => <option className='uppercase' key={user?.id} value={user?.id}>{user?.name}</option>)
              }
            </select>
          </div>
        </VerifyPermission>

        <div className='flex flex-col space-y-2'>
          <label htmlFor="" className=''>Nom <span className='text-red-500'>*</span> :</label>
          <input placeholder='Nom' className='w-full border-2 p-2 outline-none rounded-md' required value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor="" className=''>Prénom <span className='text-red-500'>*</span> :</label>
          <input placeholder='Prénom' className='w-full border-2 p-2 outline-none rounded-md' required value={surname} onChange={e => setSurname(e.target.value)} />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor="" className=''>Nom de l'entreprise <span className='text-red-500'>*</span> :</label>
          <input placeholder='Nom entreprise' className='w-full border-2 p-2 outline-none rounded-md' required value={companyName} onChange={e => setCompanyName(e.target.value)} />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor="" className=''>Secteur d'activité <span className='text-red-500'>*</span> :</label>
          <input placeholder='Secteur activité' className='w-full border-2 p-2 outline-none rounded-md' required value={businessSector} onChange={e => setBusinessSector(e.target.value)} />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor="" className=''>Poste ou fonction <span className='text-red-500'>*</span> :</label>
          <input placeholder='Poste ou fonction' className='w-full border-2 p-2 outline-none rounded-md' required value={functionC} onChange={e => setFunctionC(e.target.value)} />
        </div>

        <VerifyPermission
          expected={[Roles.SUPPORT]}
          // received={userData?.userRole?.name}
          received={userData?.userRole?.name === Roles.SUPPORT ? userData?.userRole?.name : workshopData
            ?.participants?.find(participant => participant?.ownerId === userData?.id)
            ?.participantRole?.name === Roles.MODERATOR ? Roles.SUPPORT : null}
        >
          <div className='flex flex-col space-y-2'>
            <label htmlFor="" className=''>Choisir le rôle :</label>
            <select className={`w-full border-2 p-2 outline-none rounded-md ${rolesIsLoading && "cursor-not-allowed"}`} disabled={rolesIsLoading} value={role} onChange={e => setRole(e.target.value)}>
              <option value="">-- Sélectionnez un role --</option>
              {
                roles.map(role => <option className='capitalize' key={role?.id} value={role?.id}>{role?.name}</option>)
              }
            </select>
          </div>
        </VerifyPermission>


        {/* Photo */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700">
            Piece jointe (Carte de visite ou CNI) <span className="text-red-500">*</span>
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

        <div className='flex flex-col space-y-2'>
          <label htmlFor="" className=''>Description : <span className='text-red-500'>*</span></label>
          <textarea placeholder='Description du participant...' className='w-full border-2 p-2 outline-none rounded-md' value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className='flex justify-end'>
          <button className={`${confirmLoading ? "bg-orange-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-500"} text-white p-2 rounded-lg shadow-md border border-1 mt-2 drop-shadow-xl font-semibold`} disabled={confirmLoading}>{confirmLoading ? "Soumission encours..." : "Soumettre"}</button>
        </div>
      </form>

      <Toaster />
    </>
  );
};
