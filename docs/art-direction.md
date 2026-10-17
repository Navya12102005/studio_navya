# An evening at Studio Navya

Visual direction: a warm editorial storybook room at sunset, with a golden retriever, a writing desk, wine, books, a hanging dreamcatcher, fairy lights by the window and soft lamplight. Narration uses live HTML text; no generated lettering is relied on.

Artwork was created with the built-in image generation tool. The room and retriever are separate assets. Original outputs remain intact; the website uses WebP encodings for faster loading. The original cat variant was superseded and is not referenced by the site.

## Final project assets

- assets/img/sunset-studio.webp — 1672 × 941, full room scene.
- assets/img/sleeping-retriever.webp — 1536 × 1024, transparent golden retriever layer.
- room.js — SVG composition, dreamcatcher, lamplight, dust and sleeping companion.
- motion.css and motion.js — camera, letters, notebook, flying notes, plane and story transitions.

## Room generation prompt

Use case: illustration-story. Asset type: full-bleed landscape website hero and scrollable cinematic scene, wide 16:9 composition. Create a sophisticated hand-painted gouache and colored-pencil illustration of a cozy independent creative writer's studio at golden sunset. Beautiful slightly imperfect ink contours, visible dry brush, paper grain, warm editorial picture-book art for an adult design portfolio, tender lived-in feeling, intentional asymmetry and nuanced earthy colors. The room is viewed straight-on in a slightly elevated wide shot. LEFT 42 percent is a calm deep cocoa/plum plaster wall in shadow, low detail, clear negative space for large white website headline; only a few quiet framed sketches far upper left. RIGHT 58 percent: a large arched wooden window showing an apricot sunset sun, amber peach sky, distant olive treetops and rooftops, soft wine-colored linen curtains, a walnut writing desk below window with an open cream notebook, handwritten-looking abstract marks without readable letters, a fountain pen, stacked olive and burgundy books, a half-full glass of red wine on a coaster, small lit brass shaded desk lamp, terracotta plant. At far right a low armchair upholstered in ochre with an ivory blanket; the chair seat should be EMPTY to later place an animated cat layer. A warm small bookshelf and books on right wall, a soft textured rug at bottom. Leave a clear patch on upper right wall beside window for a separate hanging dreamcatcher overlay. Strong but soft golden window light streaking across the desk and floor; lovely shadow shapes. Palette: burnt apricot, terracotta, burgundy wine, warm walnut cocoa, dusty sage, parchment, antique gold. Storybook movie still, expressive cozy room, warm and tactile, elegantly composed, not photorealistic, not glossy 3D, not flat corporate vector art, no neon, no sterile UI, no text, no lettering, no logos, no watermark, no people, no cats, no hanging dreamcatcher. Final asset only, no website mockup or borders. High detail at the desk, atmospheric elsewhere.

## Retriever generation prompt

Use case: illustration-story. Create a standalone transparent-background cutout asset of ONE young adult golden retriever dog sleeping curled up into a compact oval, head resting on tucked front paws, eyes closed, soft floppy ears, fluffy golden tail curled near hind legs. The entire dog including tail and all paws is inside frame. Side three-quarter view slightly from above, face toward left, compact horizontal composition, relaxed and sweet without exaggerated cartoon eyes. It will be placed on the ochre armchair seat in the supplied cozy sunset studio reference. The supplied image is STYLE AND LIGHTING REFERENCE ONLY: match its warm textured gouache, colored-pencil and fine ink editorial storybook painting style, rich honey golden fur, muted cream muzzle, slightly imperfect brush texture, gentle amber sunset rim light from upper left, soft cocoa shadows. Dog only; no background, no pillow, no chair, no floor, no room, no cast shadow plane, no border, no lettering. Actual transparent alpha background with clean silhouette and natural fur edge. Minimal transparent padding, no orange halo haze, no photorealism, no 3D rendering.

## Narrative

6:12 PM — An idea arrives. A sealed letter lifts into the room.

6:26 PM — The notebook opens. Positioning and writing give the idea a voice.

7:03 PM — Words find their wings. Social, LinkedIn and email become connected messages.

7:21 PM — The lamp stays on. A signed note invites the visitor to begin their own project.

## Accessibility and behavior

Native scrolling and scene links remain available. Visitors can pause ambient movement. Reduced-motion preferences remove continuous animation and camera movement while showing the relevant props as discrete scene states. No audio autoplays. Story text stays readable without animation; the service details and portfolio remain independently accessible from navigation.

## Verification limit

Assets were inspected and DOM/state behavior was tested. Browser rendering and precise desktop/mobile composition could not be visually verified because the supported browser QA capability is unavailable.

