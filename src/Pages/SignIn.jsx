import React, { useState, useContext, useEffect, useRef } from 'react';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import toast, { Toaster } from 'react-hot-toast';
import Preloader from '../Components/Preloader';
import LogoutLayout from '../Layout/LogoutLayout';
import { AUTHCONTEXT } from '../context/AuthProvider';

import { useTranslation } from "react-i18next";

export default function SignIn() {
  document.title = 'Se connecter';

  const { t } = useTranslation();

  const { setIsAuth, setUserData } = useContext(AUTHCONTEXT);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const userNameRef = useRef(null);

  const navigateToHome = useNavigate();
  const { handlePost } = useFetch();

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = t("login_number_required");
      isValid = false;
    }

    if (!password) {
      newErrors.password = t("create_account_password_required");
      isValid = false;
    } 
    // else if (password.length < 6) {
    //   newErrors.password = 'Le mot de passe doit faire au moins 6 caractères';
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitFormLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("create_account_error"), { duration: 3000 });
      return;
    }

    const url = `${import.meta.env.VITE_EVENTS_API}/users/login`;

    setIsLoading(true);
    try {
      const data = { username, password };
      const response = await handlePost(url, data, false);

      if (response.success) {

        console.log("response", response);


        const token = response?.result?.token;
        const userData = response?.result?.current_user;

        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));

        setIsAuth(token);
        setUserData(userData);

        navigateToHome('/');
      } else {
        toast.error(response.message, { duration: 5000 });
        return;
      }


    } catch (error) {
      console.error(error);
      toast.error(t("create_account_error_occured"), { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userNameRef.current.focus();

    return () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }, []);

  return (
    <LogoutLayout>
      <div className="shadow-xl border rounded-xl sm:w-[400px] min-h-[340px] max-h-[340px] mt-4 bg-white">
        <h1 className="mt-5 mx-4 font-bold text-2xl">{t("login_text")}</h1>

        <form className="mt-10 mx-9 text-sm flex flex-col space-y-4" onSubmit={handleSubmitFormLogin}>
          {/* Nom d'utilisateur */}
          <div className="mt-2">
            <input
              type="text"
              id="username"
              ref={userNameRef}
              placeholder={t("login")}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
              }}
              className={`outline-0 border-b-2 w-full text-sm py-2 ${errors.username ? 'border-red-500' : 'focus:border-[#ef9247] border-primary'
                }`}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder={t("password_placeholder")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              className={`outline-0 border-b-2 w-full text-sm py-2 pr-4 ${errors.password ? 'border-red-500' : 'focus:border-[#ef9247] border-[#104e45]'
                }`}
            />
            <span
              className="absolute cursor-pointer top-[40%] right-0"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-500" />
              )}
            </span>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${isLoading ? 'bg-[#edaa73] cursor-not-allowed' : 'hover:bg-[#edaa73] bg-[#ef9247]'
              } text-white px-3 py-2 mt-5 rounded-full shadow-sm text-xs flex space-x-4 items-center`}
          >
            {isLoading && <Preloader className="w-[20px] sm:w-[25px] sm:h-[25px] h-[20px]" />}
            {/* <span>{isLoading ? 'Connexion en cours...' : 'Se connecter'} </span> */}
            <span>{isLoading ? (t("login_text") + '...') : t("login_text")} </span>
            {/* {t("login_text")} */}
          </button>
        </form>

        <p className="text-xs ml-8 m-3">
          {t("no_account")}{' '}
          <Link to="/signup" className="text-[#104e45]">
            {t("create_an_account")}  
          </Link>
        </p>
      </div>
    </LogoutLayout>
  );
}