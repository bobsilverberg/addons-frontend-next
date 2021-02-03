import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useI18nState } from 'context/i18n';
import CardList from 'components/CardList';
import Layout from 'components/Layout';
import Error from 'pages/_error';
import styles from 'styles/Home.module.css';

export default function Home({ shelfData, statusCode }) {
  const { i18n } = useI18nState();
  console.log('----- In Home, i18n: ', i18n);

  console.log('----- In Home, statusCode: ', statusCode);
  const router = useRouter();
  const { app, lang } = router.query;

  if (statusCode) {
    return <Error statusCode={statusCode} />;
  }

  const { results } = shelfData;
  return (
    <Layout title="Add-ons Home Page">
      <div className={styles.container}>
        <Head>
          <title>Add-ons Home Page</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Add-ons Home Page</h1>

          {results.map((shelf) => {
            return (
              <CardList key={shelf.title}>
                <div>
                  <p>{shelf.title}</p>
                  {shelf.addons.map((addon) => {
                    return (
                      <p key={addon.id}>
                        <Link href={`/${lang}/${app}/addon/${addon.slug}`}>
                          <a>{addon.slug}</a>
                        </Link>
                      </p>
                    );
                  })}
                </div>
              </CardList>
            );
          })}
        </main>
      </div>
    </Layout>
  );
}

Home.propTypes = {
  shelfData: PropTypes.shape({}),
  statusCode: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`	https://addons-dev.allizom.org/api/v5/shelves/`);
  const statusCode = res.status > 200 ? res.status : false;
  const data = await res.json();

  // Pass data to the page via props
  return { props: { shelfData: data, statusCode } };
}
