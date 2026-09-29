import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon rendered from the LAMHA mark (navy tile, white L-form, two blue nodes). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        {/* Same geometry as the official mark (public/icon.svg): the navy tile IS the icon, no extra padding. */}
        <svg width="180" height="180" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="7" fill="#0B1B3A" />
          <path d="M7 6h5v11l2.5 2.5H26v5H7z" fill="#FFFFFF" />
          <path d="M19.5 7.5l3.5 3.5-3.5 3.5L16 11z" fill="#1769E0" />
          <path d="M25 5l2 2-2 2-2-2z" fill="#2E7CF6" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
