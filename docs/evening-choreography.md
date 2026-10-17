# Scroll-driven evening at Studio Navya

The original room stays pinned as one visual. The same native vertical scroll position controls all actions, and scrolling upward rewinds them. No timer advances the story.

| Scroll progress | Action |
| --- | --- |
| 0–52% | The sun physically lowers behind the skyline while the sky cools. |
| 24–88% | Desk lamp glow and fairy lights intensify as room daylight fades. |
| 25–57% | Retriever opens its eyes, lifts its head and stands. |
| 57–83% | Retriever steps down in a small arc and settles on the rug. |
| 14–82% | The wine level lowers to an empty glass. |
| 23–89% | Paper roll travels to the desk edge, drops, rolls across the floor and unfurls. |
| 55–83% | A wine-coloured linen pillow falls from the chair and settles beside it. |
| 53–100% | Stars and a crescent moon appear through the existing window. |

The story is defined in evening.js and evening.css, with SVG composition in hero-art.js. Native scene snapshots and DOM checks were used for geometry, frame continuity, asset loading and style precedence. Browser pixel validation was unavailable. Reduced motion uses settled scene states. Room-view and night-preview controls reuse the same composition. The manual retriever greeting temporarily raises its head without advancing the timeline.

The original room, vase, sleeping retriever and dreamcatcher bitmap assets are unchanged. The typography remains the two-family DM Serif Display / Inter system.

## Retriever asset generation

Mode: built-in image_gen. These are new poses of the original retriever, not replacements for the room image. Generated transparent PNGs were encoded as WebP at their original 1536 × 1024 dimensions for website delivery; alpha is retained.

Saved project assets:

- /workspace/sites/studio-navya-fonts/assets/img/retriever-awake.webp
- /workspace/sites/studio-navya-fonts/assets/img/retriever-standing.webp

Both calls used the existing sleeping-retriever.webp as the edit target and sunset-studio.webp as the style/lighting reference.

### Awake pose

Use case: precise-object-edit. Asset type: transparent character pose for a scroll-animated cozy studio website. Image 1 is the edit target: the existing sleeping golden retriever. Image 2 is a style and lighting reference only, the existing painted studio. Change the dog's pose to lying awake in a relaxed sphinx position, chest raised, front paws forward, head lifted, facing toward the left in the same slightly elevated three-quarter view. Preserve this exact dog's identity, golden coat, muzzle, soft floppy ears, tail, realistic proportions and fine painterly fur; make its eyes gently open, mouth closed. Match the warm amber/copper painted realism and soft texture of the existing artwork. Single full dog only, all paws, ears and tail visible with room around the silhouette. Landscape 1536 by 1024 composition, dog fills approximately 85 percent of width. Genuine transparent background, retain fine fur alpha, no scene, no chair, no floor, no props, no opaque glow or backdrop, no lettering, no watermark. This is a cutout layer to blend into the original room; do not redesign the animal or make it a cartoon or 3D toy.

### Standing pose

Use case: precise-object-edit. Asset type: transparent character pose for a scroll-animated cozy studio website. Image 1 is the edit target: the existing sleeping golden retriever. Image 2 is a style and lighting reference only, the existing painted studio. Change only the dog's pose: the same golden retriever is awake and standing on all four paws, facing left in a slightly elevated three-quarter side view, ready to step down from an armchair. Natural relaxed posture, head lowered slightly, mouth closed, one front paw a little forward. Preserve this exact dog's golden coat, face, floppy ears, full fluffy tail and realistic adult dog proportions. Match the warm amber/copper painted realism and soft fine fur texture of the existing artwork. Single full dog only, all legs, paws, ears and tail entirely visible, clear negative space around silhouette. Landscape 1536 by 1024 composition, dog fills approximately 85 percent of width and 75 percent of height. Genuine transparent background, preserve soft fur alpha, no room, chair, floor, props, opaque shadow, text or watermark. Do not create a cartoon or toy; this is a character state of the same original dog.

