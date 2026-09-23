// Tina emits a static admin bundle to public/admin during the production
// build. Redirect the directory URL to that generated public file instead of
// reading it from the serverless filesystem at request time.
export function getServerSideProps() {
  return {
    redirect: {
      destination: "/admin/index.html#/~/tina-preview/home",
      permanent: false,
    },
  };
}

export default function TinaAdmin() {
  return null;
}
