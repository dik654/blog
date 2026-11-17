import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stdio — Host가 child의 stdin에 request를 쓰고 stdout에서 response를 읽는다.
 * Diagnostic text가 stdout에 섞이면 framing이 깨지므로 log는 stderr로 보낸다.
 * 왼쪽 = Host(parser), 오른쪽 위 = child process, 오른쪽 아래 = 운영 log.
 */
const SCENES = [
  {
    label: "stdin으로 request",
    summary: "Host → child",
    note: "Host가 child process를 시작하고, client가 tools/call JSON-RPC message를 frame 단위로 stdin에 씁니다.",
  },
  {
    label: "stdout으로 response",
    summary: "같은 id의 result",
    note: "Server는 같은 request id의 result 또는 error를 stdout에 씁니다. Host의 parser는 stdout에서 읽은 것을 protocol message로 해석합니다.",
  },
  {
    label: "Debug log를 stdout에 쓰면",
    summary: "parser가 오해할 수 있음",
    note: "Protocol byte와 diagnostic text가 같은 stdout에 섞이면 framing이 깨집니다. Parser는 log 한 줄을 protocol message로 오해할 수 있습니다.",
  },
  {
    label: "Log는 stderr로",
    summary: "stdout에는 frame만",
    note: "진단은 사람과 운영 system을 위한 stderr로 보냅니다. stdout에는 protocol message만 남습니다. Credential·PII·전체 payload는 기본 log에 남기지 않습니다.",
  },
] as const;

const NOTES: readonly string[] = SCENES.map((scene) => scene.note);

const ACCENT = "#2563eb";
const BAD = "#dc2626";
const GOOD = "#16a34a";
const LINE = "#94a3b8";
const MUTED = "#64748b";

function Pipe({ y, label, on, dir }: { y: number; label: string; on: boolean; dir: "right" | "left" }) {
  const stroke = on ? ACCENT : LINE;
  const head = dir === "right" ? "M232 0l-8 -4v8z" : "M128 0l8 -4v8z";
  return (
    <g>
      <line x1={128} y1={y} x2={232} y2={y} stroke={stroke} strokeWidth={on ? 1.25 : 1} />
      <path d={head} transform={`translate(0 ${y})`} fill={stroke} />
      <text x={180} y={y - 26} textAnchor="middle" fontSize={10} fontWeight={700} fill={on ? ACCENT : MUTED}>{label}</text>
    </g>
  );
}

function Chip({ x, y, w, text, color }: { x: number; y: number; w: number; text: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y - 9} width={w} height={18} rx={4} className="fill-background" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + 3.5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

export default function StdioFramingViz() {
  return (
    <SceneShell
      eyebrow="stdio · 세 개의 pipe"
      title="stdout에는 protocol message만 흘러야 합니다"
      description="Frame은 parser가 message 하나로 끊어 읽는 단위입니다. 그림의 id 7과 log 문구는 설명용 가정입니다."
      ariaLabel="Host와 child process 사이의 stdin, stdout, stderr 흐름과 log가 stdout에 섞일 때의 결과"
      scenes={SCENES}
      render={(active) => {
        const mixed = active === 2;
        const toStderr = active === 3;
        const verdict = active === 0 ? "request 전송" : mixed ? "✗ framing 깨짐" : "✓ message";
        const verdictColor = active === 0 ? MUTED : mixed ? BAD : GOOD;
        return (
          <svg viewBox="0 0 360 250" className="mx-auto block h-auto w-full max-w-[32rem]" role="img" aria-label={NOTES[active]}>
            <rect x={8} y={20} width={120} height={210} rx={8} className="fill-background" stroke={LINE} />
            <text x={68} y={42} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">Host</text>
            <text x={68} y={58} textAnchor="middle" fontSize={10} fill={MUTED}>MCP client</text>
            <rect x={20} y={150} width={96} height={64} rx={6} className="fill-background" stroke={active === 0 ? LINE : verdictColor} />
            <text x={68} y={170} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-foreground">stdout parser</text>
            <text x={68} y={194} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={verdictColor}>{verdict}</text>

            <rect x={232} y={20} width={120} height={140} rx={8} className="fill-background" stroke={LINE} />
            <text x={292} y={42} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">child process</text>
            <text x={292} y={58} textAnchor="middle" fontSize={10} fill={MUTED}>MCP server</text>
            <text x={292} y={146} textAnchor="middle" fontSize={9.5} fill={MUTED}>log를 어디에 쓰나?</text>

            <Pipe y={80} label="stdin" on={active === 0} dir="right" />
            <Pipe y={128} label="stdout" on={active >= 1} dir="left" />

            {active === 0 && <Chip x={138} y={80} w={84} text="tools/call · id 7" color={ACCENT} />}
            {active >= 1 && <Chip x={mixed ? 132 : 150} y={128} w={mixed ? 50 : 60} text="result 7" color={ACCENT} />}
            {mixed && <Chip x={184} y={128} w={44} text="debug…" color={BAD} />}

            <line x1={292} y1={160} x2={292} y2={196} stroke={toStderr ? ACCENT : LINE} strokeWidth={toStderr ? 1.25 : 1} strokeDasharray={toStderr ? undefined : "3 3"} />
            <path d="M292 198l-4 -8h8z" fill={toStderr ? ACCENT : LINE} />
            <text x={300} y={182} fontSize={10} fontWeight={700} fill={toStderr ? ACCENT : MUTED}>stderr</text>
            <rect x={232} y={200} width={120} height={30} rx={6} className="fill-background" stroke={toStderr ? ACCENT : LINE} strokeDasharray={toStderr ? undefined : "3 3"} />
            <text x={292} y={219} textAnchor="middle" fontSize={10} className={toStderr ? "fill-foreground" : "fill-muted-foreground"}>{toStderr ? "debug… → 운영 log" : "운영 log"}</text>
          </svg>
        );
      }}
    />
  );
}
