# Center Croissant Al Sheikh - Website + Digital Menu Board

Production-ready Next.js app for a croissant shop website, live digital menu board, and admin CMS. It deploys to Vercel with the API backend running as Vercel Functions and the small CMS dataset stored in Vercel Edge Config.

## What is included

- Responsive marketing website with menu, reviews, branches, gallery, and call-to-action sections.
- Full-screen digital menu board at `/board` for TVs, tablets, and kiosk browsers.
- Admin CMS at `/admin` for menu prices, availability, board ticker, branches, reviews, and brand copy.
- Backend API routes under `/api/*`, deployable on Vercel only.
- Vercel Edge Config read/write persistence through Vercel REST API.
- Local seed fallback, optimized WebP assets, tests, TypeScript, accessibility-friendly markup, and security headers.

## Important price note

The project ships with editable prices seeded from public references and the screenshots/reviews you provided. Because official current branch pricing was not publicly verifiable from the provided material, confirm prices with the owner before taking live orders.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

- Website: http://localhost:3000
- Digital menu board: http://localhost:3000/board
- Admin: http://localhost:3000/admin

Admin login requires `ADMIN_PASSWORD` and `AUTH_SECRET` in `.env.local`.

## Vercel-only backend setup

This project intentionally does not use Supabase, Firebase, Railway, Render, or a custom VPS.

For persistent production edits, create one Vercel Edge Config store:

1. Go to your Vercel project dashboard.
2. Open **Storage** and create/connect an **Edge Config** store.
3. Create a read token and set these Vercel environment variables:
   - `EDGE_CONFIG_ID`
   - `EDGE_CONFIG_READ_TOKEN`
   - `VERCEL_API_TOKEN`
   - `EDGE_CONFIG_TEAM_ID` only if your store is team-scoped
   - `EDGE_CONFIG_KEY=croissant_site_content`
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy to Vercel.
5. Seed initial content once:

```bash
npm run seed:edge
```

Or log in to `/admin` and click **Publish** after editing.

## Deployment

```bash
npm install -g vercel
vercel link
vercel env pull .env.local
npm run test
npm run typecheck
npm run build
vercel --prod
```

GitHub integration is recommended: push to `main`, Vercel builds and deploys automatically. Preview deployments are created for pull requests.

## Architecture

```text
Next.js App Router
├── app/page.tsx             Public website
├── app/board/page.tsx       TV/kiosk board
├── app/admin/page.tsx       Authenticated CMS
├── app/api/content          Public JSON API
├── app/api/admin/*          Login + protected write API
├── lib/store.ts             Edge Config adapter + seed fallback
├── lib/auth.ts              Signed HTTP-only cookie auth
├── data/seed.ts             Initial content and prices
└── public/media             Optimized local brand assets
```

## Security

- Admin route protected by signed, HTTP-only, same-site cookies.
- Password is stored only as an environment variable.
- Edge Config write requires a Vercel API token and runs server-side only.
- Public routes never expose admin credentials.
- Security headers are defined in `vercel.json`.

## Testing

```bash
npm run test
npm run typecheck
npm run build
```

Add Playwright or Cypress before launch if you want visual regression testing on the TV board.
