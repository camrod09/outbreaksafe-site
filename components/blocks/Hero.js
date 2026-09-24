import { Button, Text, field } from "./BlockText";

export default function Hero({ block }) {
  return <section className="section hero" data-tina-field={field(block)}>
    <div className="container hero-content">
      <Text as="div" className="mono-text" item={block} name="eyebrow" />
      <Text as="h1" className="display-4xl" item={block} name="heading" />
      <Text className="hero-paragraph" item={block} name="text" />
      <Button item={block} />
      {block.secondaryCtaLabel ? <Button item={block} labelField="secondaryCtaLabel" linkField="secondaryCtaLink" /> : null}
      {block.image ? <img className="hero-image-wrap" src={block.image} alt={block.imageAlt || ""} data-tina-field={field(block, "image")} /> : null}
    </div>
  </section>;
}
