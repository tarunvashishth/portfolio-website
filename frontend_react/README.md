# Portfolio — frontend

React (Create React App) + Framer Motion, with content served from the Sanity
studio in `../backend_sanity`.

## Scripts

```bash
npm install
npm start       # dev server on http://localhost:3000
npm run build   # production build in ./build
```

## Environment

Copy `.env.example` to `.env` if you need to override anything:

| Variable | Purpose |
| --- | --- |
| `REACT_APP_SANITY_PROJECT_ID` | Sanity project to read from (defaults to the public `hcbvv03q` dataset). |
| `REACT_APP_CONTACT_FORM_ENDPOINT` | Optional form backend (e.g. Formspree) that accepts a JSON `POST` of `{ name, email, message }`. When unset, the contact form opens the visitor's email app with the message pre-filled. |

## Editing content

- **Personal details, copy, socials and nav** — `src/constants/profile.js`.
- **About cards, projects, skills and experience** — managed in Sanity
  (`abouts`, `works`, `skills`, `experiences`). Project tags `AI App` and
  `Web App` drive the filters on the Work section.

## What's in here

- `src/components/` — shared UI: navbar, ⌘K command palette, cursor follower,
  neural-network hero canvas, scroll-velocity marquee, section headings,
  toaster, etc.
- `src/container/` — page sections (Header, About, Work, Skills, Contact,
  SiteFooter, and a Testimonial section that is currently not rendered).
- `src/hooks/` — theme provider (dark/light with a View Transition reveal),
  cached Sanity queries, active-section tracking, media queries.

Motion respects `prefers-reduced-motion`, and the theme follows the OS until
the visitor picks one.
