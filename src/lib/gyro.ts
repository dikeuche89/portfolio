// Shared device-orientation source. One listener, relative-to-initial-pose tilt,
// with the iOS 13+ permission prompt triggered on the first user gesture.

let started = false;
let active = false;
let baseBeta: number | null = null;
let baseGamma: number | null = null;
let beta = 0; // front/back tilt, clamped degrees
let gamma = 0; // left/right tilt, clamped degrees

const RANGE = 28; // degrees mapped to full deflection

function clamp(v: number, m: number) {
  return Math.max(-m, Math.min(m, v));
}

function onOrient(e: DeviceOrientationEvent) {
  if (e.beta == null || e.gamma == null) return;
  if (baseBeta == null) {
    baseBeta = e.beta;
    baseGamma = e.gamma;
  }
  active = true;
  beta = clamp(e.beta - (baseBeta ?? 0), RANGE);
  gamma = clamp(e.gamma - (baseGamma ?? 0), RANGE);
}

/** Begin listening. On iOS, defers permission to the first touch/click. */
export function initGyro() {
  if (started || typeof window === "undefined") return;
  started = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DOE = window.DeviceOrientationEvent as any;
  if (!DOE) return;

  if (typeof DOE.requestPermission === "function") {
    const ask = () => {
      DOE.requestPermission()
        .then((res: string) => {
          if (res === "granted")
            window.addEventListener("deviceorientation", onOrient);
        })
        .catch(() => {});
    };
    window.addEventListener("touchend", ask, { once: true });
    window.addEventListener("click", ask, { once: true });
  } else {
    window.addEventListener("deviceorientation", onOrient);
  }
}

/** Normalized tilt in [-1, 1]; `active` is false until a reading arrives. */
export function getTilt() {
  return { x: gamma / RANGE, y: beta / RANGE, active };
}
