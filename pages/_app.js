import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { GlobalProvider } from '../context/global';
import { I18nProvider } from '../context/i18n';
import { UserProvider } from '../context/user';

import 'styles/globals.scss';
import 'components/AddonTitle/styles.scss';
import 'components/DefinitionList/styles.scss';

// Here's a question about the same thing without a good answer:
// https://stackoverflow.com/questions/57759562/how-to-fetch-data-only-once-in-a-next-js-app-and-make-it-accesible-to-all-the-ap
// https://stackoverflow.com/questions/60899880/next-js-reduce-data-fetching-and-share-data-between-pages
//

function MyApp({ Component, pageProps, siteData }) {
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
MyApp.getInitialProps = async () => {
  const res = await fetch(`https://addons-dev.allizom.org/api/v5/site/`);
  // const statusCode = res.status > 200 ? res.status : false;
  const siteData = await res.json();
  // TODO: Need error checking!
  return { siteData };
};

export default MyApp;
