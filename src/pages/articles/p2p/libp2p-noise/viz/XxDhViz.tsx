import SceneShell from "./SceneShell";

/**
 * 본문 대응: #handshake-flow — XX 세 메시지가 어떤 key를 보내고 어떤 두 key로 DH를 계산하는지.
 * → e / ← e, ee, s, es / → s, se. es = initiator e × responder s, se = initiator s × responder e.
 * 세 DH 결과가 순서대로 handshake state에 섞인 뒤 두 방향 CipherState로 나뉜다.
 */
type KeyState = "hidden" | "plain" | "enc";

interface Scene {
  label: string;
  summary: string;
  note: string;
  msg: number;
  aliceE: KeyState;
  aliceS: KeyState;
  bobE: KeyState;
  bobS: KeyState;
  dh: readonly ("ee" | "es" | "se")[];
  split: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "메시지 1 · → e", summary: "DH 0개 · 인증 없음", msg: 1, aliceE: "plain", aliceS: "hidden", bobE: "hidden", bobS: "hidden", dh: [], split: false, note: "Alice(initiator)는 이번 연결만 쓰는 ephemeral public key e만 보냅니다. 아직 누구의 static key도 오가지 않아 상대를 인증하지 않습니다." },
  { label: "메시지 2 · ← e, ee", summary: "첫 DH ee", msg: 2, aliceE: "plain", aliceS: "hidden", bobE: "plain", bobS: "hidden", dh: ["ee"], split: false, note: "Bob(responder)이 자기 ephemeral key를 보내면 두 쪽이 ee를 계산합니다. DH는 자기 private key와 상대 public key로 양쪽이 같은 비밀값을 얻는 계산입니다. 이 결과가 handshake state에 섞인 뒤부터 보내는 값은 암호화됩니다." },
  { label: "메시지 2 · ← s, es + payload", summary: "Bob static이 암호화되어 도착", msg: 2, aliceE: "plain", aliceS: "hidden", bobE: "plain", bobS: "enc", dh: ["ee", "es"], split: false, note: "Bob의 static key와 identity payload가 암호화되어 오고, Alice의 e와 Bob의 s로 es를 계산합니다. Alice는 이제 Bob의 binding을 검사할 수 있습니다. Alice의 static key는 아직 오지 않아 Bob 쪽에서는 Alice를 인증하기 전입니다." },
  { label: "메시지 3 · → s, se + payload", summary: "Alice static이 암호화되어 도착", msg: 3, aliceE: "plain", aliceS: "enc", bobE: "plain", bobS: "enc", dh: ["ee", "es", "se"], split: false, note: "Alice의 static key와 identity payload가 보호된 상태로 가고, Alice의 s와 Bob의 e로 se를 계산합니다. Bob도 Alice의 binding을 검사할 수 있습니다." },
  { label: "두 방향 CipherState", summary: "ee → es → se 순서로 섞인 결과", msg: 0, aliceE: "plain", aliceS: "enc", bobE: "plain", bobS: "enc", dh: ["ee", "es", "se"], split: true, note: "양쪽이 모든 token과 payload를 처리하면 handshake hash와 chaining key에서 두 방향 CipherState를 나눕니다. DH 결과는 순서대로 섞였으므로 메시지 순서나 token을 바꾸면 같은 key가 나오지 않습니다." },
];

const AX = 64;
const BX = 296;
const EY = 46;
const SY = 104;
const KEY_COLOR: Record<KeyState, string> = { hidden: "#cbd5e1", plain: "#2563eb", enc: "#7c3aed" };
const DH_LINES: Record<"ee" | "es" | "se", { x1: number; y1: number; x2: number; y2: number; lx: number; ly: number }> = {
  ee: { x1: AX + 22, y1: EY, x2: BX - 22, y2: EY, lx: 180, ly: EY - 6 },
  es: { x1: AX + 22, y1: EY + 4, x2: BX - 22, y2: SY - 4, lx: 240, ly: 94 },
  se: { x1: AX + 22, y1: SY - 4, x2: BX - 22, y2: EY + 4, lx: 120, ly: 94 },
};

