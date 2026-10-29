# Navya Gupta — Portfolio

A colourful static portfolio for Navya Gupta, a third-year bioengineering student at VIT Bhopal exploring non-tech roles in content, creative strategy and coordination.

The current visual direction opens on a transparent upper-body figure with luminous nerves, veins, arteries and organs. Scrolling zooms and crossfades into a brain view, an interior-neuron connection with a travelling impulse, and then a pumping heart with chest context and warm orbiting light. Bright cyan, violet, pink and gold sit on a near-black grainy background. The anatomy remains decorative, with no educational labels. Motion can be paused and respects reduced-motion preferences. See design/VISION.md for reference priorities and access status.

## Development

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

There are no runtime package dependencies or mandatory API keys. The source page renders project stories through JavaScript. The publishing build pre-renders all seven stories, so they also work without JavaScript.

## Publishing build

```sh
node scripts/build.cjs
node scripts/server.cjs
```

Deploy `dist/`. The repository includes Netlify and Vercel build configuration. See [PUBLISHING.md](PUBLISHING.md) for host settings, metadata and publication steps. A public site has not yet been deployed.

## Validation

The development environment supplies Playwright and Chromium:

```sh
node scripts/release.cjs
```

The release suite tests the exact publishing output with deployment headers, a real 404 response, static project stories, canonical/social/sitemap generation, six viewport widths, keyboard navigation, filtering, share links, enquiries, reduced motion and no-JavaScript use. Email-provider calls are intercepted; no test emails are sent.

## Main files

- `index.html`: personal story, approach, work and contact.
- `portfolio.css`: responsive layout, colour and interactions.
- `portfolio.js`: progressive enhancement, navigation, filters, sharing and enquiries.
- `project-views.js`: one project renderer shared by the browser and publishing build.
- `work.js`: self-initiated concept outlines, with founder LinkedIn first.
- `anatomy-scene.js` and `experience.css`: progressive body/brain/heart artwork, scroll-composited camera movement, animated light paths, heartbeat, visibility pausing and manual/reduced-motion controls. This is layered artwork, not a volumetric 3D model.
- `assets/upper-body.webp`, `assets/neural-brain.webp`, `assets/luminous-heart.webp`, `assets/neuron-interior.webp`: matching lossless anatomical artwork. The opening body loads first; close-ups load near their scroll chapters.
- `assets/grain.svg`: static textured overlay.
- `assets/social-preview.png`: checked-in 1200 × 630 social image.
- `scripts/build.cjs`: allowlisted publishing output and automatic host-URL metadata.

The original Studio Navya assets and earlier crystal/heart experiments are retained in the workspace and excluded from the publishing package.

## Content and contact

Project concepts, proposed outputs, illustrative studies and fictional draft writing are identified honestly. No paid client results or unconfirmed credentials are claimed. Academic research remains optional background and does not expose restricted materials.

Public email: `hello@studionavya.com` (confirmed by the user). Direct Web3Forms setup is on hold until the website has a public URL. The email-app/copy fallback remains functional. See [CONTACT_SETUP.md](CONTACT_SETUP.md) to enable live delivery later.

The inspected recordings r11.mp4 and r12again.mp4 informed the synaptic pulse, chest framing, warm orbit paths and slowly drifting cyan neural haze. The interface keeps them as decorative visual treatments. For a local visual-review recording, run `node scripts/record-preview.cjs` after building (requires Chromium, Playwright and system ffmpeg).
