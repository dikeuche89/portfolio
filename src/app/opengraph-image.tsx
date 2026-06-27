import { ImageResponse } from "next/og";
import { site } from "@/data/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.title;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#eae8e4",
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8f8c86",
          }}
        >
          <span>Dike Uche ©</span>
          <span>Portfolio · 2026</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 130, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Design,
          </div>
          <div style={{ fontSize: 130, fontStyle: "italic", letterSpacing: "-0.02em" }}>
            engineered.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(234,232,228,0.2)",
            paddingTop: 28,
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#8f8c86",
          }}
        >
          <span>UX designer × full stack builder</span>
          <span>dikeuche.com</span>
        </div>
      </div>
    ),
    size
  );
}
