import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="title"
          content="PolyEstate | Unlock the Future of Real Estate: Secure, Transparent, and ZK-Private Transactions with Polygon ID"
        />
        <meta
          name="description"
          content="PolyEstate also provides the auction of the Properties. Everyone can bet on the properties"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
