import PropTypes from 'prop-types';
// import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { GlobalProvider } from '../context/global';
import { I18nProvider } from '../context/i18n';
import { Provider as SiteProvider, getSiteData } from '../context/site';
import { UserProvider } from '../context/user';

import 'styles/globals.css';
import 'components/AddonBadges/styles.scss';

function MyApp({ Component, pageProps, siteData }) {
  // Here's a way to get config values into _app.js
  // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

  // We can get params from the querystring
  const router = useRouter();
  const { lang } = router.query;

  console.log('----- siteData: ', siteData);

  // We can add page props to pass into every component.
  const props = { ...pageProps, siteData };

  return (
    <GlobalProvider>
      <SiteProvider siteData={siteData}>
        <UserProvider>
          <I18nProvider lang={lang}>
            <Component {...props} />
          </I18nProvider>
        </UserProvider>
      </SiteProvider>
    </GlobalProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.shape({}),
  siteData: PropTypes.object,
};

MyApp.getInitialProps = async (ctx) => {
  const siteData = await getSiteData();
  console.log('---- in MyApp.getInitialProps, siteData: ', siteData);
  // console.log('---- in MyApp.getInitialProps, ctx: ', ctx);
  // console.log('---- about to fetch site data...');
  // const res = await fetch(`https://addons-dev.allizom.org/api/v5/site/`);
  // console.log('---- got site data: ', res);
  // const statusCode = res.status > 200 ? res.status : false;
  // const data = await res.json();

  // Pass data to the page via props
  // return { siteData: data, statusCode };
  return { siteData };
};

export default MyApp;
