import Hero from "./Hero";
import HeadingText from "./HeadingText";
import RichText from "./RichText";
import ImageText from "./ImageText";
import FullWidthImage from "./FullWidthImage";
import FeatureCards from "./FeatureCards";
import TechnologyGrid from "./TechnologyGrid";
import TeamGrid from "./TeamGrid";
import Cta from "./Cta";
import Spacer from "./Spacer";

const components = { hero: Hero, headingText: HeadingText, richText: RichText, imageText: ImageText, fullWidthImage: FullWidthImage, featureCards: FeatureCards, technologyGrid: TechnologyGrid, teamGrid: TeamGrid, cta: Cta, spacer: Spacer, divider: Spacer };

export default function Blocks({ blocks = [] }) {
  return <main className="tina-blocks">{blocks.map((block, index) => {
    const template = block?._template || block?.__typename?.replace(/^PageBlocks/, "").replace(/^[A-Z]/, (letter) => letter.toLowerCase());
    const Component = components[template];
    return Component ? <Component block={block} key={`${block._template}-${index}`} /> : null;
  })}</main>;
}
