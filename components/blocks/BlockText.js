import { tinaField } from "tinacms/dist/react";

export function field(item, name) {
  return item ? tinaField(item, name) : undefined;
}

export function Text({ as: Tag = "p", item, name, className, children }) {
  const value = children === undefined ? item?.[name] : children;
  if (!value) return null;
  return <Tag className={className} data-tina-field={field(item, name)}>{value}</Tag>;
}

export function Button({ item, labelField = "ctaLabel", linkField = "ctaLink" }) {
  const label = item?.[labelField];
  if (!label) return null;
  return (
    <a className="button-secondary" href={item?.[linkField] || "#"} data-tina-field={field(item, linkField)}>
      <span className="button-text-wrap" data-tina-field={field(item, labelField)}>{label}</span>
      <span className="button-background" aria-hidden="true" />
    </a>
  );
}

export function alignmentClass(value) {
  return value ? `align-${value}` : "";
}

export function widthClass(value) {
  return value ? `width-${value}` : "";
}
