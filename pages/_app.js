import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { makeI18n } from 'i18n/utils_next';
import 'styles/globals.css';

function MyApp({ Component, pageProps }) {
  const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
  const aProp = 'Hello';
  pageProps.aProp = aProp;
  const router = useRouter();
  const { app, lang } = router.query;
  console.log('----- In MyApp, app: ', app);
  console.log('----- In MyApp, lang: ', lang);

  // TODO: Passing {} should make it work with the default lang. We need to figure
  // out how to get the client/server difference working for this.
  const i18n = makeI18n({}, lang);
  console.log('----- In MyApp, i18n: ', i18n);
  pageProps.i18n = i18n;

  return <Component {...pageProps} />;
}

export default MyApp;
