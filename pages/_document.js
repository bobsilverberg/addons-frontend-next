import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class AmoDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* We could include HeadMetaTags here, with some modifications. */}
          <meta name="description" content="Test description" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
