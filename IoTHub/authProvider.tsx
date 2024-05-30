import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './configFirebase';
import { User, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext<{ user: User | null }>({ user: null });


export const AuthProvider = ({children}:{children:React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // Return null or a loading spinner/screen while loading
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
