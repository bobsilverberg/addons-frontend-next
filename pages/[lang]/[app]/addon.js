import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Layout from 'components/Layout';
import Error from 'pages/_error';
// import AddonBadges from 'components/AddonBadges';
import styles from 'styles/Home.module.css';

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

export default function Addon({ aProp, addonData, i18n, statusCode }) {
  console.log('----- In Addon, data: ', addonData);
  const { ratings, isLoading, isError } = useRatings(addonData.id);
  console.log('----- In Addon, ratings data: ', ratings);
  const router = useRouter();
  const { app, lang } = router.query;
  console.log('----- In Addon, app: ', app);
  console.log('----- In Addon, lang: ', lang);
  console.log('----- In Addon, aProp: ', aProp);
  console.log('----- In Addon, i18n: ', i18n);

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
          <h1 className={styles.title}>Addon Detail Page</h1>
          <div>
            Rating:
            {isError ? <div>failed to load</div> : null}
            {isLoading ? <div>oading...</div> : null}
            {ratings ? ratings.grouped_ratings[1] : null}
          </div>

          {/* <AddonMoreInfo addon={addonData} i18n={i18n} /> */}
        </main>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  console.log('----- in getServerSideProps, context: ', context);
  // Fetch data from external API
  const res = await fetch(
    `	https://addons-dev.allizom.org/api/v4/addons/addon/webmail-ad-blocker/?app=firefox&appversion=84.0&lang=en-US&wrap_outgoing_links=true`,
  );
  const statusCode = res.status > 200 ? res.status : false;
  const data = await res.json();

  // Pass data to the page via props
  return { props: { addonData: data, statusCode } };
}
