import type { ServiceVisualKind } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Service-specific hero visuals: original, abstract, technical illustrations.
 * Software pages use code/UI imagery, design pages use interface systems, branding
 * uses identity boards, strategy/SEO/analytics use diagrams and data visualizations.
 */
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const STROKE = "rgba(127,176,255,0.5)";
const FAINT = "rgba(127,176,255,0.18)";
const PANEL = "rgba(11,27,58,0.85)";
const TXT = "rgba(214,226,246,0.8)";
const BLUE = "#2e7cf6";
const LIGHT = "#7fb0ff";

function Frame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <>
      <rect x="20" y="20" width="520" height="360" rx="12" fill={PANEL} stroke={STROKE} />
      <line x1="20" y1="56" x2="540" y2="56" stroke={FAINT} />
      <circle cx="42" cy="38" r="4" fill={FAINT} />
      <circle cx="56" cy="38" r="4" fill={FAINT} />
      <circle cx="70" cy="38" r="4" fill={FAINT} />
      <text x="100" y="42" fontSize="11" fill={TXT} fontFamily={MONO}>
        {title}
      </text>
      {children}
    </>
  );
}

function CodeVisual() {
  const lines = [
    { w: 120, i: 0, c: LIGHT }, { w: 220, i: 1 }, { w: 180, i: 1, c: BLUE }, { w: 260, i: 2 }, { w: 140, i: 2 },
    { w: 90, i: 1 }, { w: 200, i: 1, c: BLUE }, { w: 240, i: 2 }, { w: 60, i: 0, c: LIGHT }, { w: 190, i: 1 }, { w: 130, i: 1 },
  ];
  return (
    <Frame title="system.config.ts">
      {lines.map((l, k) => (
        <g key={k}>
          <text x="40" y={90 + k * 24} fontSize="10" fill={FAINT} fontFamily={MONO}>{String(k + 1).padStart(2, "0")}</text>
          <rect x={70 + l.i * 22} y={82 + k * 24} width={l.w} height="8" rx="4" fill={l.c ?? "rgba(214,226,246,0.35)"} opacity={l.c ? 0.9 : 1} />
        </g>
      ))}
      <rect x="360" y="90" width="160" height="240" rx="8" fill="rgba(5,11,24,0.6)" stroke={FAINT} />
      <text x="376" y="114" fontSize="10" fill={TXT} fontFamily={MONO}>const system = {"{"}</text>
      <text x="392" y="138" fontSize="10" fill={LIGHT} fontFamily={MONO}>scalable: true,</text>
      <text x="392" y="162" fontSize="10" fill={LIGHT} fontFamily={MONO}>secure: true,</text>
      <text x="392" y="186" fontSize="10" fill={LIGHT} fontFamily={MONO}>testable: true,</text>
      <text x="392" y="210" fontSize="10" fill={LIGHT} fontFamily={MONO}>builtFor: &apos;growth&apos;</text>
      <text x="376" y="234" fontSize="10" fill={TXT} fontFamily={MONO}>{"}"};</text>
      <rect x="376" y="296" width="60" height="18" rx="4" fill={BLUE} opacity="0.9" />
      <text x="386" y="309" fontSize="9" fill="#fff" fontFamily={MONO}>deploy</text>
    </Frame>
  );
}

function WebVisual() {
  return (
    <Frame title="https://your-platform.example">
      <rect x="40" y="76" width="480" height="60" rx="8" fill="rgba(46,124,246,0.18)" stroke={FAINT} />
      <rect x="56" y="92" width="180" height="10" rx="5" fill={LIGHT} />
      <rect x="56" y="110" width="120" height="8" rx="4" fill="rgba(214,226,246,0.35)" />
      <rect x="430" y="92" width="74" height="26" rx="5" fill={BLUE} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={40 + i * 164} y="152" width="152" height="110" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
          <rect x={56 + i * 164} y="168" width="24" height="24" rx="6" fill="rgba(46,124,246,0.35)" />
          <rect x={56 + i * 164} y="204" width="100" height="8" rx="4" fill="rgba(214,226,246,0.5)" />
          <rect x={56 + i * 164} y="220" width="120" height="6" rx="3" fill="rgba(214,226,246,0.25)" />
          <rect x={56 + i * 164} y="232" width="80" height="6" rx="3" fill="rgba(214,226,246,0.25)" />
        </g>
      ))}
      <rect x="40" y="280" width="300" height="80" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      <polyline points="56,340 100,320 140,330 190,300 240,310 290,290 324,296" fill="none" stroke={LIGHT} strokeWidth="2" />
      <rect x="356" y="280" width="164" height="80" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      <text x="372" y="306" fontSize="10" fill={TXT} fontFamily={MONO}>LCP  ok</text>
      <text x="372" y="326" fontSize="10" fill={TXT} fontFamily={MONO}>CLS  ok</text>
      <text x="372" y="346" fontSize="10" fill={TXT} fontFamily={MONO}>INP  ok</text>
    </Frame>
  );
}

