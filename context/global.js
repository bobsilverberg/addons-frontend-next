import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

import { VIEW_CONTEXT_EXPLORE } from '../constants';

const GlobalContext = createContext();

export function GlobalProvider({ children, initialSiteData }) {
  const router = useRouter();
  const [clientApp, setClientApp] = useState(router.query.clientApp);
  const [dismissedNotices, setDismissedNotices] = useState([]);
  const [lang, setLang] = useState(router.query.lang);
  const [numberOfAddonsByAuthors, setNumberOfAddonsByAuthors] = useState();
  const [siteData, setSiteData] = useState();
  const [viewContext, setViewContext] = useState();

  const state = {
    clientApp,
    setClientApp,
    dismissedNotices,
    setDismissedNotices,
    lang,
    setLang,
    numberOfAddonsByAuthors,
    setNumberOfAddonsByAuthors,
    siteData: initialSiteData,
    viewContext: VIEW_CONTEXT_EXPLORE,
    setViewContext,
  };

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
}

GlobalProvider.propTypes = {
  children: PropTypes.node,
  initialSiteData: PropTypes.object,
};

export function useGlobalState() {
  const state = useContext(GlobalContext);

  if (state === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }

  return state;
}
