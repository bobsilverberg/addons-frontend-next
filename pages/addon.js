import Head from "next/head";
import useSWR from "swr";

import styles from "../styles/Home.module.css";

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useRatings(addonId) {
  const { data, error } = useSWR(
    `https://addons-dev.allizom.org/api/v4/ratings/rating/?addon=${addonId}&show_grouped_ratings=true&lang=en-US&wrap_outgoing_links=true`
    // fetcher
  );

  return {
    ratings: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function Addon({ addonData }) {
  console.log("----- In Addon, data: ", addonData);
  const { ratings, isLoading, isError } = useRatings(addonData.id);
  console.log("----- In Addon, ratings data: ", ratings);

  return (
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
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getServerSideProps(context) {
  console.log("----- in getServerSideProps, context: ", context);
  // Fetch data from external API
  const res = await fetch(
    `	https://addons-dev.allizom.org/api/v4/addons/addon/webmail-ad-blocker/?app=firefox&appversion=84.0&lang=en-US&wrap_outgoing_links=true`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { addonData: data } };
}
