import Head from 'next/head';

export default function Layout({ children, title = 'Addons!' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <header>header</header>
        {children}
        <footer>footer</footer>
      </div>
    </>
  );
}
