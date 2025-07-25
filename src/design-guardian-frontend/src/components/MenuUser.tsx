import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/sessionContext";

const MenuUser = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [referralCode, setReferralCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [copy, setCopy] = useState("");

  const navigate = useNavigate();
  const { logout, user, backend } = useSession();


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="m-[2px] z-70">
      <div
        className="relative text-black mr-[10px] h-[35px] w-[35px] bg-gradient-to-b from-[#ffffff] to-[#2222aa] rounded-full flex items-center justify-center cursor-pointer "
        ref={menuRef}
        onClick={() => { setShowMenu(!showMenu) }}
      >
        <span className="select-none">{user?.name.split(" ").slice(0, 2).map(n => n[0].toUpperCase()).join(" ")}</span>
      </div>

      {showCode && (
        <>
          <div
            className="fixed top-0 left-0 bg-black/90 w-full h-full "
            onClick={() => setShowCode(false)}
          />
          <div className=" p-[1px] bg-green-500 rounded-4xl fixed top-[200px] left-1/2 transform -translate-x-1/2 shadow-[0px_0px_30px_rgba(85,_85,_85,_0.8)]">
            <div
              className="
              bg-gray-900 hover:bg-gray-800 h-25 w-80 text-center text-green-400 text-[25px]
              rounded-t-4xl flex flex-col items-center justify-center cursor-pointer mb-[1px]"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(referralCode); // Copia al portapapeles
                  setCopy("Code");
                  setTimeout(() => {
                    setShowCode(false);
                    setCopy("");
                  }, 800);
                } catch (error) {
                  console.error("Error al copiar:", error);
                  // Opcional: Mostrar un mensaje de error al usuario
                }
              }}
            >
              {referralCode}
              <p className="text-[14px]">{copy === "Code" ?  "Copied!" : "Copy code"}</p>
            </div>

            <div
              className="
              bg-gray-900 hover:bg-gray-800 h-25 w-80 text-center text-green-400 text-[18px]
              rounded-b-4xl flex flex-col items-center justify-center cursor-pointer"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`dnr7p-waaaa-aaaak-quhaq-cai.icp0.io/?ref=${referralCode}`); // Copia al portapapeles
                  setCopy("Link");
                  setTimeout(() => {
                    setShowCode(false);
                    setCopy("");
                  }, 800);
                } catch (error) {
                  console.error("Error al copiar:", error);
                  // Opcional: Mostrar un mensaje de error al usuario
                }
              }}
            >
              cryptocritters.com/?ref={referralCode}
              <p className="text-[14px] mt-3">{copy === "Link" ? "Copied!" : "Copy link"}</p>
            </div>
          </div>
        </>
      )}

      <div
        className={`absolute top-[5px] right-[2px] w-48 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg shadow-xl transition-transform duration-300 origin-top transform
          ${showMenu ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
      >
        <div onMouseDown={() => navigate("/profile")} className="flex items-center justify-between py-1 hover:bg-gray-500 hover:rounded-t-lg">
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">Profile {user?.name.split(" ")[0]}</button>
        </div>



        <hr className=" border-gray-500" />

        <div onMouseDown={logout}>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-500 hover:rounded-b-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6  text-white" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" focusable="false" aria-hidden="true" ><path fill="currentColor" d="M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1.7.7 4.4-4.4L11.8 7l-.7.7 3.1 3.1H3v1h11.3l-3.2 3.3z"></path></svg>
            <button className="block w-full text-left text-white px-4 py-2 hover:bg-gray-500">Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuUser;
