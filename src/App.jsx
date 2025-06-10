import { useState } from 'react'
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

console.log(process.env)
console.log("All env vars:", import.meta.env);

function App() {
  return (
    <Router>
      <Routes>
        {/* Not protected routes */}
        <Route path='/signin' element={<SignIn />} exact/>
        <Route path='/signup' element={<SignUp />} exact/>
        <Route path='/about-us' element={<AboutUs />}/>
        <Route path='/' element={<HomePage />}/>
        <Route path='*' element={<HomePage />}/>

        {/* protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path='/profile' element={<div>profile</div>}/>


          {/* Event Routes */}
          <Route path='/events' >
            <Route path='' element={<Events />} />
            <Route path=':id' element={<Event/>}/>
            <Route path='create' element={<CreateEvent />}/>
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
            <Route path='update' />
          </Route>

          {/* Room */}
          <Route path="room/:id" exact element={<Room />}/>

        </Route>

      </Routes>
    </Router>
  )
}

export default App
