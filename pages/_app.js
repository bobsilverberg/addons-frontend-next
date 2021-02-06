import PropTypes from 'prop-types';
// import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { GlobalProvider } from '../context/global';
import { I18nProvider } from '../context/i18n';
import { Provider as SiteProvider, getSiteData } from '../context/site';
import { UserProvider } from '../context/user';

import 'styles/globals.css';
import 'components/AddonBadges/styles.scss';

// See https://github.com/kirill-konshin/next-redux-wrapper#app
// for an example of using a class instead of a function, and maybe I can
// make something work with that.
//
// Here's a question about the same thing without a good answer:
// https://stackoverflow.com/questions/57759562/how-to-fetch-data-only-once-in-a-next-js-app-and-make-it-accesible-to-all-the-ap

function MyApp({ Component, pageProps }) {
  const [siteData, setSiteData] = useState(null);
  const [siteDataLoading, setSiteDataLoading] = useState(false);

  if (!siteData && !siteDataLoading) {
    setSiteDataLoading(true);
    console.log('---- about to fetch site data...');
    fetch(`https://addons-dev.allizom.org/api/v5/site/`).then((res) => {
      console.log('---- got site data: ', res);
      res.json().then((data) => {
        setSiteData(data);
        setSiteDataLoading(false);
      });
    });
  }

  // const loadSiteData = async () => {
  //   console.log('---- siteData in MyApp: ', siteData);
  //   if (!siteData && !siteDataLoading) {
  //     setSiteDataLoading(true);
  //     console.log('---- about to fetch site data...');
  //     const res = await fetch(`https://addons-dev.allizom.org/api/v5/site/`);
  //     console.log('---- got site data: ', res);
  //     // const statusCode = res.status > 200 ? res.status : false;
  //     const data = await res.json();
  //     setSiteData(data);
  //     setSiteDataLoading(false);
  //   }
  // };

  // loadSiteData();
  // Here's a way to get config values into _app.js
  // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

  // We can get params from the querystring
  const router = useRouter();
  const { lang } = router.query;

  // We can add page props to pass into every component.
  const props = { ...pageProps, siteData };

  return (
    <UserProvider>
      <I18nProvider lang={lang}>
        <GlobalProvider initialSiteData={siteData}>
          <Component {...props} />
        </GlobalProvider>
      </I18nProvider>
    </UserProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.shape({}),
};

// MyApp.getInitialProps = async (ctx) => {
//   const siteData = await getSiteData();
//   console.log('---- in MyApp.getInitialProps, siteData: ', siteData);
//   // console.log('---- in MyApp.getInitialProps, ctx: ', ctx);
//   // console.log('---- about to fetch site data...');
//   // const res = await fetch(`https://addons-dev.allizom.org/api/v5/site/`);
//   // console.log('---- got site data: ', res);
//   // const statusCode = res.status > 200 ? res.status : false;
//   // const data = await res.json();

//   // Pass data to the page via props
//   // return { siteData: data, statusCode };
//   return { siteData };
// };

export default MyApp;
