import { Button, Text, field } from "./BlockText";

export default function Cta({ block }) {
  return <section className="section no-padding" data-tina-field={field(block)}>
    <div className="fixed-image-wrap">
      <Text as="div" className="mono-text" item={block} name="eyebrow" />
      <Text as="h2" className="display-3xl" item={block} name="heading" />
      <Text item={block} name="body" />
      <Button item={block} />
      <div className="cta-image-wrap">
        <div className="image-overlay" aria-hidden="true" />
        {block.backgroundImage ? <img className="background-image" src={block.backgroundImage} alt={block.backgroundAlt || ""} data-tina-field={field(block, "backgroundImage")} /> : null}
      </div>
    </div>
  </section>;
}
