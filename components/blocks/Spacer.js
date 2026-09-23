import { field } from "./BlockText";
export default function Spacer({ block }) { const size = { small: "2rem", medium: "4rem", large: "8rem" }[block.size] || "4rem"; return <div data-tina-field={field(block)} style={{ paddingTop: size }}>{block.divider ? <hr /> : null}</div>; }
