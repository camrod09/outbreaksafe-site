import fs from "node:fs/promises";
import path from "node:path";

// Tina emits its existing static admin bundle to public/admin. Serve its index
// at the directory URL because Next's public-file handling only matches files.
export async function getServerSideProps({ res }) {
  const admin = await fs.readFile(
    path.join(process.cwd(), "public", "admin", "index.html"),
    "utf8",
  );

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(admin);
  return { props: {} };
}

export default function TinaAdmin() {
  return null;
}
