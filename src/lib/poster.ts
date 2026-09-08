export const POSTER_WIDTH = 1200;
export const POSTER_HEIGHT = 1500;

export const POSTER_PALETTES = [
  { name: "Paper", background: "#e8e3d8", ink: "#25251f", accent: "#da421f" },
  { name: "Ember", background: "#ed4b29", ink: "#231c19", accent: "#f5e9d2" },
  {
    name: "Midnight",
    background: "#20251f",
    ink: "#e8e3d8",
    accent: "#c7dc9c",
  },
] as const;

export type PosterState = {
  words: string;
  tension: number;
  palette: number;
  variation: number;
  point: { x: number; y: number };
};

export type PosterFonts = { sans: string; mono: string };

export const INITIAL_POSTER: PosterState = {
  words: "MAKE WAVES",
  tension: 48,
  palette: 0,
  variation: 1,
  point: { x: 0.58, y: 0.46 },
};

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export function posterWords(words: string) {
  return words.trim().replace(/\s+/g, " ").toLocaleUpperCase() || "MAKE WAVES";
}

// Preview and export share one renderer, including the visitor's final pull point.
export function drawPoster(
  canvas: HTMLCanvasElement,
  state: PosterState,
  fonts: PosterFonts,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  const palette = POSTER_PALETTES[state.palette] ?? POSTER_PALETTES[0];
  const words = posterWords(state.words);
  const tension = clamp(state.tension / 100);
  const scale = canvas.width / POSTER_WIDTH;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.moveTo(70, 154);
  ctx.lineTo(1130, 154);
  ctx.moveTo(70, 1310);
  ctx.lineTo(1130, 1310);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = palette.ink;
  ctx.font = `500 22px ${fonts.mono}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("AFTER HOURS", 70, 95);
  ctx.textAlign = "right";
  ctx.fillText(`STUDY / ${String(state.variation).padStart(3, "0")}`, 1130, 95);
  ctx.textAlign = "left";

  const strip = document.createElement("canvas");
  strip.width = 1060 * scale;
  strip.height = 170 * scale;
  const type = strip.getContext("2d");
  if (!type) throw new Error("Canvas is unavailable");
  type.font = `900 150px ${fonts.sans}`;
  const metrics = type.measureText(words);
  const left = Math.max(0, metrics.actualBoundingBoxLeft);
  const width = Math.max(1, metrics.actualBoundingBoxRight + left);
  const ascent = metrics.actualBoundingBoxAscent || 110;
  const descent = metrics.actualBoundingBoxDescent || 0;
  const phase = (state.variation - 1) * 1.47;

  ctx.save();
  ctx.beginPath();
  ctx.rect(60, 177, 1080, 1110);
  ctx.clip();
  for (let row = 0; row < 7; row++) {
    type.setTransform(1, 0, 0, 1, 0, 0);
    type.clearRect(0, 0, strip.width, strip.height);
    type.save();
    type.scale((1050 * scale) / width, (142 * scale) / (ascent + descent));
    type.font = `900 150px ${fonts.sans}`;
    type.fillStyle = row === 3 ? palette.accent : palette.ink;
    type.strokeStyle = palette.ink;
    type.lineWidth = 0.9;
    if (row === 0 || row === 6) type.strokeText(words, left + 2, ascent + 4);
    else type.fillText(words, left + 2, ascent + 4);
    type.restore();

    const rowY = 244 + row * 139;
    const sliceWidth = scale > 1 ? 0.5 : 2;
    for (let x = 0; x < 1060; x += sliceWidth) {
      const nx = x / 1060;
      const wave = Math.sin(nx * Math.PI * 2 + phase + row * 0.34);
      const proximity = Math.exp(-Math.pow((nx - state.point.x) * 3.6, 2));
      const pull = (state.point.y - 0.5) * 360 * proximity;
      const offsetY = tension * (wave * 66 + pull);
      const bend =
        Math.sin(nx * Math.PI) * (state.point.x - 0.5) * 150 * tension;
      const height =
        170 * (1 + tension * 0.22 * Math.cos(nx * Math.PI * 2 + phase));
      // Slight overlap avoids hairline seams between warped strips.
      ctx.drawImage(
        strip,
        x * scale,
        0,
        sliceWidth * scale,
        170 * scale,
        70 + x + bend,
        rowY + offsetY,
        sliceWidth + 0.4 / scale,
        height,
      );
    }
  }
  ctx.restore();

  ctx.fillStyle = palette.ink;
  ctx.font = `400 20px ${fonts.mono}`;
  ctx.fillText("A LITTLE ORDER. A LITTLE INSTINCT.", 70, 1370);
  ctx.textAlign = "right";
  ctx.fillText(`TENSION ${String(state.tension).padStart(2, "0")}`, 1130, 1370);
  ctx.textAlign = "left";
  ctx.globalAlpha = 0.7;
  ctx.font = `400 18px ${fonts.mono}`;
  ctx.fillText("Made in Dike’s playground", 70, 1432);
  ctx.textAlign = "right";
  ctx.fillText("dikeuche.com", 1130, 1432);
  ctx.textAlign = "left";
  ctx.globalAlpha = 1;
}
