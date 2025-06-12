import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoutes from './Utils/ProtectedRoutes'
import HomePage from './Pages/HomePage'
import AboutUs from './Pages/AboutUs'
import SignIn from './Pages/SignIn'
import DashboardLayout from './Layout/DashboardLayout'
import Events from './Pages/Events'
import Event from './Pages/Event'
import Profile from './Pages/Profile'
import Workshops from './Pages/Workshops'
import Workshop from './Pages/Workshop'
import Room from './Pages/Room'
import SignUp from './Pages/SignUp'
import CreateEvent from './Pages/CreateEvent'
import CreateWorkshop from './Pages/CreateWorkshop'
import Category from './Pages/Category'
import CreateCategory from './Pages/CreateCategory'
import Users from './Pages/Users'
import CreateUser from './Pages/CreateUser'
import Permissions from './Pages/Permissions'
import UserRole from './Pages/UserRole'
import ParticipantRole from './Pages/ParticipantRole'
import Header from './Components/Header'

import { useTranslation } from "react-i18next";
import EventRole from './Pages/EventRole'

function App() {
  const { i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  // Charger dynamiquement les fichiers de traduction
  useEffect(() => {
    const loadResources = async () => {
      try {
        const lang = i18n.language;
        const translation = await import(`./locales/${lang}.json`);
        i18n.addResourceBundle(lang, "translation", translation.default, true, true);
      } catch (error) {
        console.error("Erreur de chargement des traductions", error);
      } finally {
        console.log("language charged, currentLang:", i18n.language);
        setLoading(false)
        // window.location.reload();
      }
    };

    loadResources();
  }, []);

  const changeLanguage = async (lng) => {

    localStorage.setItem("language", lng);

    if (i18n.language === lng) return

    setLoading(true);
    try {
      const translations = await import(`./locales/${lng}.json`);
      i18n.addResourceBundle(lng, "translation", translations.default, true, true);
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error("Erreur de chargement des traductions", error);
    } finally {
      setLoading(false);
      // window.location.reload();
    }
  };


  return (
    <Router>
      <Header switchLanguage={changeLanguage} />
      <Routes>
        {/* Not protected routes */}
        <Route path='/signin' element={<SignIn />} exact />
        <Route path='/signup' element={<SignUp />} exact />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/' element={<HomePage />} />
        <Route path='*' element={<HomePage />} />

        {/* protected routes */}
        <Route element={<ProtectedRoutes />}>
          {/* <Route path='/profile' element={<div>profile</div>} /> */}


          {/* Event Routes */}
          <Route path='/events' >
            <Route path='' element={<Events />} />
            <Route path=':id' element={<Event />} />
            {/* <Route path='create' element={<CreateEvent/>}/> */}
          </Route>

          {/* Categories Routes */}
          <Route path='/categories' >
            <Route path='' element={<Category />} />
          </Route>

          {/* Users Routes */}
          <Route path='/users' >
            <Route path='' element={<Users />} />
          </Route>

          {/* Permission Routes */}
          <Route path='/permissions' >
            <Route path='' element={<Permissions />} />
          </Route>

          {/* userRole Routes */}
          <Route path='/userRole' >
            <Route path='' element={<UserRole />} />
          </Route>

          {/* eventRole Routes */}
          <Route path='/eventRole' >
            <Route path='' element={<EventRole />} />
          </Route>

          {/* participant Routes */}
          <Route path='/participantRole' >
            <Route path='' element={<ParticipantRole />} />
          </Route>

          {/* Workshop routes */}
          <Route path='/workshops'>
            <Route path='' element={<Events />} exact />
            <Route path=':id' element={<Workshop />} />
            <Route path='create/:id' element={<CreateWorkshop />} />
            <Route path='register' element={<div>Workshop registration</div>} />
          </Route>

          {/* profile routes */}
          <Route path='/profile'>
            <Route path='' element={<Profile />} exact />
            {/* <Route path='update' /> */}
          </Route>

          {/* Room */}
          <Route path="room/:id" exact element={<Room />} />

        </Route>

      </Routes>
    </Router>
  )
}

export default App
