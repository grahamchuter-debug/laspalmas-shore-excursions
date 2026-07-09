# Las Palmas Shore Excursions

World 2.0 editorial cruise-planning site for **laspalmasshoreexcursions.com**.

**Positioning:** Gran Canaria: A Miniature Continent in a Cruise Day

## Stack

Next.js 16 (static export) · React 19 · Tailwind v4 · Cloudflare Pages

## Commands

```bash
npm run dev              # Local development
npm run generate:data    # Regenerate src/data/* from scripts/generate-laspalmas-data.mjs
npm run download:images  # Fetch CC images from Wikimedia Commons
npm run build            # Static export to out/
npm run pages:deploy     # Deploy to Cloudflare Pages
```

## World 2.0 homepage sections

1. Emotional hero
2. How Would You Like to Experience Gran Canaria? (`ChooseYourGranCanaria`)
3. Spirit of Gran Canaria (`SpiritOfGranCanaria`)
4. Honest advice — Do you need a shore excursion?
5. Editor's Choice (A Taste of Gran Canaria + Roque Nublo alternative)
6. Excursion categories (8 themed cards)
7. Cruise passenger snapshot
8. Independent Las Palmas guide CTA
9. Comparison guides
10. Cruise schedule / planning hub
11. FAQs
12. Trust signals

## Content

All editorial content lives in `scripts/generate-laspalmas-data.mjs`. Edit there, then run `npm run generate:data`.

## Future

`GranCanariaWowCollection` component holds a placeholder slot for a premium Wow Collection product when a local supplier is confirmed.
