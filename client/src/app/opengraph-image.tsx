import { ImageResponse } from "next/og";

import { site } from "@/content/site";

/**
 * ELYSE DEV — social sharing image.
 *
 * Generated at build time with the site's own colours and typography so shared
 * links look like the product. No external font files are fetched, so the image
 * renders reliably in any environment.
 */
export const alt = `${site.name} — ${site.developerName}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "72px",
          backgroundColor: "#08080b",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(249,115,22,0.30) 0%, rgba(249,115,22,0.06) 38%, rgba(8,8,11,0) 70%), radial-gradient(circle at 92% 96%, rgba(251,146,60,0.20) 0%, rgba(8,8,11,0) 62%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              border: "2px solid rgba(249,115,22,0.45)",
              backgroundColor: "rgba(249,115,22,0.16)",
              color: "#fed7aa",
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            ED
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "-0.5px",
              }}
            >
              <span>ELYSE</span>
              <span style={{ color: "#fb923c" }}>DEV</span>
            </div>
            <div style={{ fontSize: "16px", color: "#9ca3af", letterSpacing: "3px" }}>
              FULL-STACK SOFTWARE DEVELOPER
            </div>
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-2.5px",
              maxWidth: "900px",
            }}
          >
            MURENGERANTWARI Elyse
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#d1d5db",
              lineHeight: 1.4,
              maxWidth: "820px",
            }}
          >
            Modern web applications with React, Next.js, Node.js, Express and PHP —
            built on a real client, server and database.
          </div>
        </div>

        {/* footer chips */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB"].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#d1d5db",
                  fontSize: "20px",
                }}
              >
                {tech}
              </div>
            ),
          )}
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              color: "#9ca3af",
              fontSize: "20px",
            }}
          >
            github.com/ElissaElyse7
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