function MobileVisual() {
  return (
    <>
      <rect x="20" y="20" width="520" height="360" rx="12" fill={PANEL} stroke={STROKE} />
      <rect x="190" y="36" width="180" height="330" rx="26" fill="rgba(5,11,24,0.8)" stroke={STROKE} />
      <rect x="250" y="48" width="60" height="8" rx="4" fill={FAINT} />
      <rect x="206" y="72" width="148" height="70" rx="10" fill="rgba(46,124,246,0.22)" />
      <rect x="220" y="88" width="80" height="8" rx="4" fill={LIGHT} />
      <rect x="220" y="104" width="110" height="6" rx="3" fill="rgba(214,226,246,0.35)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="206" y={156 + i * 42} width="148" height="32" rx="8" fill="rgba(255,255,255,0.04)" stroke={FAINT} />
          <circle cx="222" cy={172 + i * 42} r="7" fill="rgba(46,124,246,0.5)" />
          <rect x="238" y={168 + i * 42} width="70" height="7" rx="3" fill="rgba(214,226,246,0.5)" />
        </g>
      ))}
      <rect x="206" y="330" width="148" height="24" rx="8" fill={BLUE} />
      {/* api link lines */}
      <path d="M370 120 C 430 120, 430 200, 480 200" fill="none" stroke={STROKE} strokeDasharray="4 4" />
      <path d="M190 260 C 130 260, 130 160, 80 160" fill="none" stroke={STROKE} strokeDasharray="4 4" />
      <rect x="440" y="184" width="80" height="32" rx="6" fill="rgba(5,11,24,0.6)" stroke={STROKE} />
      <text x="454" y="204" fontSize="10" fill={TXT} fontFamily={MONO}>api/sync</text>
      <rect x="40" y="144" width="80" height="32" rx="6" fill="rgba(5,11,24,0.6)" stroke={STROKE} />
      <text x="56" y="164" fontSize="10" fill={TXT} fontFamily={MONO}>offline</text>
    </>
  );
}

function StackVisual() {
  const layers = ["frontend", "api", "services", "data", "infra"];
  return (
    <>
      <rect x="20" y="20" width="520" height="360" rx="12" fill={PANEL} stroke={STROKE} />
      {layers.map((l, i) => (
        <g key={l} transform={`translate(0 ${i * 54})`}>
          <path d={`M160 ${90} l120 -40 l120 40 l-120 40 z`} fill={i === 2 ? "rgba(46,124,246,0.35)" : "rgba(46,124,246,0.12)"} stroke={i === 2 ? LIGHT : STROKE} />
          <text x="420" y={94} fontSize="11" fill={TXT} fontFamily={MONO}>{l}</text>
          <line x1="404" y1="90" x2="412" y2="90" stroke={STROKE} />
        </g>
      ))}
    </>
  );
}

function TestingVisual() {
  const rows = ["unit", "api", "ui", "regression", "performance", "security"];
  return (
    <Frame title="test.run --ci">
      {rows.map((r, i) => (
        <g key={r}>
          <rect x="40" y={78 + i * 44} width="300" height="32" rx="6" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
          <circle cx="60" cy={94 + i * 44} r="8" fill={i < 5 ? BLUE : "rgba(255,255,255,0.08)"} stroke={i < 5 ? LIGHT : STROKE} />
          {i < 5 && <path d={`M56 ${94 + i * 44} l3 3 l6 -6`} fill="none" stroke="#fff" strokeWidth="1.6" />}
          <text x="80" y={98 + i * 44} fontSize="11" fill={TXT} fontFamily={MONO}>{r}</text>
          <text x="280" y={98 + i * 44} fontSize="10" fill={i < 5 ? LIGHT : TXT} fontFamily={MONO}>{i < 5 ? "pass" : "running"}</text>
        </g>
      ))}
      <rect x="364" y="78" width="156" height="252" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      <text x="380" y="102" fontSize="10" fill={TXT} fontFamily={MONO}>coverage</text>
      <circle cx="442" cy="190" r="50" fill="none" stroke={FAINT} strokeWidth="10" />
      <circle cx="442" cy="190" r="50" fill="none" stroke={BLUE} strokeWidth="10" strokeDasharray="230 314" transform="rotate(-90 442 190)" />
      <text x="380" y="300" fontSize="10" fill={TXT} fontFamily={MONO}>tracked per release</text>
    </Frame>
  );
}

