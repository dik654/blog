import SceneShell from "./SceneShell";

/**
 * 본문 대응: #handshake의 timestamp 허용 범위, #local-submission의 caller 결과 분기,
 * #failure-boundaries의 실패별 멈춤 지점. 모든 이름·순서·수치는 본문에서 가져왔습니다.
 */

/* ---------- 1. Handshake timestamp half-open window ---------- */

const T_NOW = 100_000;
const A_MAX = 5_000;
const S_BOUND = 2_000;
const A_MAX_WIDE = 10_000;

const TIME_SCENES = [
  { label: "범위 만들기", summary: "[95,000, 102,000) ms", peer: null, aMax: A_MAX, note: "100,000 − 5,000 = 95,000이 하한, 100,000 + 2,000 = 102,000이 상한입니다. 칠한 점은 포함, 빈 점은 미포함입니다." },
  { label: "하한에 딱 맞은 시각", summary: "95,000 → 통과", peer: 95_000, aMax: A_MAX, note: "하한은 포함되므로 통과합니다. 시각 검사 하나를 넘었을 뿐이고 signature와 confirmation 검증이 이어집니다." },
  { label: "상한에 딱 맞은 시각", summary: "102,000 → 거절", peer: 102_000, aMax: A_MAX, note: "상한 102,000ms 자체는 범위에 들어가지 않으므로 본문 예처럼 거절됩니다." },
  { label: "너무 오래된 시각", summary: "90,000 → 거절 (가정)", peer: 90_000, aMax: A_MAX, note: "가정한 값 90,000ms는 하한보다 이릅니다. Signature가 맞아도 오래된 handshake로 거절합니다." },
  { label: "max age를 늘리면", summary: "[90,000, 102,000) ms", peer: 90_000, aMax: A_MAX_WIDE, note: "max age를 10,000ms로 늘리면(가정) 같은 시각이 통과하지만, 허용하는 replay window도 커집니다." },
] as const;

const AX_LO = 88_000;
const AX_HI = 104_000;
const TW = 360;
const tx = (t: number) => 20 + ((t - AX_LO) / (AX_HI - AX_LO)) * 320;
const accepted = (t: number, aMax: number) => t >= T_NOW - aMax && t < T_NOW + S_BOUND;
const fmt = (t: number) => t.toLocaleString("en-US");

