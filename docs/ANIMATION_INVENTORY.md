# OutbreakSafe animation archaeology

This inventory was completed before changing the motion implementation. The
historical sources were inspected on the `feat/nextjs-migration` branch and in
`main`/the pre-Tina history, including commit `950fc1d` (the original uploaded
static export), `38b6c09` (embedded assets), and the later Tina commits. No
`data-w-id`, `data-wf-*`, Webflow IX/IX2 JSON, or Webflow runtime script was
present in any tracked revision. The export does retain captured inline styles
that identify the motion states used when the pages were scraped.

| Page | Element/section | Original animation evidence | Likely behaviour | Confidence | Replacement |
| --- | --- | --- | --- | --- | --- |
| All pages with `.animation-up-0-1` | Content blocks/sections | `950fc1d` HTML has `transform: translate3d(0, 20px, 0)` and `opacity: 0`; current `site.js` already observes `[class*="animation-up"]` and sets opacity/transform on intersection | Fade and slide upward as sections enter the viewport | High | CSS transition plus IntersectionObserver in `public/site.js`/`public/site.css` |
| Homepage, Services, Platform, Contact | Hero/display headings using `.gsap_split_word` and `.gsap_split_word-mask` | `950fc1d` HTML contains split-word spans with `translate(0%, 100%)`, `opacity: 0`, and `aria-label`; later captured states contain `translate3d(0, 0, 0)`, `opacity: 1` | Staggered word-by-word upward reveal, likely on load or when the heading enters view | High | CSS transform/opacity transition with a small per-word delay and IntersectionObserver |
| Homepage and inner pages | Menu panel `.nav-content` | Historical inline state is `opacity: 0; transform: translate3d(0, -100%, 0)`; current `site.js` toggles opacity and `translate3d(0,-100%,0)`/`translate3d(0,0,0)` | Slide/fade navigation overlay on menu open | High | Existing project-owned menu code retained; CSS transition added for related controls |
| All pages | Primary button fills `.button-background` | Historical inline state is `translate3d(0, 102%, 0)`; `.button-background` and `.button-wrap` survive in HTML/CSS | Circular/under-fill rises on hover/focus | High | CSS hover/focus-within transform transition |
| All pages | Footer and inline link underlines | Historical inline state is `.footer-underline-button { transform: translate3d(-100%, 0, 0) }`; `.button-hover-line` has the same semantic role | Underline slides in on hover/focus | High | CSS hover/focus-visible transform transition |
| About, Services, Platform | Background/feature imagery | Historical HTML has `will-change: transform` and captured `translate3d`/`scale3d` states on `.background-image`; About also has small percentage Y translations and Platform has `.background-image-wrap`/`.ipad-image-wrap` scale states | Slow parallax or image scale-in while scrolling | Medium | Not recreated: evidence identifies a transformed state but not the trigger/range, so no speculative parallax was added |
| About | Image/section reveal wrappers | `.image-revealer` exists in HTML/CSS and historical capture; no surviving trigger/timing/runtime was found | Image cover retracts to reveal content | Medium | Not recreated: retained as historical evidence; trigger and direction are underdetermined |
| Sliders on About | Testimonial/team sliders | Historical markup contains slider attributes (`data-animation="slide"`, durations, easing, autoplay/loop flags) and slider classes; no slider runtime is tracked | Slide transitions and optional autoplay | High for intended slide behavior; low for current runtime | Not changed in this pass; existing static slider markup is retained because its runtime/interaction contract was not recoverable |
| All pages | Hover color/opacity and arrow micro-interactions | CSS has `.nav-link:hover`, `.social-icon-link-black:hover`, `.footer-link:hover`, `.contact-link:hover`, `.arrow-icon.hover`, and related classes | Small color/opacity/arrow movement feedback | High for hover intent; medium for exact timing | Existing CSS retained; underline/fill transitions restored |
| All pages | Parallax/background movement beyond the captured states | No complete interaction configuration, `data-w-*`, IX2 payload, or runtime was found in Git history | Possible scroll-linked background movement | Low | Not invented |

## Implementation notes

- The old Webflow/GSAP runtime is not a dependency of the Next.js site. The
  recovered motion uses only the existing `site.js`, CSS transitions, and the
  browser's `IntersectionObserver`.
- Captured inline styles in the scraped HTML are overridden only while the
  project-owned `motion-ready` class is active. This prevents a stale scraped
  state from defeating the replacement animation without deleting the evidence
  from the legacy pages.
- `prefers-reduced-motion: reduce` makes reveals immediate and removes
  transitions. Browsers without `IntersectionObserver` also receive visible
  content rather than hidden content.
- The replacement is intentionally restrained: a 20px upward reveal, 600ms
  section timing, 500ms split-word timing, and 45ms stagger. These values are
  grounded in the captured 20px/100% states; exact original durations were not
  recoverable for the custom motion.

## Unrecovered items

The repository does not contain the original Webflow interaction payload or a
complete animation runtime, so exact scroll ranges, parallax curves, image
reveal timing, and slider behavior cannot be claimed as recovered. Those items
remain documented rather than replaced with elaborate guesses.
