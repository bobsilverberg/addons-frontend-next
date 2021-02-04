import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useI18nState } from 'context/i18n';
import AddonsCard from 'components/AddonsCard';
import CardList from 'components/CardList';
import Layout from 'components/Layout';
import Error from 'pages/_error';
import { createInternalShelf } from 'utils/addons';
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

  const { shelves } = shelfData;
  return (
    <Layout title="Add-ons Home Page">
      <div className={styles.container}>
        <Head>
          <title>Add-ons Home Page</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>Add-ons Home Page</h1>

          {shelves.map((shelf) => {
            return (
              <>
                <AddonsCard addons={shelf.addons} key={shelf.title} />
              </>
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