export function CommonwareTimestampWindowViz() {
  return (
    <SceneShell
      eyebrow="Handshake 시각 검사 · 본문 예시 값"
      title="하한은 포함하고 상한은 빼는 시각 범위만 통과합니다"
      description="가로축은 ms 시각입니다. a_max는 max_handshake_age(받아 줄 최대 나이), s는 synchrony_bound(상대 clock이 미래로 앞서도 받아 줄 폭)입니다."
      note="t_now 100,000·a_max 5,000·s 2,000ms는 본문의 해석 예입니다. 90,000ms와 10,000ms는 경계를 보이려는 가정입니다. 이 검사는 signature와 key confirmation을 대신하지 않습니다."
      ariaLabel="handshake timestamp가 허용 범위에 드는지 다섯 장면으로 확인"
      scenes={TIME_SCENES}
      render={(active) => {
        const scene = TIME_SCENES[active];
        const lo = T_NOW - scene.aMax;
        const hi = T_NOW + S_BOUND;
        const ok = scene.peer === null ? null : accepted(scene.peer, scene.aMax);
        const labelX = scene.peer === null ? 0 : Math.min(Math.max(tx(scene.peer), 72), TW - 72);
        return (
          <svg viewBox={`0 0 ${TW} 168`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={20} x2={340} y1={96} y2={96} stroke="#94a3b8" strokeWidth={1} />
            {[88_000, 92_000, 96_000, 100_000, 104_000].map((t) => (
              <g key={t}>
                <line x1={tx(t)} x2={tx(t)} y1={92} y2={100} stroke="#94a3b8" strokeWidth={1} />
                <text x={tx(t)} y={150} textAnchor="middle" fontSize={11} fill="#64748b">{fmt(t)}</text>
              </g>
            ))}
            <rect x={tx(lo)} y={88} width={tx(hi) - tx(lo)} height={16} fill="#2563eb" opacity={0.18} />
            <line x1={tx(lo)} x2={tx(hi)} y1={96} y2={96} stroke="#2563eb" strokeWidth={1.25} />
            <circle cx={tx(lo)} cy={96} r={5} fill="#2563eb" />
            <circle cx={tx(hi)} cy={96} r={5} fill="#ffffff" stroke="#2563eb" strokeWidth={1.25} />
            <text x={tx(lo)} y={124} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{fmt(lo)}</text>
            <text x={tx(hi)} y={124} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{fmt(hi)}</text>
            <line x1={tx(T_NOW)} x2={tx(T_NOW)} y1={70} y2={104} stroke="#334155" strokeWidth={1} strokeDasharray="3 2" />
            <text x={tx(T_NOW)} y={64} textAnchor="middle" fontSize={12} fill="#334155">t_now</text>
            <text x={(tx(lo) + tx(T_NOW)) / 2} y={84} textAnchor="middle" fontSize={11} fill="#64748b">a_max {fmt(scene.aMax)}</text>
            <text x={(tx(T_NOW) + tx(hi)) / 2} y={84} textAnchor="middle" fontSize={11} fill="#64748b">s {fmt(S_BOUND)}</text>
            {scene.peer !== null && (
              <g>
                <line x1={tx(scene.peer)} x2={tx(scene.peer)} y1={30} y2={96} stroke={ok ? "#16a34a" : "#dc2626"} strokeWidth={1.25} />
                <rect x={labelX - 68} y={10} width={136} height={22} rx={4} fill="#ffffff" stroke={ok ? "#16a34a" : "#dc2626"} strokeWidth={1} />
                <text x={labelX} y={25} textAnchor="middle" fontSize={12} fontWeight={700} fill={ok ? "#15803d" : "#b91c1c"}>
                  t_peer {fmt(scene.peer)} · {ok ? "통과" : "거절"}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}

/* ---------- shared stage strip ---------- */

type Mark = "pass" | "stop" | "none" | "skip";

function StageStrip({ stages, marks, token }: { stages: readonly (readonly [string, string])[]; marks: readonly Mark[]; token: number }) {
  return (
    <ol className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3">
      {stages.map(([name, role], index) => {
        const mark = marks[index];
        const tone =
          mark === "stop"
            ? "ring-2 ring-inset ring-red-600"
            : mark === "pass"
              ? "ring-1 ring-inset ring-primary"
              : "opacity-45";
        return (
          <li key={name} className={`relative min-w-0 bg-background px-2 py-1.5 sm:min-h-[5.5rem] sm:px-2.5 sm:py-2 ${tone}`}>
            <div className="flex items-start justify-between gap-1">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")} · {name}{token === index && <span className="sm:hidden"> · m7</span>}</span>
              <span className={`font-mono text-[10px] font-black ${mark === "stop" ? "text-red-700 dark:text-red-400" : "text-primary"}`} aria-hidden>
                {mark === "stop" ? "✕" : mark === "pass" ? "✓" : ""}
              </span>
            </div>
            <span className="mt-1 hidden break-keep text-[11px] leading-4 text-foreground sm:block">{role}</span>
            {token === index && (
              <span className="mt-1.5 hidden min-h-6 items-center border border-primary bg-primary/10 px-1.5 font-mono text-[10px] font-black text-primary sm:inline-flex">m7 여기까지</span>
            )}
            <span className="sr-only">{mark === "stop" ? "여기서 멈춤" : mark === "pass" ? "통과" : "도달하지 않음"}</span>
          </li>
        );
      })}
    </ol>
  );
}

function ResultRow({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px text-[11px] leading-4 sm:text-xs sm:leading-5">
      <p className="min-w-0 break-keep bg-background p-2 sm:min-h-[3.75rem] sm:p-2.5"><strong className="block font-mono text-[10px] text-primary">CALLER가 받는 것</strong>{left}</p>
      <p className="min-w-0 break-keep bg-background p-2 sm:min-h-[3.75rem] sm:p-2.5"><strong className="block font-mono text-[10px] text-primary">실제로 일어난 일</strong>{right}</p>
    </div>
  );
}

/* ---------- 2. Local submission: caller result vs actual ---------- */

const SUBMIT_STAGES = [
  ["SENDER", "size 검사 · recipient별 rate"],
  ["ENCODE", "channel + payload 한 번 encode"],
  ["ROUTER MAILBOX", "공유 router mailbox"],
  ["RELAY", "연결된 recipient의 relay"],
  ["HIGH · LOW QUEUE", "relay의 bounded queue"],
  ["BOB", "decode 이후 단계"],
] as const;

const SUBMIT_SCENES = [
  {
    label: "Router가 돌고 Bob이 연결됨",
    summary: "local 접수까지만 확인",
    marks: ["pass", "pass", "pass", "pass", "pass", "none"] as const,
    token: 4,
    left: "실제로 시도한 recipient 목록과 local admission 결과",
    right: "m7 frame이 Bob relay의 high 또는 low queue에 들어가고, 그 결과는 router actor 안에서 소비됩니다.",
    note: "가장 순조로운 경우에도 최초 caller에게 Bob receipt는 돌아오지 않습니다.",
  },
  {
    label: "모든 recipient가 rate-limited",
    summary: "가장 이른 재시도 시각",
    marks: ["stop", "skip", "skip", "skip", "skip", "skip"] as const,
    token: 0,
    left: "check가 돌려주는 가장 이른 재시도 시각",
    right: "Recipient별 rate limiter가 모두 막혀 있어 이 send는 rate 검사 단계에서 멈춥니다.",
    note: "Rate limit은 recipient별로 따로 소비됩니다. 모두 막혔을 때만 이 결과가 나옵니다.",
  },
  {
    label: "Router가 시작되기 전",
    summary: "Ok인데 frame 없음",
    marks: ["pass", "stop", "skip", "skip", "skip", "skip"] as const,
    token: 0,
    left: "Feedback::Ok",
    right: "연결된 peer가 아직 없으므로 encode로 frame을 만들지도, router mailbox에 enqueue하지도 않습니다.",
    note: "가장 헷갈리는 자리입니다. 이때의 Ok는 Bob이 받았다는 뜻이 아닙니다.",
  },
  {
    label: "Router는 돌지만 Bob 미연결",
    summary: "relay를 찾지 못함",
    marks: ["pass", "pass", "pass", "stop", "skip", "skip"] as const,
    token: 2,
    left: "실제로 시도한 recipient 목록과 local admission 결과 · remote acknowledgement는 없음",
    right: "Router는 현재 연결된 recipient만 relay를 찾으므로 Bob 몫의 frame은 relay로 가지 않습니다.",
    note: "본문은 offline recipient를 local 접수 뒤의 delivery 실패로 분류합니다.",
  },
] as const;

export function CommonwareLocalSubmissionViz() {
  return (
    <SceneShell
      eyebrow="Alice의 send가 끝나는 지점"
      title="Caller가 받는 결과와 m7이 실제로 간 곳은 다를 수 있습니다"
      description="✓ 통과 · ✕ 멈춘 곳 · 흐린 칸은 미도달 · m7은 payload가 있는 마지막 칸입니다."
      note="m7과 channel 7은 글 안의 설명용 이름입니다. 어느 경우에도 caller가 Bob receipt를 받지는 않습니다."
      ariaLabel="Alice send의 네 가지 경우에서 caller 결과와 실제 m7 위치 비교"
      scenes={SUBMIT_SCENES}
      render={(active) => {
        const scene = SUBMIT_SCENES[active];
        return (
          <div className="min-w-0">
            <StageStrip stages={SUBMIT_STAGES} marks={scene.marks} token={scene.token} />
            <ResultRow left={scene.left} right={scene.right} />
          </div>
        );
      }}
    />
  );
}

/* ---------- 3. Failure stop points ---------- */

const PATH_STAGES = [
  ["SESSION", "identity · timestamp · signature · AEAD"],
  ["LOCAL SUBMISSION", "Alice rate · router mailbox"],
  ["DELIVERY", "Bob 연결 · relay queue"],
  ["BOB PEER ACTOR", "decode · channel 등록 검사"],
  ["CHANNEL INBOX", "bounded inbound mailbox"],
  ["BOB APP", "Receiver → (Alice, m7)"],
] as const;

const FAIL_SCENES = [
  {
    label: "Session 실패",
    summary: "session 없음",
    stop: 0,
    causes: "Wrong identity · 오래된 timestamp · signature·confirmation 불일치 · AEAD 오류",
    remains: "Authenticated encrypted connection이 없습니다. AEAD 오류라면 counter를 되돌려 재동기화하지 않고 새 handshake로 connection을 다시 만듭니다.",
    note: "본문은 네 가지를 모두 session 실패로 묶습니다.",
  },
  {
    label: "Local submission 실패",
    summary: "Alice 노드 안",
    stop: 1,
    causes: "Alice의 rate limit · router mailbox overflow",
    remains: "m7은 Alice 노드를 떠나지 않았습니다. 이 실패는 Alice 노드 안의 상태입니다.",
    note: "Bob 쪽 어느 칸에도 m7이 도달하지 않았습니다.",
  },
  {
    label: "Delivery 실패",
    summary: "원격 확인 없음",
    stop: 2,
    causes: "Offline recipient · relay queue overflow",
    remains: "Alice는 local 접수까지 마쳤지만 Bob 쪽으로 가지 못했습니다. Caller가 remote acknowledgement로 이 실패를 확인하는 구조는 아닙니다.",
    note: "Alice가 받은 결과만으로는 여기서 멈췄는지 알 수 없습니다.",
  },
  {
    label: "Bob peer actor에서 멈춤",
    summary: "peer actor 종료 가능",
    stop: 3,
    causes: "미등록 channel · decode 오류",
    remains: "Bob까지 bytes가 도착했지만 inbox에 들어가지 못했습니다. 이 오류는 peer actor를 끝낼 수 있습니다.",
    note: "Peer actor를 끝낼 수 있다는 점이 다음 장면의 inbox overflow와 다릅니다.",
  },
  {
    label: "Inbox가 가득 참",
    summary: "새 message만 drop",
    stop: 4,
    causes: "Full inbound inbox",
    remains: "이미 들어 있던 message는 유지되고 새 도착만 버려집니다. Connection의 ping과 다른 channel 처리는 막히지 않습니다.",
    note: "Bounded mailbox가 가득 찬 순간 새 enqueue만 Rejected됩니다.",
  },
  {
    label: "End-to-end 확인이 필요하면",
    summary: "operation ID + response",
    stop: -1,
    causes: "실패 없음 · Receiver가 (Alice, m7) 반환",
    remains: "Bob process 안의 receipt만 생겼습니다. Bob의 response도 같은 P2P 경로를 지나므로 duplicate·timeout은 Application 몫입니다.",
    note: "남는 상태가 지점마다 달라 retry를 성공 boolean 하나로 설계할 수 없습니다.",
  },
] as const;

export function CommonwareFailureStopViz() {
  return (
    <SceneShell
      eyebrow="실패가 멈춘 칸"
      title="어디서 멈췄는지에 따라 남는 상태와 재시도 판단이 달라집니다"
      description="칸은 m7이 지나는 순서입니다. ✓ 통과 · ✕ 실패가 멈춘 경계 · 흐린 칸은 미도달."
      note="Session 실패 칸에는 연결을 여는 단계의 실패와, 연결 중 복호화에서 생기는 AEAD 오류를 본문 분류대로 함께 두었습니다."
      ariaLabel="Commonware P2P 실패 다섯 종류가 멈추는 경계와 end-to-end 확인 방법"
      scenes={FAIL_SCENES}
      render={(active) => {
        const scene = FAIL_SCENES[active];
        const marks = PATH_STAGES.map((_, index): Mark => {
          if (scene.stop < 0) return "pass";
          if (index < scene.stop) return "pass";
          if (index === scene.stop) return "stop";
          return "skip";
        });
        return (
          <div className="min-w-0">
            <StageStrip stages={PATH_STAGES} marks={marks} token={-1} />
            <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px text-[11px] leading-4 sm:text-xs sm:leading-5">
              <p className="min-w-0 break-keep bg-background p-2 sm:min-h-[4.75rem] sm:p-2.5"><strong className="block font-mono text-[10px] text-primary">원인</strong>{scene.causes}</p>
              <p className="min-w-0 break-keep bg-background p-2 sm:min-h-[4.75rem] sm:p-2.5"><strong className="block font-mono text-[10px] text-primary">남는 상태</strong>{scene.remains}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
