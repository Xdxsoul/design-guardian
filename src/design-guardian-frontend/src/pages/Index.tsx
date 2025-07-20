import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Register } from '@/pages/Register';
import { Profile } from '@/pages/Profile';
import { Dashboard } from '@/pages/Dashboard';
import { DesignStudio } from '@/pages/DesignStudio';
import { Gallery } from '@/pages/Gallery';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('register');
  const [user, setUser] = useState<{ name: string; email?: string } | null>(null);

  const handleRegister = (userData: { name: string; email?: string }) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleUpdateUser = (userData: { name: string; email?: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('register');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return <Register onRegister={handleRegister} onNavigate={setCurrentPage} />;
      case 'profile':
        return user ? <Profile user={user} onUpdateUser={handleUpdateUser} /> : null;
      case 'dashboard':
        return user ? <Dashboard user={user} onNavigate={setCurrentPage} /> : null;
      case 'design':
        return user ? <DesignStudio onNavigate={setCurrentPage} /> : null;
      case 'gallery':
        return user ? <Gallery user={user} /> : null;
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
