import { cn } from "@/lib/utils";

/**
 * Conceptual "system layers" diagram used for Products & R&D and the Technology page.
 * Deliberately abstract: it does not depict any confidential internal product.
 */
export function ArchitectureVisual({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const stroke = tone === "dark" ? "rgba(127,176,255,0.55)" : "rgba(23,105,224,0.45)";
  const fill = tone === "dark" ? "rgba(11,27,58,0.9)" : "rgba(245,248,252,1)";
  const text = tone === "dark" ? "rgba(214,226,246,0.85)" : "#162033";
  const muted = tone === "dark" ? "rgba(214,226,246,0.45)" : "#6b7891";
  const layers = [
    { y: 40, label: "Interfaces", sub: "web · mobile · internal tools" },
    { y: 130, label: "Services & APIs", sub: "business logic · integrations" },
    { y: 220, label: "Data & Automation", sub: "storage · pipelines · workflows" },
    { y: 310, label: "Platform", sub: "cloud · security · observability" },
  ];
  return (
    <svg viewBox="0 0 560 400" role="img" aria-label="Layered system architecture diagram" className={cn("h-auto w-full", className)}>
      <defs>
        <linearGradient id="av-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fb0ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#7fb0ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7fb0ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {layers.map((l, i) => (
        <g key={l.label}>
          <rect x="60" y={l.y} width="440" height="64" rx="8" fill={fill} stroke={stroke} strokeWidth="1" />
          <rect x="60" y={l.y} width="4" height="64" rx="2" fill="#2e7cf6" />
          <text x="84" y={l.y + 28} fontSize="14" fontWeight="600" fill={text} fontFamily="inherit">
            {l.label}
          </text>
          <text x="84" y={l.y + 47} fontSize="11" fill={muted} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
            {l.sub}
          </text>
          {/* modules */}
          {[0, 1, 2].map((m) => (
            <rect key={m} x={360 + m * 42} y={l.y + 20} width="30" height="24" rx="4" fill="none" stroke={stroke} strokeOpacity={0.7} />
          ))}
          <rect x={360 + (i % 3) * 42} y={l.y + 20} width="30" height="24" rx="4" fill="#2e7cf6" fillOpacity="0.35" stroke="#7fb0ff" />
          {i < layers.length - 1 && (
            <g>
              <line x1="280" y1={l.y + 64} x2="280" y2={l.y + 90} stroke={stroke} strokeDasharray="3 4" />
              <line x1="280" y1={l.y + 64} x2="280" y2={l.y + 90} stroke="url(#av-beam)" strokeWidth="2" strokeDasharray="10 60" className="animate-dash" style={{ animationDelay: `${i * -2}s` }} />
            </g>
          )}
        </g>
      ))}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" fill={muted}>
        <text x="60" y="26">system.layers</text>
        <text x="440" y="26">v.next</text>
      </g>
    </svg>
  );
}
