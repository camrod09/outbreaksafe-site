import Blocks from "./blocks/Blocks";

export default function Homepage({ page }) {
  return <Blocks blocks={page.blocks} />;
}
