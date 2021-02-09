import makeClassName from 'classnames';
import PropTypes from 'prop-types';

import AppBanner from '../AppBanner';
// import NotFound from 'amo/components/Errors/NotFound';
// import UnavailableForLegalReasons from 'amo/components/Errors/UnavailableForLegalReasons';
// import Footer from 'amo/components/Footer';
// import Header from 'amo/components/Header';
// import WrongPlatformWarning from 'amo/components/WrongPlatformWarning';
// import InfoDialog from 'amo/components/InfoDialog';
import { CLIENT_APP_ANDROID } from '../../constants';
// import log from '../../utils/logger_next';
import styles from './styles.module.scss';

export default function Page({
  children,
  clientApp,
  errorHandler,
  isHomePage = false,
  location,
  showWrongPlatformWarning = true,
}) {
  let errorContent;
  // TODO: Figure out how to deal with errorHandlers
  //   if (errorHandler && errorHandler.hasError()) {
  //     // 401 and 403 for an add-on lookup is made to look like a 404 on purpose.
  //     // See https://github.com/mozilla/addons-frontend/issues/3061
  //     if (
  //       errorHandler.capturedError.responseStatusCode === 401 ||
  //       errorHandler.capturedError.responseStatusCode === 403 ||
  //       errorHandler.capturedError.responseStatusCode === 404
  //     ) {
  //       errorContent = <NotFound />;
  //     } else if (errorHandler.capturedError.responseStatusCode === 451) {
  //       errorContent = <UnavailableForLegalReasons />;
  //     }

  //     const logMessage = `Captured API Error: ${errorHandler.capturedError.messages}`;
  //     if (errorContent) {
  //       _log.debug(logMessage);
  //     } else {
  //       // This is a string, silly eslint.
  //       // eslint-disable-next-line amo/only-log-strings
  //       _log.warn(logMessage);
  //     }
  //   }

  return (
    <div className={styles['Page-amo']}>
      {/* <InfoDialog /> */}

      {/* <Header isHomePage={isHomePage} location={location} /> */}

      <div className={styles['Page-content']}>
        <div
          className={makeClassName('Page', {
            [styles['Page-not-homepage']]: !isHomePage,
            [styles['Page-no-hero-promo']]: clientApp === CLIENT_APP_ANDROID,
          })}
        >
          {
            // Exclude the AppBanner from the home page, but include it on the
            // Android home page.
            // (!isHomePage || clientApp === CLIENT_APP_ANDROID) && <AppBanner />
            <AppBanner />
          }
          {/* {showWrongPlatformWarning && (
            <WrongPlatformWarning isHomePage={isHomePage} />
          )} */}
          {errorContent || children}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.node,
  clientApp: PropTypes.string,
  errorHandler: PropTypes.object,
  isHomePage: PropTypes.bool,
  showWrongPlatformWarning: PropTypes.bool,
};
