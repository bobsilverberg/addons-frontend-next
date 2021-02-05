import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const SiteContext = createContext();

// export function SiteProvider({ children }) {
//   const router = useRouter();
//   const [clientApp, setClientApp] = useState(router.query.clientApp);
//   const [lang, setLang] = useState(router.query.lang);
//   const [loadedPageIsAnonymous, setLoadedPageIsAnonymous] = useState(false);
//   const [notice, setNotice] = useState(null);
//   const [readOnly, setReadOnly] = useState(false);

//   const state = {
//     clientApp,
//     lang,
//     loadedPageIsAnonymous,
//     notice,
//     readOnly,
//     setClientApp,
//     setLang,
//     setLoadedPageIsAnonymous,
//     setNotice,
//     setReadOnly,
//   };
//
//   return <SiteContext.Provider value={state}>{children}</SiteContext.Provider>;
// }

const __SITECONTEXT = {
  loadedData: undefined,
};

const _fetchData = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return Promise.resolve(Object.keys(data).length > 0 ? data : null); // Return null if data empty
  } catch (error) {
    console.log('CLIENT_FETCH_ERROR', url, error);
    return Promise.resolve(null);
  }
};

// Universal method (client + server)
export const getSiteData = async () => {
  console.log('---- in getSiteData, fetching...');
  const siteData = await _fetchData(
    'https://addons-dev.allizom.org/api/v5/site/',
  );
  console.log('---- in getSiteData, siteData: ', siteData);
  return siteData;
  };

// Internal hook for getting site data from the api.
const _useSiteHook = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const _getSiteData = async () => {
      try {
        const siteData = __SITECONTEXT.loadedData;
        if (siteData !== undefined) {
          return;
}
        const newSiteData = await getSiteData();
        setData(newSiteData);
        setLoading(false);
      } catch (error) {
        console.log('CLIENT_USE_SESSION_ERROR', error);
      }
    };

    _getSiteData();
  });
  return [data, loading];
};

export function useSiteState(siteData) {
  const state = useContext(SiteContext);

  console.log('---- in useSiteState hook, state: ', state);
  if (state === undefined) {
    return _useSiteHook(siteData);
  }

  return state;
}

// Provider to wrap the app in to make session data available globally
export const Provider = ({ children, siteData }) => {
  return (
    <SiteContext.Provider value={useSiteState(siteData)}>
      {children}
    </SiteContext.Provider>
  );
};

export default {
  getSiteData,
  useSiteState,
  Provider,
};
