import Head from "next/head";
import Homepage from "../components/Homepage";
import page from "../public/content/pages/index.json";

export async function getStaticProps() {
  return { props: { page } };
}

export default function Home({ page: homepage }) {
  return (
    <>
      <Head>
        <title>{homepage.seo?.title || homepage.name}</title>
        {homepage.seo?.description ? <meta name="description" content={homepage.seo.description} /> : null}
        <link rel="stylesheet" href="/site.css" />
        <link rel="stylesheet" href="/2f76b9d2697264b9" />
        <link rel="icon" href="/outbreaksafe-logo.svg" type="image/svg+xml" />
      </Head>
      <Homepage page={homepage} />
    </>
  );
}
