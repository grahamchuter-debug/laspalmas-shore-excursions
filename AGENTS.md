# La Coruña Shore Excursions

World 2.0 editorial cruise planning site for lacorunashoreexcursions.com.

## Key paths

- Homepage: `src/app/page.tsx`
- World 2.0 components: `src/components/SpiritOfLacoruna.tsx`, `HonestAdvice.tsx`, `EditorsChoice.tsx`, `CruisePassengerRatings.tsx`, `ArrivalTimeline.tsx`, `ExcursionCategories.tsx`
- Content generator: `scripts/generate-lacoruna-data.mjs`
- Data: `src/data/`

## Regenerate content

```bash
npm run generate:data
npm run build
```
