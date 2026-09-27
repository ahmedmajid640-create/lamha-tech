import { cn } from "@/lib/utils";

/**
 * Original hero visual: an abstract connected-systems diagram (nodes, links,
 * data pulses) rendered as inline SVG. Animates subtly; static under reduced motion.
 */
const NODES: { x: number; y: number; r: number; core?: boolean }[] = [
  { x: 300, y: 260, r: 10, core: true },
  { x: 120, y: 120, r: 5 },
  { x: 470, y: 90, r: 6 },
  { x: 560, y: 250, r: 5 },
  { x: 480, y: 430, r: 6 },
  { x: 220, y: 460, r: 5 },
  { x: 70, y: 320, r: 6 },
  { x: 380, y: 160, r: 4 },
  { x: 200, y: 220, r: 4 },
  { x: 400, y: 350, r: 4 },
  { x: 160, y: 380, r: 3 },
  { x: 540, y: 380, r: 3 },
  { x: 40, y: 200, r: 3 },
  { x: 600, y: 140, r: 3 },
];

const LINKS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9],
  [1, 8], [2, 7], [3, 11], [4, 9], [5, 10], [6, 10], [1, 12], [2, 13], [3, 13], [4, 11], [6, 12], [5, 9], [7, 8],
];

export function NetworkVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 540"
      role="img"
      aria-label="Abstract diagram of connected systems"
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <radialGradient id="nv-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7fb0ff" />
          <stop offset="55%" stopColor="#2e7cf6" />
          <stop offset="100%" stopColor="#1769e0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nv-link" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2e7cf6" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#7fb0ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2e7cf6" stopOpacity="0.05" />
        </linearGradient>
        <filter id="nv-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* orbit rings */}
      <g fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1">
        <circle cx="300" cy="260" r="110" />
        <circle cx="300" cy="260" r="190" strokeDasharray="2 6" />
        <circle cx="300" cy="260" r="270" />
      </g>

      {/* links */}
      <g fill="none" strokeWidth="1">
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="rgba(127,176,255,0.28)"
          />
        ))}
      </g>

      {/* animated pulses on primary spokes */}
      <g fill="none" strokeWidth="1.5" strokeLinecap="round">
        {LINKS.slice(0, 9).map(([a, b], i) => (
          <line
            key={`p-${i}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="url(#nv-link)"
            strokeDasharray="30 400"
            className="animate-dash"
            style={{ animationDelay: `${i * -1.3}s`, animationDuration: `${8 + (i % 3) * 2}s` }}
          />
        ))}
      </g>

      {/* nodes */}
      <g>
        {NODES.map((n, i) =>
          n.core ? (
            <g key={i} filter="url(#nv-glow)">
              <circle cx={n.x} cy={n.y} r={54} fill="url(#nv-core)" opacity="0.55" className="animate-pulse-soft" />
              <circle cx={n.x} cy={n.y} r={n.r + 4} fill="#0b1b3a" stroke="#7fb0ff" strokeWidth="1.5" />
              <circle cx={n.x} cy={n.y} r={n.r - 3} fill="#7fb0ff" />
            </g>
          ) : (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={n.r + 6} fill="rgba(46,124,246,0.10)" />
              <circle cx={n.x} cy={n.y} r={n.r} fill="#0b1b3a" stroke="rgba(127,176,255,0.9)" strokeWidth="1.25" />
              <circle cx={n.x} cy={n.y} r={Math.max(1.2, n.r - 3)} fill="#7fb0ff" className="animate-pulse-soft" style={{ animationDelay: `${i * -0.7}s` }} />
            </g>
          ),
        )}
      </g>

      {/* small data labels */}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="10" fill="rgba(200,216,240,0.55)">
        <text x="330" y="252">core</text>
        <text x="130" y="108">api</text>
        <text x="482" y="80">web</text>
        <text x="572" y="246">mobile</text>
        <text x="492" y="450">data</text>
        <text x="232" y="480">cloud</text>
        <text x="30" y="345">qa</text>
      </g>
    </svg>
  );
}