Window fairy lights are live SVG overlays: 22 bulbs with subtle amber glow, a slow brightness variation and increased warmth toward evening. Ambient pause and reduced motion include these lights.

## Living room revision

The scene now uses separate SVG planes in CSS 3D perspective: background/window, desk/lamp/vase, armchair/retriever, and hanging details. The desk and armchair are clipped from the original artwork against the clean background plate. This keeps their appearance consistent while permitting independent movement. Camera look-around is bounded to ±8 degrees horizontally and ±4.5 degrees vertically; it is a layered illustrated diorama.

The native vertical wheel path is never prevented. Horizontal wheel input, Shift+wheel and pointer drags adjust the look-around camera. Diagonal wheel input changes the view while its vertical part continues page scrolling. Touch uses pan-y, preserving vertical page navigation. Arrow keys work when the view is focused; Home resets. Explore mode hides the opening copy, Escape restores it, and fullscreen is available when the browser permits it.

New assets:
- assets/img/studio-clean.webp — 1672 × 941, background without furniture and internal glazing bars.
- assets/img/dreamcatcher-woven.webp — 793 × 1983, detailed transparent rattan, beads, cord and feathers.
- assets/img/flower-vase.webp — 1024 × 1536, transparent bouquet and amber vase.

Large-screen support includes media queries for 2200px and wider, scalable SVG geometry, fullscreen view and larger reading text. The texture artwork retains its generated resolution; it is not native 4K. A 3840 × 2160 generation was requested but the returned file remained 1672 × 941; that unused variant is not referenced by the site.

### Clean background prompt

Use case: precise-object-edit. Edit target: supplied sunset studio painting. Create a clean background plate for a layered animation. Keep EXACT same wide composition, camera, room geometry, warm textured painting style, sunset view, wall, window position, curtain positions, bookshelf, rug and overall lighting. REMOVE only the walnut writing desk and ALL objects on that desk (lamp, notebook, books, pen, wine glass, potted desk plant), the central wooden desk chair and its blanket, and the ochre upholstered armchair at far right. Remove their shadows and reveal plausible continuous wooden floor and wall behind. Leave the bookshelf, left floor plant, little floor books/basket and rug where they are. In the large arched window remove only the INTERNAL vertical/horizontal wooden glazing bars and central handles, so the outside view is uninterrupted within the same thick OUTER wooden arch. Preserve the outer arch, side trim and sill. Do NOT remove the outer window frame, curtains or sunset view. We will add opening casement panes and original furniture as separate layers. Keep the empty calm cocoa left wall, no new decorative objects, no flowers, no dreamcatcher, no cats or dogs, no lettering. Exact same 16:9 full image framing. This is a background-only cleanup, not a redesign.

### Woven dreamcatcher prompt

Use case: illustration-story. Create a highly detailed realistic craft cutout of ONE small handmade dreamcatcher on a truly transparent background. Natural rattan hoop wrapped in fine suede cord, intricate delicate woven radial spiderweb with tiny imperfect knots, three fine hanging cords with amber and cream wooden beads and THREE long soft realistic pheasant / cream feathers with individual barbs and slightly frayed edges. A thin hanging loop above. Natural antique gold, ivory, warm tan and muted terracotta accents. Front view, complete object in frame, vertical 1:2.5 silhouette, minimum transparent padding. Real handcrafted material detail, warm sunset illumination from left matching the supplied room (style and lighting reference only). More dimensional and believable than a geometric icon. Do not draw a five-point star or polygon web. Fine botanical/editorial textured painterly realism, no photoreal glossy stock cutout, no 3D. No wall, no floor, no room, no people, no text, no halo, no shadow plane. The reference is not an edit target: generate this new object only.

### Flower vase prompt

Use case: illustration-story. Create ONE transparent-background cutout asset: a small softly ribbed amber-glass flower vase holding a loose, elegant bunch of five or six cottage-garden flowers: muted peach cosmos, a cream daisy, one soft wine-red bloom, airy little buds and delicate olive green stems. Entire bouquet AND vase visible in frame, relaxed asymmetrical natural arrangement, modest amount of flowers, not a dense florist bouquet. The glass vase should be about the bottom third of the asset, flower stems and blooms in the upper two thirds. Slightly elevated front three-quarter view, seen as if sitting on the supplied room's writing desk. Match its warm gouache, colored-pencil and ink textured editorial storybook realism, subtle irregular brush texture, sunset rim light from upper left. True transparent alpha background. No desk, no room, no floor, no text, no additional props, no black background, no broad shadow or orange halo haze. Portrait composition, minimal transparent padding. Supplied room is a style, perspective and lighting reference, not an edit target.

