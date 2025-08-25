import { useEffect, useState } from 'react';
import { useSession } from '../context/sessionContext';
import LoginButton from './auth/LoginButton';
import LogoutButton from './auth/LogoutButton';
import MenuUser from './MenuUser';
import RegisterButton from './register/RegisterButton';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { HomeIcon, BellIcon, MetricsIcon, MessageIcon } from "./Icons";
import logo from '../assets/logo.png'

const Header = () => {
  const { user, updateUser, isAuthenticated, identity, backend } = useSession();
  const [name, setName] = useState("");
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [email, setEmail] = useState<string>("");
   const [emailError, setEmailError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<Uint8Array | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModalRegister(false);
      if (location.pathname === "/dashboard") {
        navigate("/")
      }
      return;
    }
    const timeout = setTimeout(() => {
      if (!user) {
        setShowModalRegister(true);
        navigate("/")
      };
    }, 4000);

    if (user) { setShowModalRegister(false) }

    return () => clearTimeout(timeout);
  }, [user, isAuthenticated, navigate, location.pathname]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Opcional: limpiar el error mientras el usuario escribe
    if (emailError && validateEmail(newEmail)) {
      setEmailError(null);
    }
  };

  const validateEmail = (email: string): boolean => {
    // Expresión regular para validar emails.
    // Esta es una regex robusta para la mayoría de los casos.
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };



  const handleRegister = async () => {
 
    if (name.length < 3 || name.length > 30) { return }

    if (email === null || email === '') {
      setEmail(null);
      setEmailError(null); 
    }
    else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email format (e.g. user@domain.com).');
      return; 
    }
    else {
      setEmailError(null);
    }

    const registerResult = await backend.register({
      name: name.trim(),
      email: email === null ? [] : [email.trim()],
      avatar: avatar === null ? [] : [avatar],
    });
    console.log("Register Result:", registerResult);

    if ("ok" in registerResult) {
      setShowModalRegister(false);
      updateUser(registerResult.ok)
      setName("");
      setEmail(null)
    } else {
      console.error("Registration failed:", registerResult);
    }
  }


  return (
    <>
      <header className="w-full flex justify-between items-center p-1 bg-gradient-to-t from-[#00000000] to-blue-800 pb-4 text-white select-none h-[65px]">
        <div className='flex items-center z-10'>
          <img src={logo} alt="" className='w-[250px]  ml-[15px] mt-[350px] hover:scale-110 transition-transform duration-300 bg-[#33113344] rounded-full' />
        </div>



        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1
            onClick={() => navigate("./")}
            className="hidden sm:block text-[40px] font-bold text-[#ffccff] font-brookshire
              cursor-pointer hover:scale-110 transition-transform duration-300"
            >
            Design Guardian
          </h1>
          <HomeIcon
            onClick={() => navigate("./")}
            className="block sm:hidden text-2xl cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end w-[200px]">

          {!isAuthenticated ? (
            <LoginButton />
          ) : user ? (
            <>
              <div className='flex items-center'>
              </div>
              <MenuUser />
            </>
          ) : (
            <>

              <RegisterButton
                onClick={() => setShowModalRegister(!showModalRegister)}
                className='absolute top-[60px] left-1/2 transform -translate-x-1/2 mt-2 z-10'
              />
              <LogoutButton />
            </>
          )}
        </div>

        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-1000 
          ${showModalRegister ? 'opacity-95 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setShowModalRegister(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white text-black p-3 rounded-[40px] transform transition-all duration-1000
              ${showModalRegister ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          >
            <h2 className="font-semibold text-lg mb-2 text-center">Register User</h2>
            <p className="text-sm mb-2">Principal ID: {identity.getPrincipal().toString()}</p>
            <input
              type="text"
              required
              maxLength={35}
              placeholder="Name"
              value={name}
              onChange={handleChangeName}
              className="border p-2 w-full mb-2 rounded-full text-center"
            />

            <input
              type="email"
              maxLength={35}
              placeholder="email"
              value={email}
              onChange={handleChangeEmail}
              className={`border p-2 w-full mb-2 rounded-full text-center 
                ${emailError ? 'border-red-500 text-red-500 placeholder-red-300' : ''}`
              }
              
            />


            <div className="text-sm flex items-center space-x-2">
              {name.length === 0 ? (
                <span className="text-gray-500">Must be between 3 and 30 characters</span>
              ) : name.length < 3 || name.length > 30 ? (
                <>
                  <span className="text-red-600">❌ Must be between 3 and 30 characters</span>
                </>
              ) : (
                <>
                  <span className="text-green-600">✅ Nombre válido</span>
                </>
              )}
            </div>
            

            <div className="flex justify-between px-[30px]">
              <button
                style={{ backgroundColor: "#555555" }}
                className="button w-[110px]"
                onClick={() => setShowModalRegister(false)}
              >
                Close
              </button>
              <button
                className="button w-[110px]"
                onClick={handleRegister}
              >
                Done
              </button>
            </div>
          </div>
        </div>

      </header>
    </>
  );
};

export default Header;
