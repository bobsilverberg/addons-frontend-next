import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const router = useRouter();
  const [clientApp, setClientApp] = useState(router.query.clientApp);
  const [lang, setLang] = useState(router.query.lang);

  const state = {
    clientApp,
    lang,
    setClientApp,
    setLang,
  };

  return (
    <GlobalProvider.Provider value={state}>{children}</GlobalProvider.Provider>
  );
}

export function useGlobalState() {
  const state = useContext(GlobalContext);

  if (state === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }

  return state;
}
