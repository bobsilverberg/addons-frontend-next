import { useRouter } from 'next/router';
import { createContext, useContext, useState } from 'react';

const SiteContext = createContext();

export function SiteProvider({ children }) {
  const router = useRouter();
  const [clientApp, setClientApp] = useState(router.query.clientApp);
  const [lang, setLang] = useState(router.query.lang);
  const [loadedPageIsAnonymous, setLoadedPageIsAnonymous] = useState(false);
  const [notice, setNotice] = useState(null);
  const [readOnly, setReadOnly] = useState(false);

  const state = {
    clientApp,
    lang,
    loadedPageIsAnonymous,
    notice,
    readOnly,
    setClientApp,
    setLang,
    setLoadedPageIsAnonymous,
    setNotice,
    setReadOnly,
  };

  return <SiteContext.Provider value={state}>{children}</SiteContext.Provider>;
}

export function useSiteState() {
  const state = useContext(SiteContext);

  if (state === undefined) {
    throw new Error('useSiteState must be used within a SiteProvider');
  }

  return state;
}
