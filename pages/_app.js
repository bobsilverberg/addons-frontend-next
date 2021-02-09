import PropTypes from 'prop-types';
// import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { GlobalProvider } from '../context/global';
import { I18nProvider } from '../context/i18n';
import { Provider as SiteProvider, getSiteData } from '../context/site';
import { UserProvider } from '../context/user';

import 'styles/globals.scss';
// import 'components/AddonBadges/styles.scss';

// See https://github.com/kirill-konshin/next-redux-wrapper#app
// for an example of using a class instead of a function, and maybe I can
// make something work with that.
//
// Here's a question about the same thing without a good answer:
// https://stackoverflow.com/questions/57759562/how-to-fetch-data-only-once-in-a-next-js-app-and-make-it-accesible-to-all-the-ap
// https://stackoverflow.com/questions/60899880/next-js-reduce-data-fetching-and-share-data-between-pages
//

function MyApp({ Component, pageProps, siteData }) {
  // Here's a way to get config values into _app.js
  // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

  // We can get params from the querystring
  const router = useRouter();
  const { lang } = router.query;

  return (
    <UserProvider>
      <I18nProvider lang={lang}>
        <GlobalProvider initialSiteData={siteData}>
          <Component {...pageProps} />
        </GlobalProvider>
      </I18nProvider>
    </UserProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.shape({}),
  siteData: PropTypes.object,
};

// The problem with getInitialProps is that it runs on every single page,
// even when only client-side navigation is used, so any API requests in here
// will be run every time, which isn't what we want.
//
MyApp.getInitialProps = async (ctx) => {
  console.log('---- in MyApp.getInitialProps, about to fetch siteData...');
  const res = await fetch(`https://addons-dev.allizom.org/api/v5/site/`);
  const statusCode = res.status > 200 ? res.status : false;
  const siteData = await res.json();
  console.log('---- in MyApp.getInitialProps, got siteData: ', siteData);
  // TODO: Need error checking!
  return { siteData };
};

export default MyApp;
