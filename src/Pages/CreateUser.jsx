import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../context/AuthProvider';
import { EyeSlashIcon, EyeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useFetch } from '../hooks/useFetch';
import Preloader from '../Components/Preloader';
import LogoutLayout from '../Layout/LogoutLayout';
import { ArrowRightIcon } from '@heroicons/react/16/solid';

function CreateUser({ setOpen, fetchData }) {
  document.title = "Créer un utilisateur";

  const { handlePost, handlePostFile } = useFetch();
  const { setNameAs, setToken, setIsAuth, setUser } = useContext(AUTHCONTEXT);
  const navigateToSignIn = useNavigate();

  const [steps, setSteps] = useState(0);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [files, setFiles] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const handleChangeRole = (role, value) => {
    switch (role) {
      case 'admin':
        setIsAdmin(value);
        break;
      case 'staff':
        setIsStaff(value);
        break;
      case 'owner':
        setIsOwner(value);
        break;
      default:
        break;
    }
  };


  // Fonction de validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
      isValid = false;
    } else if (name.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
      isValid = false;
    }

    // if (!surname.trim()) {
    //   newErrors.surname = "Le prénom est requis";
    //   isValid = false;
    // } else if (surname.length < 3) {
    //   newErrors.surname = "Le prénom doit contenir au moins 3 caractères";
    //   isValid = false;
    // }

    // if (!username.trim()) {
    //   newErrors.username = "Le nom d'utilisateur est requis";
    //   isValid = false;
    // } else if (username.length < 3) {
    //   newErrors.username = "Le nom d'utilisateur doit faire au moins 3 caractères";
    //   isValid = false;
    // }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!email.trim()) {
    //   newErrors.email = "L'email est requis";
    //   isValid = false;
    // } else if (!emailRegex.test(email)) {
    //   newErrors.email = "Veuillez entrer un email valide";
    //   isValid = false;
    // }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
      isValid = false;
    }

    // if (!gender) {
    //   newErrors.gender = "Veuillez sélectionner votre sexe";
    //   isValid = false;
    // }

    if (steps === 1) {
      // if (!files[0]) {
      //   newErrors.files = "La photo de profil est requise";
      //   isValid = false;
      // }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (!password.trim()) {
        newErrors.password = "Le mot de passe est requis";
        isValid = false;
      } else if (!passwordRegex.test(password)) {
        newErrors.password =
          "Doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial";
        isValid = false;
      }

      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = "La confirmation du mot de passe est requise";
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };

  const handleSubmitFiles = (event) => {
    setFiles(event.target.files);
  };

  const handleFormCreateUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Corrigez les erreurs avant de soumettre.");
      return;
    }

    const urlFile = `${import.meta.env.VITE_EVENTS_API}/files/upload`;
    let imageUrl;

    try {
      setIsLoading(true);

      if (files.length > 0) {
        const res = await handlePostFile(urlFile, files[0]);
        if (res?.error) {
          toast.error(res.message || "Erreur lors de l'upload de l'image", { duration: 5000 });
          return;
        }
        imageUrl = res[0]?.url;
      }

      const data = {
        name,
        phone: phoneNumber,
        password,
        isOwner,
        isAdmin,
        isStaff
      };
      
      if(surname) data.surname = surname
      if(email) data.email = email
      if(gender) data.gender = gender
      if(username) data.username = username
      if(imageUrl) data.photo = imageUrl

      const url = `${import.meta.env.VITE_EVENTS_API}/users/register`;
      const response = await handlePost(url, data, false);

      if (response?.error) {
        toast.error(response.error, { duration: 5000 });
        return;
      }

      toast.success("Utilisateur créé avec succès.", { duration: 5000 });
      setTimeout(() => {
        // navigateToSignIn('/signIn');
        setOpen(false)
        fetchData()
      }, 1500);

    } catch (error) {
      toast.error("Une erreur est survenue lors de la création de l'utilisateur.", { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setSteps(0);
      setName("");
      setSurname("");
      setUsername("");
      setPassword("");
      setEmail("");
      setGender("");
      setProfilePicture("");
      setFiles([]);
      setPhoneNumber("");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }, []);

  return (
    <>
      <div className="p-1 animate-fade-in">
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">Créer un compte</h1>
        <div className="w-full max-w-xl mx-auto p-4 bg-white">
          <form className="space-y-8" encType="multipart/form-data" onSubmit={handleFormCreateUser}>
            <div>
              {steps === 0 ? (
                <>
                  {/* Nom */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">Nom <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Entrer votre nom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Prénom */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">Prénom</label>
                    <input
                      type="text"
                      id="surname"
                      placeholder="Entrer votre prénom"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className={`border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.surname ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.surname && <p className="text-xs text-red-500 mt-1">{errors.surname}</p>}
                  </div>

                  {/* Nom d'utilisateur */}
                  {/* <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">Nom d'utilisateur <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="username"
                      placeholder="Nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                  </div> */}

                  {/* Email */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Téléphone */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">Numéro de téléphone <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      id="phone"
                      placeholder="Numéro de téléphone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
                  </div>
                </>
              ) : steps === 1 ? (
                <>
                  {/* Sexe */}
                  <div className="flex flex-col space-y-2 mb-2">
                    <label className="font-medium text-gray-700">Genre</label>
                    <div className="flex space-x-4 text-gray-700">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="gender" value="MALE" checked={gender === 'MALE'} onChange={handleChangeGender} />
                        <span>Homme</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="gender" value="FEMALE" checked={gender === 'FEMALE'} onChange={handleChangeGender} />
                        <span>Femme</span>
                      </label>
                    </div>
                    {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                  </div>

                  {/* Photo de profil */}
                  <div className="flex flex-col space-y-2">
                    <label className="font-medium text-gray-700">Photo de profil</label>
                    <input
                      type="file"
                      id="file"
                      onChange={handleSubmitFiles}
                      className={`border bg-white rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.files ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.files && <p className="text-xs text-red-500">{errors.files}</p>}
                  </div>

                  {/* Mot de passe */}
                  <div className="flex flex-col space-y-2 relative">
                    <label className="font-medium text-gray-700">Mot de passe <span className="text-red-500">*</span></label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <span
                      className="absolute right-3 top-9 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </span>
                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  </div>

                  {/* Confirmer mot de passe */}
                  <div className="flex flex-col space-y-2 relative">
                    <label className="font-medium text-gray-700">Confirmer le mot de passe <span className="text-red-500">*</span></label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <span
                      className="absolute right-3 top-9 cursor-pointer text-gray-500"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </span>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}

                    <div className="flex flex-col space-y-2 mb-2">
                      <label className="font-medium text-gray-700">Creer en tant que :</label>
                      <div className="flex flex-wrap space-x-4 text-gray-700">
                        {/* Admin */}
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => handleChangeRole('admin', e.target.checked)}
                            className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <span>Admin</span>
                        </label>

                        {/* Staff */}
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isStaff}
                            onChange={(e) => handleChangeRole('staff', e.target.checked)}
                            className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <span>Staff</span>
                        </label>

                        {/* Propriétaire */}
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isOwner}
                            onChange={(e) => handleChangeRole('owner', e.target.checked)}
                            className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <span>Propriétaire</span>
                        </label>
                      </div>
                      {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Boutons navigation */}
            <div className="pl-4 flex justify-end">
              {steps === 0 ? (
                <button
                  type="button"
                  className="text-orange-400 flex items-center"
                  onClick={() => setSteps(steps + 1)}
                >
                  <span>Suivant</span>
                  <ArrowRightIcon className="text-[#ef9247] w-4 ml-1" />
                </button>
              ) : steps === 1 ? (
                <div className="flex items-center justify-between w-full">
                  <button
                    type="button"
                    className="text-orange-400 flex items-center"
                    onClick={() => setSteps(steps - 1)}
                  >
                    <ArrowLeftIcon className="text-[#ef9247] w-4 mr-1" />
                    <span>Précédent</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`${isLoading ? 'cursor-not-allowed' : 'hover:bg-[#edaa73]'
                      } bg-orange-400 text-white px-3 py-2 rounded-md shadow-sm  flex items-center`}
                  >
                    {isLoading && <Preloader className="w-[30px] h-[30px] mr-1" />}
                    <span>{isLoading ? 'Création en cours...' : 'Créer'}</span>
                  </button>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default CreateUser;