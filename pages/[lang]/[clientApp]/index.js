import Head from 'next/head';
import PropTypes from 'prop-types';
import { useI18nState } from 'context/i18n';
import LandingAddonsCard from 'components/LandingAddonsCard';
import Page from 'components/Page';
import { CLIENT_APP_FIREFOX } from '../../../constants';
import Error from 'pages/_error';
import { createInternalShelf } from 'utils/addons';
import styles from './styles.module.scss';

export default function Home({ clientApp, shelfData, statusCode }) {
  const { i18n } = useI18nState();
  const isDesktopSite = clientApp === CLIENT_APP_FIREFOX;

  if (statusCode) {
    return <Error statusCode={statusCode} />;
  }

  const { shelves } = shelfData;
  return (
    <div className={styles.container}>
      <Head>
        <title>{i18n.gettext('Add-ons Home Page')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Page isHomePage showWrongPlatformWarning={!isDesktopSite}>
          <div className="Home">
            <h1 className={styles.title}>Add-ons Home Page</h1>

            {shelves.map((shelf) => {
              return (
                <>
                  <LandingAddonsCard addons={shelf.addons} key={shelf.title} />
                </>
              );
            })}
          </div>
        </Page>
      </main>
    </div>
  );
}

Home.propTypes = {
  clientApp: PropTypes.string,
  shelfData: PropTypes.object,
  statusCode: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

export async function getServerSideProps(context) {
  const { lang } = context.params;
  const res = await fetch(
    `	https://addons-dev.allizom.org/api/v5/shelves/?lang=${lang}`,
  );
  const statusCode = res.status > 200 ? res.status : false;
  const data = await res.json();

  // We need to covert the data somewhere. I guess we can do it here, for now.
  const { primary, secondary, results } = data;
  const shelfData = {
    primary,
    secondary,
    shelves: results.map((shelf) => createInternalShelf(shelf, lang)),
  };

  // Pass data to the page via props
  return { props: { shelfData, statusCode } };
}