function SecurityVisual() {
  return (
    <>
      <rect x="20" y="20" width="520" height="360" rx="12" fill={PANEL} stroke={STROKE} />
      {[...Array(6)].map((_, r) =>
        [...Array(9)].map((_, c) => (
          <rect key={`${r}-${c}`} x={52 + c * 52} y={60 + r * 52} width="36" height="36" rx="6" fill="none" stroke={FAINT} />
        )),
      )}
      <path d="M280 110 l70 26 v70 c0 50 -40 78 -70 94 c-30 -16 -70 -44 -70 -94 v-70 z" fill="rgba(46,124,246,0.28)" stroke={LIGHT} strokeWidth="1.5" />
      <rect x="262" y="190" width="36" height="30" rx="5" fill="#0b1b3a" stroke={LIGHT} />
      <path d="M270 190 v-8 a10 10 0 0 1 20 0 v8" fill="none" stroke={LIGHT} strokeWidth="1.5" />
      <text x="52" y="350" fontSize="10" fill={TXT} fontFamily={MONO}>least-privilege · validated inputs · secrets outside source</text>
    </>
  );
}

function InterfaceVisual() {
  return (
    <Frame title="design-system / components">
      <rect x="40" y="76" width="130" height="284" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="56" y={94 + i * 30} width={i === 1 ? 98 : 70} height="8" rx="4" fill={i === 1 ? LIGHT : "rgba(214,226,246,0.35)"} />
      ))}
      <rect x="190" y="76" width="330" height="80" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      <rect x="206" y="94" width="130" height="12" rx="6" fill="rgba(214,226,246,0.6)" />
      <rect x="206" y="116" width="200" height="8" rx="4" fill="rgba(214,226,246,0.25)" />
      <rect x="420" y="92" width="84" height="30" rx="6" fill={BLUE} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={190 + (i % 2) * 168} y={172 + Math.floor(i / 2) * 96} width="162" height="84" rx="8" fill="rgba(5,11,24,0.5)" stroke={i === 0 ? LIGHT : FAINT} />
      ))}
      <rect x="206" y="188" width="24" height="24" rx="6" fill="rgba(46,124,246,0.4)" />
      <rect x="206" y="226" width="110" height="8" rx="4" fill="rgba(214,226,246,0.5)" />
      <rect x="374" y="188" width="130" height="10" rx="5" fill="rgba(214,226,246,0.3)" />
      <rect x="374" y="206" width="90" height="10" rx="5" fill="rgba(214,226,246,0.3)" />
      <rect x="374" y="224" width="110" height="10" rx="5" fill="rgba(214,226,246,0.3)" />
      <circle cx="230" cy="310" r="18" fill="none" stroke={LIGHT} strokeWidth="4" strokeDasharray="70 120" />
      <rect x="374" y="290" width="130" height="30" rx="6" fill="none" stroke={LIGHT} />
    </Frame>
  );
}

function IdentityVisual() {
  return (
    <>
      <rect x="20" y="20" width="520" height="360" rx="12" fill={PANEL} stroke={STROKE} />
      <rect x="44" y="44" width="220" height="200" rx="10" fill="#f5f8fc" />
      <path d="M84 84h28v58l14 14h60v28H84z" fill="#0b1b3a" />
      <path d="M150 94l18 18-18 18-18-18z" fill="#1769e0" />
      <path d="M178 82l10 10-10 10-10-10z" fill="#2e7cf6" />
      <text x="84" y="226" fontSize="16" fontWeight="700" letterSpacing="4" fill="#0b1b3a">MARK</text>
      <rect x="284" y="44" width="236" height="60" rx="8" fill="#0b1b3a" stroke={FAINT} />
      <rect x="284" y="114" width="112" height="60" rx="8" fill="#1769e0" />
      <rect x="408" y="114" width="112" height="60" rx="8" fill="#2e7cf6" />
      <rect x="284" y="184" width="112" height="60" rx="8" fill="#f5f8fc" />
      <rect x="408" y="184" width="112" height="60" rx="8" fill="#162033" stroke={FAINT} />
      <text x="44" y="288" fontSize="28" fontWeight="700" fill="#fff" letterSpacing="-1">Aa</text>
      <text x="100" y="288" fontSize="12" fill={TXT} fontFamily={MONO}>display / heading / body / metadata</text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={44 + i * 82} y="312" width="70" height="40" rx="6" fill="none" stroke={FAINT} />
      ))}
    </>
  );
}

