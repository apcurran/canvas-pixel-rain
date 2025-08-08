// src/main.js
import {
  Application,
} from "pixi.js";

import { imgTitanfallSrc } from "./img-titanfall-base-64-src.js";

/**
 * Canvas size from your original project
 */
const WIDTH = 500;
const HEIGHT = 663;
const TOTAL_PARTICLES = 5000;

/**
 * Create Pixi application and attach to #app
 */
const app = new Application();
await app.init({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 0x000000,
    antialias: true,
});
document.getElementById("app").append(app.canvas);
