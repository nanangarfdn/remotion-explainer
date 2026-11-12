// Batch stills, one bundle: node scripts/stills.mjs <outdir> Comp:f1,f2 [Comp2:f3 ...]   (env SCALE, default 0.5)
// Writes <outdir>/<Comp>_<frame>.png. ~2 s per still after the bundle vs ~10 s each via the CLI.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [outDir, ...specs] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const spec of specs) {
  const [id, frames] = spec.split(":");
  const composition = await selectComposition({ serveUrl, id });
  for (const f of frames.split(",").map(Number)) {
    const output = path.join(outDir, `${id}_${f}.png`);
    await renderStill({ serveUrl, composition, frame: f, output, scale: Number(process.env.SCALE ?? 0.5) });
    console.log(output);
  }
}
