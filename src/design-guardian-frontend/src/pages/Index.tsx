import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Register } from '@/pages/Register';
import { Profile } from '@/pages/Profile';
import { Dashboard } from '@/pages/Dashboard';
import { DesignStudio } from '@/pages/DesignStudio';
import { Gallery } from '@/pages/Gallery';
import { Toaster } from '@/components/ui/sonner';
import { useSession } from "../context/sessionContext";

const Index = () => {

  const {user, isAuthenticated, updateUser, identity, backend} = useSession();
  const [currentPage, setCurrentPage] = useState((isAuthenticated && !user) ? 'register': "dashboard");


  const handleRegister = async (userData: { name: string; email?: string; avatar?: Uint8Array }) => {
    const newUser = await backend.register({name: userData.name, email: [userData.email], avatar: [userData.avatar]});
    if("ok" in newUser){
      updateUser(newUser.ok);
    };
    setCurrentPage('dashboard');
  };

  console.log(import.meta.env.VITE_CANISTER_ID)


  const handleLogout = () => {
    updateUser(null);
    // setCurrentPage('register');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return <Register onRegister={handleRegister} onNavigate={setCurrentPage} />;
      case 'profile':
        return user ? <Profile user={user} onUpdateUser={() => console.log("hola")} /> : null;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'design':
        return user ? <DesignStudio onNavigate={setCurrentPage} /> : null;
      case 'gallery':
        return <Gallery user={user} />;
      default:
        return user ? <Dashboard user={user} onNavigate={setCurrentPage} /> : <Register onRegister={handleRegister} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <Navbar 
          user={user} 
          onNavigate={setCurrentPage} 
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
      <Toaster />
    </div>
  );
};

export default Index;