function MotionVisual() {
  return (
    <Frame title="motion.tokens — easing & timing">
      <path d="M60 320 C 200 320, 200 100, 500 100" fill="none" stroke={LIGHT} strokeWidth="2" />
      <line x1="60" y1="320" x2="500" y2="320" stroke={FAINT} />
      <line x1="60" y1="100" x2="60" y2="320" stroke={FAINT} />
      <circle cx="60" cy="320" r="5" fill={BLUE} />
      <circle cx="500" cy="100" r="5" fill={BLUE} />
      <circle cx="200" cy="320" r="4" fill="none" stroke={LIGHT} />
      <circle cx="200" cy="100" r="4" fill="none" stroke={LIGHT} />
      <line x1="60" y1="320" x2="200" y2="320" stroke={STROKE} strokeDasharray="3 3" />
      <line x1="500" y1="100" x2="200" y2="100" stroke={STROKE} strokeDasharray="3 3" />
      <text x="70" y="90" fontSize="10" fill={TXT} fontFamily={MONO}>cubic-bezier(0.16, 1, 0.3, 1)</text>
      <text x="380" y="345" fontSize="10" fill={TXT} fontFamily={MONO}>duration 320ms</text>
      <circle cx="120" cy="196" r="14" fill="rgba(46,124,246,0.35)" stroke={LIGHT} className="animate-float" />
    </Frame>
  );
}

function StrategyVisual() {
  const nodes = [
    { x: 80, y: 200, l: "problem" }, { x: 220, y: 120, l: "options" }, { x: 220, y: 280, l: "constraints" },
    { x: 360, y: 200, l: "roadmap" }, { x: 480, y: 200, l: "measure" },
  ];
  return (
    <>
      <rect x="20" y="20" width="520" height="360" rx="12" fill={PANEL} stroke={STROKE} />
      <g stroke={STROKE} fill="none">
        <path d="M120 200 L180 130" /><path d="M120 200 L180 270" /><path d="M260 120 L320 190" /><path d="M260 280 L320 210" /><path d="M400 200 L440 200" />
      </g>
      {nodes.map((n, i) => (
        <g key={n.l}>
          <rect x={n.x - 40} y={n.y - 18} width="80" height="36" rx="18" fill={i === 3 ? "rgba(46,124,246,0.4)" : "rgba(5,11,24,0.6)"} stroke={i === 3 ? LIGHT : STROKE} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fill={TXT} fontFamily={MONO}>{n.l}</text>
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={60 + i * 120} y="330" width="100" height="10" rx="5" fill={i < 2 ? BLUE : FAINT} />
          <text x={60 + i * 120} y="322" fontSize="9" fill={TXT} fontFamily={MONO}>phase {i + 1}</text>
        </g>
      ))}
    </>
  );
}

function SeoVisual() {
  return (
    <Frame title="search — visibility">
      <rect x="40" y="76" width="480" height="36" rx="18" fill="rgba(5,11,24,0.6)" stroke={STROKE} />
      <circle cx="62" cy="94" r="6" fill="none" stroke={LIGHT} strokeWidth="1.5" />
      <line x1="66" y1="98" x2="71" y2="103" stroke={LIGHT} strokeWidth="1.5" />
      <rect x="84" y="90" width="150" height="8" rx="4" fill="rgba(214,226,246,0.4)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="40" y={130 + i * 56} width="300" height="44" rx="6" fill={i === 0 ? "rgba(46,124,246,0.2)" : "rgba(5,11,24,0.4)"} stroke={i === 0 ? LIGHT : FAINT} />
          <rect x="56" y={142 + i * 56} width={160 - i * 18} height="8" rx="4" fill={i === 0 ? LIGHT : "rgba(214,226,246,0.5)"} />
          <rect x="56" y={158 + i * 56} width="200" height="6" rx="3" fill="rgba(214,226,246,0.25)" />
        </g>
      ))}
      <rect x="364" y="130" width="156" height="212" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      {[70, 90, 60, 120, 140, 160].map((h, i) => (
        <rect key={i} x={380 + i * 22} y={320 - h} width="12" height={h} rx="3" fill={i === 5 ? BLUE : "rgba(127,176,255,0.35)"} />
      ))}
      <text x="380" y="150" fontSize="10" fill={TXT} fontFamily={MONO}>impressions</text>
    </Frame>
  );
}

