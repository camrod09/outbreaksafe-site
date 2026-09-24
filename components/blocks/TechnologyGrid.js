import { Text, field } from "./BlockText";

export default function TechnologyGrid({ block }) {
  return <section className="section no-padding" data-tina-field={field(block)}>
    <div className="container no-padding">
      <div className="animation-up-0-1">
        <Text as="div" className="mono-text" item={block} name="eyebrow" />
        <Text as="h2" className="display-3xl" item={block} name="heading" />
        <div className="sticky-cards-wrap">
          {(block.items || []).map((item, index) => (
            <article className="sticky-image-card" key={index} data-tina-field={field(item)}>
              <div className={`sticky-card-content _${index + 1}`}>
                <Text as="h3" className="display-l" item={item} name="heading" />
                <Text item={item} name="text" />
              </div>
              {item.image ? <img className="sticky-card-image" src={item.image} alt={item.imageAlt || ""} data-tina-field={field(item, "image")} /> : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>;
}
