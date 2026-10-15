# Jennifer A. Schmeisser: Author · Speaker · Advocate (demo site)

A demo website for Jennifer A. Schmeisser and her memoir **_When the Blueprint Burned: A Unicorn Mama Memoir of Neurodiversity, Strength, Joy & Humor_**, with **Sparkle**, an AI book companion.

**Live demo:** https://chatgptmentoring.github.io/jennifer-schmeisser-author/

> This is a client preview. Search engines are blocked (`robots.txt` + `noindex`) until the site launches.

## What's inside

| Page | Purpose |
|---|---|
| `index.html` | Home: hero, the book, Sparkle showcase, meet Jennifer, Sparkle & Sanity tip shuffler, speaking, resources |
| `book.html` | The book: blurb, audience, excerpt, what's inside, full table of contents, dedication |
| `about.html` | Jennifer's story (timeline), Ryan & Megan, fun facts, training, values, copy-ready official bios |
| `speaking.html` | Six signature talks, formats, event-planner perks, inquiry form, downloadable one-sheet |
| `resources.html` | Free printables, each linked to a book chapter. The book is always the primary call to action |
| `ask.html` | Full-page chat with Sparkle |
| `contact.html` | Contact form, email, Facebook, LinkedIn, Instagram, Threads |

Sparkle also floats on every page, and the conversation carries over as visitors move between pages.

## Before launch: edit one file

Everything that changes lives in **`docs/assets/js/config.js`**:

- `book.amazonUrl`: paste the Amazon link and every "Get the Book" button switches from "Coming soon / Notify me" to **Buy on Amazon**.
- `email`: replace the placeholder (`hello@jenniferschmeisser.com`) with Jennifer's real address. Also update `print/speaker-one-sheet.html`, then rebuild assets.
- `formEndpoint`: point the forms at a form service (e.g. Formspree). Until then, forms show a "demo" thank-you.
- `ai.endpoint`: connect Sparkle to a real AI backend (see below).

## Sparkle: demo vs. production

**Demo (now):** runs entirely in the browser using `docs/assets/js/sparkle-kb.js`, a knowledge base hand-built from the manuscript:
- 48 topics (diagnosis, grief, meltdowns, IEPs, sensory, OCD, siblings, marriage, burnout, sleep, safety, adult transition, faith, food, communication, speaking, buying the book, and more)
- 24 short stories retold from the book, shown as "typewritten" story cards
- A guided 1-minute breathing exercise
- Crisis safety replies (911 / 988)
- **CTA logic:** the book card appears after stories and periodically in guidance replies. Free resources show up only as secondary "free gift" suggestions.

Test which topic a question maps to in the browser console: `Sparkle._route("help with my IEP meeting")`.

**Production (recommended):** a small serverless function (Cloudflare Worker / Vercel / Netlify) that holds the API key and calls Claude with:
1. A system prompt in Jennifer's voice, with the guardrails used in the demo (not medical/legal advice, crisis escalation, book-first CTAs, careful handling of Chapter 9).
2. Retrieval over the edited manuscript, so answers quote and cite real chapters.
3. JSON output `{ text, chips, showBook }`, which the current UI already understands. Set `ai.endpoint` in `config.js` and the demo brain becomes the fallback.

## Editing

Pages live in `docs/`. Shared pieces (header, footer, icons, modals, `<head>`) live in `partials/` and are copied into every page with:

```bash
python tools/build.py
```

To regenerate the downloadable PDFs, thumbnails, speaker one-sheet, and social share image (requires Microsoft Edge, PyMuPDF, Pillow, and the original files in `../Extra Book`):

```bash
python tools/build.py --assets
```

## Notes

- Hosting: GitHub Pages serves the `docs/` folder from `main`.
- No frameworks and no build step needed to deploy. Plain HTML/CSS/JS, Google Fonts only.
- Two of the original resource PDFs still carry Jennifer's earlier "Coach Jennifer / Kindness Matters" branding. Swap in rebranded versions when ready.
