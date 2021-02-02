import PropTypes from 'prop-types';
// import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { I18nProvider } from '../context/i18n';

import 'styles/globals.css';
import 'components/AddonBadges/styles.scss';

function MyApp({ Component, pageProps }) {
  // Here's a way to get config values into _app.js
  // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

  // We can get params from the querystring
  const router = useRouter();
  const { app, lang } = router.query;

  // We can add page props to pass into every component.
  const props = { ...pageProps, app, lang };

  return (
    <I18nProvider lang={lang}>
      <Component {...props} />
    </I18nProvider>
  );
}

MyApp.propTypes = {
  pageProps: PropTypes.shape({}),
  Component: PropTypes.elementType,
};

export default MyApp;
