# NeuralOps — Futuristic 3D Website

## Requirements
- Node.js 18+

## Local development
```bash
npm install
npm run dev
```

## Production
```bash
npm run build
npm start
```

## Contact API placeholder
This project includes a `/api/contact` endpoint ready for hooking up to an email provider later. See `.env.example`.

## Replace the AI visuals
- Portfolio modal visuals live in `public/visuals/`. You can drop in:
  - `aurora.webp`, `pulse.webp`, `neuralflow.webp`, `helix.webp`
  - If the `.webp` file is missing, the site falls back to the existing `.svg`.
  - To enable loading `.webp` in the UI, set `NEXT_PUBLIC_PREFER_WEBP_VISUALS=1` in Vercel (or `.env.local`).

## Optional hero video background
- Add an AI-generated looping video at `public/videos/hero.mp4`.
- Set `NEXT_PUBLIC_ENABLE_HERO_VIDEO=1` to enable it.
- The site auto-disables the video when the user prefers reduced motion.
