import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export function GlobalProvider({ children, initialSiteData }) {
  const router = useRouter();
  const [clientApp, setClientApp] = useState(router.query.clientApp);
  const [lang, setLang] = useState(router.query.lang);
  const [siteData, setSiteData] = useState();
  const [dismissedNotices, setDismissedNotices] = useState([]);

  const state = {
    clientApp,
    dismissedNotices,
    lang,
    setClientApp,
    setDismissedNotices,
    setLang,
    siteData: initialSiteData,
  };

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
}

export function useGlobalState() {
  const state = useContext(GlobalContext);

  if (state === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }

  return state;
}
