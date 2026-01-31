import { BACKEND_TECH_ICON_DEFS } from "./techIconDefs/backend";
import { FRONTEND_TECH_ICON_DEFS } from "./techIconDefs/frontend";
import { PLATFORM_TECH_ICON_DEFS } from "./techIconDefs/platform";
import { TOOL_TECH_ICON_DEFS } from "./techIconDefs/tools";

export const TECH_ICON_DEFS = {
  ...FRONTEND_TECH_ICON_DEFS,
  ...BACKEND_TECH_ICON_DEFS,
  ...PLATFORM_TECH_ICON_DEFS,
  ...TOOL_TECH_ICON_DEFS,
};

export const DEFAULT_TECH_ICON = {
  svgAttrs: {
    viewBox: "0 0 24 24",
    fill: "currentColor",
  },
  nodes: [
    {
      tag: "circle",
      attrs: {
        cx: "12",
        cy: "12",
        r: "10",
      },
    },
  ],
};
