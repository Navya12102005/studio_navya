# Publishing the Next.js portfolio

The active application uses the Next.js App Router. Do not deploy the legacy `index.html` or `dist/` folder.

## Verify locally

```sh
npm ci --ignore-scripts
npm run build
npm test
npm start
```

Next.js requires Node 20.9+; use Node 24 as in the prepared environment. The supported Webpack build backend avoids this environment's Turbopack CSS-worker socket restriction.

## Vercel

The anatomy preview uses branch `codex/anatomy-flight-preview`. Select that branch rather than an older marketing-site branch. Saving a cloud environment does not deploy a website.

- Framework: **Next.js**
- Install command: `npm ci --ignore-scripts`
- Build command: `npm run build`
- Output directory: `.next`, explicitly declared in vercel.json to override older static `dist` settings.

`vercel.json` records the framework and commands. Response headers are configured in `next.config.mjs`, with Next-compatible script policy. GitHub is connected to Vercel preview checks. Confirm the deployed source commit in Vercel; local build success alone does not establish live deployment success.

## Netlify

The included `netlify.toml` uses the Next.js runtime plugin and `.next` output. Install dependencies, run `npm run build`, and let Netlify's Next.js runtime serve the application. Do not upload `.next` as a static folder to Netlify Drop.

## Other Node hosts

Run `npm ci --ignore-scripts`, `npm run build`, then `npm start` behind the host's HTTPS proxy. Configure its `PORT` environment variable if required. The application serves its own assets.

## Contact

No email API secret is required. The form prepares a draft, then lets the visitor open their email app or copy the message. Nothing is sent by the server. A future delivery integration would require a separate configured provider and a verified recipient.

## After deployment

Check the source branch, title, anatomical opening, both domain tabs, project dialogs, mobile layout, motion pause, reduced-motion layout and contact draft. Browser-test results in this workspace do not establish that a public deployment has been created or checked.