function KeyNode({ x, y, name, state, side }: { x: number; y: number; name: string; state: KeyState; side: "left" | "right" }) {
  const c = KEY_COLOR[state];
  const tag = state === "plain" ? "평문" : state === "enc" ? "암호화" : "미전송";
  return (
    <g>
      <rect x={x - 22} y={y - 13} width={44} height={26} rx={6} fill={state === "hidden" ? "none" : `${c}1a`} stroke={c} strokeDasharray={state === "hidden" ? "3 2" : undefined} />
      <text x={x} y={y + 4} fontSize={12} fontWeight={700} textAnchor="middle" fill={state === "hidden" ? "#94a3b8" : c}>{name}</text>
      <text x={side === "left" ? x - 26 : x + 26} y={y + 4} fontSize={10} textAnchor={side === "left" ? "end" : "start"} fill={state === "hidden" ? "#94a3b8" : c}>{tag}</text>
    </g>
  );
}

const MSGS = [
  { n: 1, text: "→ e" },
  { n: 2, text: "← e, ee, s, es" },
  { n: 3, text: "→ s, se" },
];

export default function XxDhViz() {
  return (
    <SceneShell
      eyebrow="Noise XX"
      title="세 메시지가 key 네 개 사이에 DH 선 세 개를 긋습니다"
      description="Alice가 initiator, Bob이 responder입니다. e는 ephemeral, s는 static public key이고 선 하나가 두 key로 계산한 DH입니다. key 옆 글자가 그 key가 상대에게 평문으로 갔는지, 암호화되어 갔는지, 아직 안 갔는지를 적습니다(파랑 평문 · 보라 암호화)."
      ariaLabel="Noise XX 세 메시지의 key 전송과 ee, es, se DH 계산"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <svg viewBox="0 0 360 214" className="mx-auto block h-auto w-full max-w-[26rem]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <text x={AX} y={16} fontSize={12} fontWeight={700} textAnchor="middle" fill="#64748b">Alice · initiator</text>
            <text x={BX} y={16} fontSize={12} fontWeight={700} textAnchor="middle" fill="#64748b">Bob · responder</text>
            {(["ee", "es", "se"] as const).map((k) => {
              const on = s.dh.includes(k);
              const l = DH_LINES[k];
              const newest = on && s.dh[s.dh.length - 1] === k && !s.split;
              return (
                <g key={k}>
                  <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={on ? (newest ? "#d97706" : "#16a34a") : "#e2e8f0"} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
                  <rect x={l.lx - 13} y={l.ly - 10} width={26} height={15} rx={3} fill={on ? (newest ? "#fef3c7" : "#dcfce7") : "none"} />
                  <text x={l.lx} y={l.ly + 1} fontSize={10.5} fontWeight={700} textAnchor="middle" fill={on ? (newest ? "#92400e" : "#166534") : "#94a3b8"}>{k}</text>
                </g>
              );
            })}
            <KeyNode x={AX} y={EY} name="e" state={s.aliceE} side="left" />
            <KeyNode x={AX} y={SY} name="s" state={s.aliceS} side="left" />
            <KeyNode x={BX} y={EY} name="e" state={s.bobE} side="right" />
            <KeyNode x={BX} y={SY} name="s" state={s.bobS} side="right" />

            {MSGS.map((m, i) => {
              const cur = m.n === s.msg;
              const y = 140 + i * 18;
              return (
                <g key={m.n}>
                  <rect x={96} y={y - 11} width={168} height={15} rx={4} fill={cur ? "#2563eb1a" : "none"} stroke={cur ? "#2563eb" : "none"} />
                  <text x={104} y={y} fontSize={11.5} fontWeight={cur ? 700 : 400} fill={cur ? "#2563eb" : "#94a3b8"}>
                    메시지 {m.n}
                  </text>
                  <text x={160} y={y} fontSize={11.5} fontWeight={cur ? 700 : 400} fontFamily="monospace" fill={cur ? "#2563eb" : "#94a3b8"}>
                    {m.text}
                  </text>
                </g>
              );
            })}
            <text x={180} y={208} fontSize={11} fontWeight={700} textAnchor="middle" fill={s.split ? "#16a34a" : "#64748b"}>
              {s.split ? "Alice→Bob 키 · Bob→Alice 키로 분리" : `handshake state에 섞인 DH: ${s.dh.length ? s.dh.join(" → ") : "없음"}`}
            </text>
          </svg>
        );
      }}
    />
  );
}
