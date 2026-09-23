import TinaVisualPreview from "../../components/TinaVisualPreview";
import { getTinaPreviewProps } from "../../lib/getTinaPreviewProps";

export async function getStaticProps() {
  return getTinaPreviewProps("privacy-policy");
}

export default TinaVisualPreview;
