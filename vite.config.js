import { defineConfig } from "vite";
import UnpluginInjectPreload from "unplugin-inject-preload/vite";

import plans from "./plans/plans.json";

const defaultPlanTypeName = plans[0].name;

export default defineConfig({
  assetsInclude: ["plans/**/*.png"],
  plugins: [
    // Add <link rel="preload" href="*.map-[hash].png">
    UnpluginInjectPreload({
      files: [
        {
          outputMatch: new RegExp(`${defaultPlanTypeName.replace(/ /g, ".")}\\.map-[a-zA-Z0-9_-]+\\.png$`),
          attributes: {
            as: "image",
            type: "image/png",
          },
        },
      ],
    }),
  ],
});
