import TinaVisualPreview from "../../components/TinaVisualPreview";
import { getTinaPreviewProps } from "../../lib/getTinaPreviewProps";

export async function getStaticProps() {
  return getTinaPreviewProps("services");
}

export default TinaVisualPreview;
