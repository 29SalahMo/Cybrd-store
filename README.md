C¥BRD Storefront (Frontend)

A streetwear + cyberpunk themed storefront with a 3D hoodie background and a spinning top-center logo. Built with React, Vite, Tailwind and react-three-fiber.

Quick start

```bash
# from the project root (H:\\brand)
cd web
npm i
npm run dev
```

Open the printed local URL to view.

Notes
- The spinning logo uses your file at `lOGO/image.png`.
- The 3D hoodie is loaded from a public GLB URL. Replace it with your own model by dropping a `hoodie.glb` into `public/` and updating `src/modules/three/Scene.tsx`.
- Colors: ink (matte black), bone, burgundy, neon cyan and electric magenta.

Intro video (optional)
- Place your video at `public/intro/intro.mp4`.
- On load, you’ll see a full-screen intro with an ENTER button (center) and “Skip Intro” (top-left). Clicking ENTER starts playback; the site fades in when the video ends.

Build
```bash
npm run build && npm run preview
```


