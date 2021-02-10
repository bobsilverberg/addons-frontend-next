import makeClassName from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useI18nState } from 'context/i18n';
import { useGlobalState } from 'context/global';
import AddonsByAuthorsCard from 'components/AddonsByAuthorsCard';
import Card from 'components/Card';
import Page from 'components/Page';
import ThemeImage from 'components/ThemeImage';
import Error from 'pages/_error';
import { getAddonURL } from 'utils';
import { getAddonIconUrl } from 'utils/imageUtils';

import {
  ADDON_TYPE_EXTENSION,
  ADDON_TYPE_STATIC_THEME,
} from '../../../../constants';
import styles from './styles.module.scss';

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useRatings(addonId) {
  const { data, error } = useSWR(
    `https://addons-dev.allizom.org/api/v4/ratings/rating/?addon=${addonId}&show_grouped_ratings=true&lang=en-US&wrap_outgoing_links=true`,
    // fetcher
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function Addon({ addon, statusCode }) {
  const {
    numberOfAddonsByAuthors,
    setViewContext,
    viewContext,
  } = useGlobalState();
  const { i18n } = useI18nState();

  useEffect(() => {
    if (addon.type) {
      setViewContext(addon.type);
    }
  }, [addon]);

  if (statusCode) {
    return <Error statusCode={statusCode} />;
  }

  const { ratings, isLoading, isError } = useRatings(addon.id);

  function headerImage() {
    if (addon && ADDON_TYPE_STATIC_THEME === addon.type) {
      return <ThemeImage addon={addon} roundedCorners />;
    }

    const label = addon
      ? i18n.sprintf(i18n.gettext('Preview of %(title)s'), {
          title: addon.name,
        })
      : null;

    return (
      <div className={styles['Addon-icon']} key="Addon-icon-header">
        <div className={styles['Addon-icon-wrapper']}>
          <img
            alt={label}
            className={styles['Addon-icon-image']}
            src={getAddonIconUrl(addon)}
          />
        </div>
      </div>
    );
  }

  const isThemeType = addon && addon.type === ADDON_TYPE_STATIC_THEME;
  const addonType = addon ? addon.type : ADDON_TYPE_EXTENSION;
  const addonPreviews = addon ? addon.previews : [];

  return (
    <div className={styles.container}>
      <Head>
        <title>Addon Detail Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Page showWrongPlatformWarning={false}>
          <div
            className={makeClassName(
              styles.Addon,
              styles[`Addon-${addonType}`],
              {
                [styles['Addon-theme']]: isThemeType,
                [styles['Addon--has-more-than-0-addons']]:
                  Number(numberOfAddonsByAuthors) > 0,
                [styles['Addon--has-more-than-3-addons']]:
                  Number(numberOfAddonsByAuthors) > 3,
              },
            )}
            data-site-identifier={addon ? addon.id : null}
          >
            <div className="Addon-header-wrapper">
              <Card className="Addon-header-info-card" photonStyle>
                <header className="Addon-header">
                  {headerImage()}

                  <AddonTitle addon={addon} />
                </header>
                <div>
                  Rating:
                  {isError ? <div>failed to load</div> : null}
                  {isLoading ? <div>oading...</div> : null}
                  {ratings ? ratings.grouped_ratings[1] : null}
                </div>
              </Card>
              {/* <AddonMoreInfo addon={addonData} i18n={i18n} /> */}
            </div>
          </div>
        </Page>
      </main>
    </div>
  );
}

Addon.propTypes = {
  addon: PropTypes.object,
  statusCode: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

export async function getServerSideProps(context) {
  const { clientApp, lang, slug } = context.params;

  // Fetch data from external API
  console.log('--- fetching data on the server for: ', slug);
  const res = await fetch(
    `	https://addons-dev.allizom.org/api/v5/addons/addon/${slug}/?lang=${lang}`,
  );
  const statusCode = res.status > 200 ? res.status : false;
  const data = await res.json();

  if (data && data.slug && data.slug !== slug) {
    // If the slug (which is actually the URL parameter) does not match the
    // add-on's slug, it means the URL isn't the "canonical URL" and we
    // have to send a server redirect to fix that. The URL can contain an
    // add-on ID, a GUID or the actual slug. In some cases, it can have
    // trailing spaces or slightly different characters. As far as the API
    // returns an add-on for the value of this parameter, we should be able
    // to display it, after the redirect below.
    return {
      redirect: {
        destination: getAddonURL({ clientApp, lang, slug: data.slug }),
        statusCode: 301,
      },
    };
  }

  // Pass data to the page via props
  return { props: { addon: data, statusCode } };
}