function AnalyticsVisual() {
  return (
    <Frame title="analytics — conversion funnel">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={40 + i * 164} y="76" width="152" height="60" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
          <rect x={56 + i * 164} y="92" width="60" height="6" rx="3" fill="rgba(214,226,246,0.35)" />
          <rect x={56 + i * 164} y="108" width={40 + i * 20} height="12" rx="4" fill={LIGHT} />
        </g>
      ))}
      <rect x="40" y="152" width="320" height="208" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      <polyline points="60,320 110,290 160,300 210,250 260,240 310,200 340,190" fill="none" stroke={LIGHT} strokeWidth="2" />
      <polyline points="60,340 110,330 160,320 210,310 260,300 310,270 340,268" fill="none" stroke={STROKE} strokeWidth="1.5" strokeDasharray="4 4" />
      {[60, 110, 160, 210, 260, 310, 340].map((x, i) => (
        <line key={i} x1={x} y1="172" x2={x} y2="340" stroke={FAINT} />
      ))}
      <rect x="376" y="152" width="144" height="208" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      {[120, 96, 70, 46].map((w, i) => (
        <rect key={i} x={448 - w / 2} y={176 + i * 44} width={w} height="30" rx="4" fill={`rgba(46,124,246,${0.25 + i * 0.18})`} stroke={LIGHT} strokeOpacity="0.5" />
      ))}
    </Frame>
  );
}

function ScaleVisual() {
  return (
    <Frame title="scale — capacity & performance">
      <path d="M100 300 A 120 120 0 0 1 340 300" fill="none" stroke={FAINT} strokeWidth="14" />
      <path d="M100 300 A 120 120 0 0 1 300 200" fill="none" stroke={BLUE} strokeWidth="14" strokeLinecap="round" />
      <line x1="220" y1="300" x2="290" y2="230" stroke={LIGHT} strokeWidth="3" strokeLinecap="round" />
      <circle cx="220" cy="300" r="8" fill="#0b1b3a" stroke={LIGHT} strokeWidth="2" />
      <text x="170" y="340" fontSize="10" fill={TXT} fontFamily={MONO}>headroom</text>
      <rect x="380" y="80" width="140" height="280" rx="8" fill="rgba(5,11,24,0.5)" stroke={FAINT} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="396" y={100 + i * 50} width="108" height="32" rx="6" fill="none" stroke={i < 3 ? LIGHT : FAINT} />
          <rect x="396" y={100 + i * 50} width={i < 3 ? 108 : 0} height="32" rx="6" fill="rgba(46,124,246,0.25)" />
          <text x="410" y={120 + i * 50} fontSize="10" fill={TXT} fontFamily={MONO}>node-{i + 1}</text>
        </g>
      ))}
    </Frame>
  );
}

const registry: Record<ServiceVisualKind, () => React.ReactNode> = {
  code: CodeVisual,
  web: WebVisual,
  mobile: MobileVisual,
  stack: StackVisual,
  testing: TestingVisual,
  security: SecurityVisual,
  interface: InterfaceVisual,
  identity: IdentityVisual,
  motion: MotionVisual,
  strategy: StrategyVisual,
  seo: SeoVisual,
  analytics: AnalyticsVisual,
  scale: ScaleVisual,
};

export function ServiceVisual({ kind, className, label }: { kind: ServiceVisualKind; className?: string; label: string }) {
  const Inner = registry[kind] ?? CodeVisual;
  return (
    <svg viewBox="0 0 560 400" role="img" aria-label={`Illustration representing ${label}`} className={cn("h-auto w-full drop-shadow-[0_30px_60px_rgba(5,11,24,0.6)]", className)}>
      <Inner />
    </svg>
  );
}
