import { createContext, useContext, useState } from 'react';

const SiteContext = createContext();

export function SiteProvider({ children }) {
  const [loadedPageIsAnonymous, setLoadedPageIsAnonymous] = useState(false);
  const [notice, setNotice] = useState(null);
  const [readOnly, setReadOnly] = useState(false);

  const state = {
    loadedPageIsAnonymous,
    notice,
    readOnly,
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
