import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AUTHCONTEXT } from '../context/AuthProvider';
import { EyeSlashIcon, EyeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useFetch } from '../hooks/useFetch';
import Preloader from '../Components/Preloader';
import LogoutLayout from '../Layout/LogoutLayout';
import { ArrowRightIcon } from '@heroicons/react/16/solid';

import { useTranslation } from "react-i18next";

function SignUp() {
  document.title = "Créer votre compte";

  const { t } = useTranslation();

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

  // Fonction de validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = t("create_account_name_required");
      isValid = false;
    } else if (name.length < 3) {
      newErrors.name = t("create_account_name_min");
      isValid = false;
    }

    // if (!surname.trim()) {
    //   newErrors.surname = t("create_account_surname_required");
    //   isValid = false;
    // } else if (surname.length < 3) {
    //   newErrors.surname = t("create_account_surname_min");
    //   isValid = false;
    // }

    // if (!username.trim()) {
    //   newErrors.username = t("create_account_username_required");
    //   isValid = false;
    // } else if (username.length < 3) {
    //   newErrors.username = t("create_account_username_min");
    //   isValid = false;
    // }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!email.trim()) {
    //   newErrors.email = t("create_account_email_required");
    //   isValid = false;
    // } else if (!emailRegex.test(email)) {
    //   newErrors.email = t("create_account_email_invalid");
    //   isValid = false;
    // }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = t("create_account_phone_required");
      isValid = false;
    }

    // if (!gender) {
    //   newErrors.gender = t("create_account_gender_required");
    //   isValid = false;
    // }

    if (steps === 1) {
      // if (!files[0]) {
      //   newErrors.files = t("create_account_profile_pic_required");
      //   isValid = false;
      // }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (!password.trim()) {
        newErrors.password = t("create_account_password_required");
        isValid = false;
      } else if (!passwordRegex.test(password)) {
        newErrors.password = t("create_account_password_invalid");
        isValid = false;
      }

      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = t("create_account_confirm_password_required");
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = t("create_account_passwords_not_matching");
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
      toast.error(t("create_account_error"));
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
        imageUrl = res.result[0]?.url;
      }

      const data = {
        name,
        phone: phoneNumber,
        password,
      };

      if(surname) data.surname = surname
      if(email) data.email = email
      if(gender) data.gender = gender
      if(username) data.username = username
      if(imageUrl) data.photo = imageUrl

      const url = `${import.meta.env.VITE_EVENTS_API}/users/register`;
      const response = await handlePost(url, data, false);

      if (response?.success) {
        toast.success(t("create_account_created_success"), { duration: 5000 });
        setTimeout(() => {
          navigateToSignIn('/signin');
        }, 1500);
      }

    } catch (error) {
      toast.error(t("error_occured"), { duration: 5000 });
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
    <LogoutLayout>
      <div className="shadow-xl border rounded-xl sm:w-[400px] bg-white mt-4 sm:mt-0">
        <h1 className="mt-5 mx-4 font-bold text-2xl">{t("create_an_account")}</h1>

        <form className="pr-4 text-sm space-y-4" encType="multipart/form-data" onSubmit={handleFormCreateUser}>
          <div className="pl-4">
            {steps === 0 ? (
              <>
                {/* Nom */}
                <div className="mt-2 sm:flex sm:flex-col">
                  <input
                    type="text"
                    id="name"
                    placeholder={t("create_account_name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`outline-0 border-b-2 ${errors.name ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                      } w-full text-sm py-2`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Prénom */}
                <div className="mt-2 sm:flex sm:flex-col">
                  <input
                    type="text"
                    id="surname"
                    placeholder={t("create_account_surname")}
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className={`outline-0 border-b-2 ${errors.surname ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                      } w-full text-sm py-2`}
                  />
                  {errors.surname && <p className="text-xs text-red-500 mt-1">{errors.surname}</p>}
                </div>

                {/* Nom d'utilisateur */}
                {/* <div className="mt-2 sm:flex sm:flex-col">
                  <input
                    type="text"
                    id="username"
                    placeholder={t("create_account_username")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`outline-0 border-b-2 ${errors.username ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                      } w-full text-sm py-2`}
                  />
                  {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                </div> */}

                {/* Email */}
                <div className="mt-2 sm:flex sm:flex-col">
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`outline-0 border-b-2 ${errors.email ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                      } w-full text-sm py-2`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Téléphone */}
                <div className="mt-2 sm:flex sm:flex-col">
                  <input
                    type="number"
                    id="phone"
                    placeholder="Telephone *"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`outline-0 border-b-2 ${errors.phoneNumber ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                      } w-full text-sm py-2`}
                  />
                  {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
                </div>
              </>
            ) : steps === 1 ? (
              <>
                {/* Sexe */}
                <div className="flex flex-col mt-2">
                  <div className="mb-1">{t("create_account_gender")} :</div>
                  <div className="space-x-2 flex flex-row text-gray-500">
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="MALE"
                        checked={gender === 'MALE'}
                        onChange={handleChangeGender}
                        className="mr-1"
                      />
                      <span>{t("create_account_gender_man")}</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="FEMALE"
                        checked={gender === 'FEMALE'}
                        onChange={handleChangeGender}
                        className="ml-1"
                      />
                      <span>{t("create_account_gender_women")}</span>
                    </label>
                  </div>
                  {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                </div>

                {/* Photo de profil */}
                <div className="mt-2 sm:flex sm:flex-col">
                  <label htmlFor="file" className="font-medium">{t("create_account_profile_pic")} :</label>
                  <input
                    type="file"
                    id="file"
                    className={`outline-0 border-b-2 ${errors.files ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                      } w-full text-sm py-2`}
                    onChange={handleSubmitFiles}
                  />
                  {errors.files && <p className="text-xs text-red-500 mt-1">{errors.files}</p>}
                </div>

                {/* Mot de passe */}
                <div className="relative mt-2 sm:flex sm:flex-col">
                  <div className="w-full flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t("password_placeholder")}
                      className={`outline-0 border-b-2 ${errors.password ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                        } w-full text-sm py-2 pr-8`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-0 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                    </span>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Confirmer mot de passe */}
                <div className="relative mt-2 sm:flex sm:flex-col">
                  <div className="w-full flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t("create_account_confirm_password")}
                      className={`outline-0 border-b-2 ${errors.confirmPassword ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                        } w-full text-sm py-2 pr-8`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      className="absolute right-0 cursor-pointer"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                    </span>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            ) : null}
          </div>

          {/* Boutons navigation */}
          <div className="pl-4 flex justify-end">
            {steps === 0 ? (
              <button
                type="button"
                className="text-[#ef9247] text-xs flex items-center"
                onClick={() => setSteps(steps + 1)}
              >
                <span>{t("create_account_next")}</span>
                <ArrowRightIcon className="text-[#ef9247] w-4 ml-1" />
              </button>
            ) : steps === 1 ? (
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  className="text-[#ef9247] text-xs flex items-center"
                  onClick={() => setSteps(steps - 1)}
                >
                  <ArrowLeftIcon className="text-[#ef9247] w-4 mr-1" />
                  <span>{t("create_account_previous")}</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${isLoading ? 'bg-[#ef9247] cursor-not-allowed' : 'hover:bg-[#edaa73]'
                    } bg-[#ef9247] text-white px-3 py-2 rounded-full shadow-sm text-xs flex items-center`}
                >
                  {isLoading && <Preloader className="w-[20px] h-[20px] mr-1" />}
                  {/* <span>{isLoading ? 'Création en cours...' : 'Créer mon compte'}</span> */}
                  <span>{isLoading ? (t("create_acount") + '...') : t("create_acount")} </span>
                </button>
              </div>
            ) : null}
          </div>
        </form>

        <div className="text-xs m-3 text-center">
          <Link to="/signin" className="text-[#104e45]">
            {t("create_account_has_account")}
          </Link>
        </div>
      </div>
      {/* <Toaster /> */}
    </LogoutLayout>
  );
}

export default SignUp;