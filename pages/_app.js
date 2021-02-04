import PropTypes from 'prop-types';
// import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { I18nProvider } from '../context/i18n';
import { SiteProvider } from '../context/site';
import { UserProvider } from '../context/user';

import 'styles/globals.css';
import 'components/AddonBadges/styles.scss';

function MyApp({ Component, pageProps, siteData }) {
  // Here's a way to get config values into _app.js
  // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

  // We can get params from the querystring
  const router = useRouter();
  const { clientApp, lang } = router.query;

  console.log('----- siteData: ', siteData);

  // We can add page props to pass into every component.
  const props = { ...pageProps, clientApp, lang };

  return (
    <SiteProvider>
      <UserProvider>
        <I18nProvider lang={lang}>
          <Component {...props} />
        </I18nProvider>
      </UserProvider>
    </SiteProvider>
  );
}

MyApp.propTypes = {
  pageProps: PropTypes.shape({}),
  Component: PropTypes.elementType,
};

MyApp.getServerSideProps = async () => {
  const res = await fetch(`	https://addons-dev.allizom.org/api/v5/site/`);
  const statusCode = res.status > 200 ? res.status : false;
  const data = await res.json();

  // Pass data to the page via props
  return { props: { siteData: data, statusCode } };
};

export default MyApp;
