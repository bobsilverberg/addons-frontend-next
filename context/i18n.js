import { createContext, useContext, useState } from 'react';

import { makeI18n } from '../i18n/utils_next';

const I18nContext = createContext();

// TODO: Passing {} should make it work with the default lang. We need to figure
// out how to get the client/server difference working for this.
//
// TODO: Not sure how to get access to lang here. Just set it to en-US for now.

export function I18nProvider({ children, lang }) {
  const [i18n, setI18n] = useState(makeI18n({}, lang));

  const setLang = (langToSet = lang) => {
    setI18n(makeI18n({}, langToSet));
  };

  const state = {
    i18n,
    setLang,
  };

  return <I18nContext.Provider value={state}>{children}</I18nContext.Provider>;
}

export function useI18nState() {
  const state = useContext(I18nContext);

  if (state === undefined) {
    throw new Error('useI18nState must be used within a I18nProvider');
  }

  return state;
}
