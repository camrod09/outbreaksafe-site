import { Button, Text, field } from "./BlockText";

export default function Hero({ block }) {
  const mediaType = block.mediaType || "interactive";

  const media = mediaType === "none" ? null : (
    <div className="hero-image-wrap" data-tina-field={field(block, "mediaType")}>
      {mediaType === "image" && block.image ? (
        <img src={block.image} alt={block.imageAlt || ""} data-tina-field={field(block, "image")} />
      ) : null}
      {mediaType === "video" && block.image ? (
        <video src={block.image} muted autoPlay loop playsInline data-tina-field={field(block, "image")} />
      ) : null}
      {mediaType !== "image" && mediaType !== "video" ? (
        <iframe
          className="premium-hero-frame"
          src="/hero.html"
          title="Interactive OutbreakSafe hero"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : null}
      <div className="hero-image-overlay" aria-hidden="true" />
    </div>
  );

  return <section className="section hero" data-tina-field={field(block)}>
    {media}
    <div className="container hero-content">
      <Text as="div" className="mono-text" item={block} name="eyebrow" />
      <Text as="h1" className="display-4xl" item={block} name="heading" />
      <Text className="hero-paragraph" item={block} name="text" />
      <Button item={block} />
      {block.secondaryCtaLabel ? <Button item={block} labelField="secondaryCtaLabel" linkField="secondaryCtaLink" /> : null}
    </div>
  </section>;
}
