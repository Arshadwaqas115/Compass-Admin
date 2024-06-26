"use client";
import { createContext, useState, useEffect } from 'react';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter()

  useEffect(() => {
    
   
      const storedUser = localStorage.getItem('user');
      console.log(storedUser)
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        router.replace(paths.dashboard.agents);
      } else {
        router.replace(paths.auth.signIn);
      }
   
  }, [router]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};