### 4K generation request

Use case: precise-object-edit. Edit target is this exact empty sunset studio background plate. Produce a native 4K 3840x2160 landscape version for a 4K-screen website scene. Preserve the EXACT room composition, camera angle, window size and position, colors, sunset, floor, rug, all architecture, curtain and bookshelf placement, and empty areas. Only increase resolved detail, subtle material texture and edge quality at 3840 by 2160 pixels. The internal window has no glazing bars; keep it that way. Keep floor empty: NO desk, NO armchair, NO chair, NO lamp, NO dog, NO vase, NO dreamcatcher, NO text. Do not change the framing or add props. High-quality warm gouache / editorial painterly realism, natural paper texture, no oversharpening and no gloss. Output the full wide 16:9 frame at 3840x2160 pixels.

Room controls, native vertical scrolling, diagonal/horizontal gestures, pointer drag, keyboard bounds, explore/exit, reset, breeze, ambient pause, reduced motion and the original service/portfolio/editor behavior are covered by 26 DOM-based functional checks. Visual browser QA remains unavailable.


## Current revision — a quiet 360° evening

The earlier layered diorama described above has been superseded by a full Three.js room, with furniture on all four sides, an opening window wall, floor and ceiling. The generated painting is now the fallback rather than the 3D scene. All current 3D geometry and material patterns are authored in assets/scene/studio.js. Three.js 0.186.1 is vendored locally with its MIT license.

The room keeps warm walnut, wine velvet, parchment linen, olive and aged brass. The composition leaves the writing desk and retriever visible to the right of sparse floating text. Chapters use short lines, serif italics, a muted handwritten accent and generous space. Paper-card overlays and flying 2D props are removed from the live HTML. Secondary controls sit inside a room-settings menu.

Vertical progress drives a reversible evening: chair pulls out → dog wakes → dog stands and walks → peach sky becomes blue night → fairy lights, desk lamp, floor lamp and pendant glow. Wind deforms linen mesh vertices, opens casement pivots, sways the suspended wire and woven hoop, moves five individually hinged feathers and the flower stems. The dog has articulated legs, knees, ears, head and tail. It is a crafted stylized golden retriever, not a scanned photoreal animal. Dog floor clearance is checked through the rise and walk.

Horizontal and diagonal inputs rotate a real perspective camera around an unlimited horizontal axis, with bounded up/down look. Native vertical wheel scrolling is preserved. There is no automatic camera orbit. The room renderer supports native 4K canvas dimensions on 4K screens and caps high-DPI work to 8.3 million pixels; the material textures are not claimed as native 4K photography.

Ten geometry/choreography checks and 24 DOM functional checks cover the current implementation. The supported visual browser capability was unavailable, so exact rendered appearance and device performance remain unverified.


## Current narrator — one handwritten diary

The floating standalone story copy from the previous revision is replaced by one persistent open diary. It has a wine leather cover, cream paper, a center gutter, visible page edges, a ribbon, quiet botanical/book sketches and a turning leaf. It drifts and rotates slightly as scroll progress changes; chapter text writes itself in locally served Caveat. The diary stays in one fixed overlay through the introduction and story, then gives way to its later content pages. Portfolio, services, process, proposals, FAQ, contact and individual projects all use the same paper and handwriting treatment. There are no separate visible narration cards. The old scene panels remain only as hidden content templates and scroll markers.

The earlier small 3D desk notebook is hidden so the narration has a single diary. The background room, 360 camera and scroll-driven evening remain. The handwriting uses Caveat regular and semibold, obtained from Google Fonts and self-hosted with the SIL Open Font License in assets/fonts/CAVEAT-OFL.txt. The diary illustration and page details are native HTML/CSS/SVG; no new raster generation was used.

Mobile line lengths were estimated using the actual local font metrics at 320, 375 and 430px viewport widths. Ten geometry checks and 26 DOM checks pass; visual browser rendering remains unverified because the supported browser capability was unavailable.


## Correction — restore the room, keep the diary small

The opening page again uses the original warm sunset artwork and its illustrated prop layers from the earlier living-room revision. The default opening view is no longer replaced by the new modeled scene. Three.js is used for the opening room only after Explore 360° is selected; story scenes retain their 3D choreography.

The diary is confined to the left edge, 286px square on desktop and up to 224 × 256px on phones. Its entries are shortened and its scroll motion is limited to seven vertical pixels and a small rotation. It does not travel across the middle of the room. The oversized diary wrapper and handwriting applied across the portfolio and project pages have been removed; their prior editorial layouts are restored. The original image assets are unchanged.
