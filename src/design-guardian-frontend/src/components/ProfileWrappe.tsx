// src/components/ProfileWrapper.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../pages/Profile'; // Ajusta la ruta a tu componente Profile
// Suponiendo que tienes un hook o contexto para obtener el usuario actual
import { useSession } from '../context/sessionContext'; // O la ruta a tu hook de autenticación

const ProfileWrapper: React.FC = () => {
  const { user } = useSession()
  const navigate = useNavigate();
  if (!user) {
    navigate('/'); 
    return null;
  }
  return <Profile profile={user} />;
};

export default ProfileWrapper;