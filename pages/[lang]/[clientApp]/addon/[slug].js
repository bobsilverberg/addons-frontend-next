import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useI18nState } from 'context/i18n';
import Layout from 'components/Layout';
import Page from 'components/Page';
import Error from 'pages/_error';
// import AddonBadges from 'components/AddonBadges';
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

export default function Addon({ aProp, addonData, statusCode }) {
  const { i18n } = useI18nState();
  // const { ratings, isLoading, isError } = useRatings(addonData.id);

    // This makes sure we do not try to dispatch any new actions in the case
    // of an error.
    if (!errorHandler.hasError()) {
      if (addon) {
        // If the slug (which is actually the URL parameter) does not match the
        // add-on's slug, it means the URL isn't the "canonical URL" and we
        // have to send a server redirect to fix that. The URL can contain an
        // add-on ID, a GUID or the actual slug. In some cases, it can have
        // trailing spaces or slightly different characters. As far as the API
        // returns an add-on for the value of this parameter, we should be able
        // to display it, after the redirect below.
        if (addon.slug !== params.slug) {
          // We only load add-ons by slug, but ID must be supported too because
          // it is a legacy behavior.
          dispatch(
            sendServerRedirect({
              status: 301,
              url: `/${lang}/${clientApp}${getAddonURL(addon.slug)}`,
            }),
          );
          return;
        }

        dispatch(setViewContext(addon.type));
      } else if (!addonIsLoading) {
        dispatch(fetchAddon({ slug: params.slug, errorHandler }));
      }
    }
  }

  if (statusCode) {
    return <Error statusCode={statusCode} />;
  }

  return (
    <Layout title="The add-on detail page">
      <div className={styles.container}>
        <Head>
          <title>Addon Detail Page</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <Page showWrongPlatformWarning={false}>
            <h1 className={styles.title}>Addon Detail Page</h1>
            <div>
              Rating:
              {isError ? <div>failed to load</div> : null}
              {isLoading ? <div>oading...</div> : null}
              {ratings ? ratings.grouped_ratings[1] : null}
            </div>

            {/* <AddonMoreInfo addon={addonData} i18n={i18n} /> */}
          </Page>
        </main>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  console.log(context);
  const { lang, slug } = context.params;

  // Fetch data from external API
  const res = await fetch(
    `	https://addons-dev.allizom.org/api/v4/addons/addon/${slug}/?lang=${lang}`,
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
          destination: `/${lang}/${clientApp}${getAddonURL(addon.slug)}`,
          statusCode: 301,
        },
      };
      // Old code from constructor
      // dispatch(
      //   sendServerRedirect({
      //     status: 301,
      //     url: `/${lang}/${clientApp}${getAddonURL(addon.slug)}`,
      //   }),
      // );
      // return;
    }

  // Pass data to the page via props
  return { props: { addonData: data, statusCode } };
}
