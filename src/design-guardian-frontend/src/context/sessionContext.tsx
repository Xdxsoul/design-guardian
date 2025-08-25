import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { HttpAgent, Identity, AnonymousIdentity, ActorSubclass } from '@dfinity/agent';
import { User, _SERVICE } from '../declarations/main/main.did';
import { createActor } from "../declarations/main";
import { AuthClient } from '@dfinity/auth-client';
import ModalProviderSelect from '../components/auth/ModalProviderSelect';


const canisterId = import.meta.env.VITE_CANISTER_ID_MAIN as string
console.log({canisteridMain: canisterId})

const host = import.meta.env.VITE_DFX_NETWORK === "local" ? "http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai" : "https://identity.ic0.app";
const providerUrl = import.meta.env.VITE_DFX_NETWORK === "local" ? "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943" : "https://identity.ic0.app";
type SessionContextType = {
  user: User | null;
  identity: Identity;
  isAuthenticated: boolean;
  backend: ActorSubclass<_SERVICE>;
  login: () => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
};

const defaultSessionContext: SessionContextType = {
  user: null,
  identity: new AnonymousIdentity(),
  isAuthenticated: false,
  backend: createActor(canisterId, {
    agentOptions: { identity: new AnonymousIdentity(), host }
  }),
  login: () => { },
  logout: async () => { },
  updateUser: () => { },
};

export const SessionContext = createContext<SessionContextType>(defaultSessionContext);

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mintingStatus, setMintingStatus] = useState<[bigint, bigint][]>([]);
  // const [rewards, setRewards] = useState(defaultSessionContext.rewards);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity>(new AnonymousIdentity());
  const [backend, setBackend] = useState<ActorSubclass<_SERVICE>>(
    createActor(canisterId, {
      agentOptions: { identity: new AnonymousIdentity(), host }
    })
  );
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const setupAgent = async () => {
      // console.log("Principal actual:", identity.getPrincipal().toText());
      const agent = new HttpAgent({
        identity,
        host,
      });
      if (import.meta.env.VITE_DFX_NETWORK === "local") {
        await agent.fetchRootKey();
      }
      setBackend(createActor(canisterId, { agent }));
    };
    setupAgent();
  }, [ identity]);


  useEffect(() => {

    const getUser = async () => {


      const result = await backend.logIn()
      if (result.length > 0) {
        setUser(result[0]);
        setIsAuthenticated(true);
      }
    };
  
    if (!identity.getPrincipal().isAnonymous()) {
    getUser();
  };
  }, [ backend, identity]);
  

  async function init() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    setIdentity(identity);

    if (!identity.getPrincipal().isAnonymous()) {
      setIsAuthenticated(true);
    };
  };

  const updateUser = (user: User) => {
    setUser(user);
  };

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const login = async (providerUrl: string) => {
    const authClient = await AuthClient.create();
    await authClient.login({
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      identityProvider: providerUrl,
      onSuccess: () => {
        const identity = authClient.getIdentity();
        // console.log("Login success. Principal:", identity.getPrincipal().toText());
        setIdentity(identity);
        setIsAuthenticated(true);
      },
      onError: (err) => console.error("Error al iniciar sesión:", err),
    });
  };

  const handleProviderSelection = async (providerUrl: string) => {
    setIsModalOpen(false);      // Cierra el modal
    await login(providerUrl);   // Llama a `login` con el proveedor seleccionado
  };

  const logout = async () => {
    setUser(null);
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIdentity(new AnonymousIdentity());
    setIsAuthenticated(false);
    setBackend(
      createActor(canisterId, {
        agentOptions: { identity: new AnonymousIdentity(), host }
      })
    );
  };

  return (
    <SessionContext.Provider value={
      { 
        user, identity, backend, isAuthenticated,
        login: handleLoginClick, logout, updateUser }
      }
    >
      {children}
      <ModalProviderSelect
        internetIdentityUrl= {providerUrl}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProvider={handleProviderSelection}
      />
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};