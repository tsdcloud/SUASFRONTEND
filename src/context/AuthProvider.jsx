import { createContext, useState, useEffect } from 'react'

export const AUTHCONTEXT = createContext();

function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {

  }, []);

  return (
    <AUTHCONTEXT.Provider value={{ userData, setUserData, isAuth, setIsAuth }}>
      {children}
    </AUTHCONTEXT.Provider>
  )
}

export default AuthProvider