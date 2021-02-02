import React from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { I18nProvider } from '../context/i18n';

import 'styles/globals.css';
import 'components/AddonBadges/styles.scss';

function MyApp({ Component, pageProps }) {
  const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
  const aProp = 'Hello';
  pageProps.aProp = aProp;
  const router = useRouter();
  const { app, lang } = router.query;
  console.log('----- In MyApp, app: ', app);
  console.log('----- In MyApp, lang: ', lang);

  return (
    <I18nProvider lang={lang}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}

export default MyApp;
