import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 핀 쪽 기록과 처리 대기 기록은 다른 위치에 있다.
 * 처리 함수에 들어와도 핀 쪽 기록은 남고, 소거 여부에 따라 요청이 다시 생길 수 있다.
 */
const SCENES = [
  { label: "변화가 기록됩니다", summary: "핀 쪽 1 · 요청 있음", input: "높음", bit: 1, request: "요청 있음", fn: "기다림", toRequest: true, toFn: false, clear: false, again: false, note: "입력이 낮음에서 높음으로 바뀌면 핀 쪽에 비트 1이 남고 처리 순서를 고르는 쪽에 요청이 생깁니다. 허용·우선순위를 보고 실행 차례를 고릅니다." },
  { label: "입력이 다시 낮아집니다", summary: "입력 낮음 · 핀 쪽은 1", input: "낮음", bit: 1, request: "요청 있음", fn: "기다림", toRequest: false, toFn: false, clear: false, again: false, note: "입력이 다시 낮아져도 사건 기록은 남을 수 있습니다. 비트는 지금 전압이 아니라 변화가 있었다는 표시입니다." },
  { label: "접수 함수에 들어갑니다", summary: "함수 실행 · 핀 쪽은 여전히 1", input: "낮음", bit: 1, request: "차례가 옴", fn: "실행 중", toRequest: false, toFn: true, clear: false, again: false, note: "차례가 와서 함수가 실행돼도 핀 쪽 비트는 그대로입니다. 두 기록은 다른 위치에 있기 때문입니다." },
  { label: "갈래 A: 원인을 소거", summary: "핀 쪽 0 · 읽을 일 남김", input: "낮음", bit: 0, request: "이 원인 없음", fn: "읽을 일 남김", toRequest: false, toFn: false, clear: true, again: false, note: "함수가 원인을 확인해 핀 쪽 사건 상태를 소거하고 일반 작업에 읽을 일을 남깁니다. 실제 읽기와 계산은 그 뒤입니다." },
  { label: "갈래 B: 원인을 남김", summary: "핀 쪽 1 · 요청이 다시 생길 수 있음", input: "낮음", bit: 1, request: "다시 생길 수 있음", fn: "다시 들어올 수 있음", toRequest: true, toFn: true, clear: false, again: true, note: "함수가 끝나도 핀 쪽 원인이 계속 남으면 처리할 요청이 다시 생길 수 있습니다. 같은 사건에 함수가 또 들어올 수 있는 경로입니다." },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const WARN = "#dc2626";

export default function TwoRecordsViz() {
  return (
    <SceneShell
      eyebrow="서로 다른 두 기록"
      title="함수에 들어와도 핀 쪽 기록은 저절로 지워지지 않습니다"
      description="왼쪽 칸은 핀 쪽의 사건 비트입니다. 1이면 변화 기록이 남아 있다는 뜻입니다. 오른쪽 칸은 처리 순서를 고르는 쪽의 대기 기록이고, 아래는 짧은 접수 함수입니다."
      ariaLabel="입력 변화 뒤 핀 쪽 기록, 처리 대기 기록, 접수 함수의 상태 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const high = scene.input === "높음";
        const bitColor = scene.bit ? (scene.again ? WARN : ACCENT) : MUTED;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="two-records-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0L8 4L0 8Z" fill="#64748b" />
              </marker>
            </defs>
            <text x={12} y={18} fontSize={12} fill="#64748b">입력: {scene.input}</text>
            <path d={high ? "M12 50H36V30H130" : "M12 50H36V30H84V50H130"} fill="none" stroke={ACCENT} strokeWidth={1.25} />
            <line x1={36} y1={54} x2={36} y2={68} stroke="#64748b" strokeWidth={1} markerEnd="url(#two-records-arrow)" />

            <rect x={10} y={70} width={150} height={54} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={20} y={102} fontSize={12} fill="currentColor">핀 쪽 기록</text>
            <rect x={110} y={80} width={36} height={34} rx={6} fill={bitColor} opacity={0.14} stroke={bitColor} strokeWidth={1.25} />
            <text x={128} y={103} textAnchor="middle" fontSize={17} fontWeight={700} fontFamily="monospace" fill={bitColor}>{scene.bit}</text>

            <line x1={162} y1={97} x2={198} y2={97} stroke={scene.toRequest ? "#64748b" : "#cbd5e1"} strokeWidth={1} markerEnd="url(#two-records-arrow)" />

            <rect x={200} y={70} width={150} height={54} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={275} y={92} textAnchor="middle" fontSize={12} fill="currentColor">처리 대기 기록</text>
            <text x={275} y={112} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.again ? WARN : ACCENT}>{scene.request}</text>

            <line x1={275} y1={126} x2={275} y2={144} stroke={scene.toFn ? "#64748b" : "#cbd5e1"} strokeWidth={1} markerEnd="url(#two-records-arrow)" />

            <rect x={190} y={146} width={160} height={46} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={270} y={165} textAnchor="middle" fontSize={12} fill="currentColor">짧은 접수 함수</text>
            <text x={270} y={183} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.again ? WARN : ACCENT}>{scene.fn}</text>

            {scene.clear && (
              <>
                <path d="M188 169H85V126" fill="none" stroke="#16a34a" strokeWidth={1.25} strokeDasharray="4 3" markerEnd="url(#two-records-arrow)" />
                <text x={96} y={160} fontSize={12} fontWeight={700} fill="#16a34a">소거</text>
              </>
            )}
            {!scene.clear && active >= 2 && (
              <text x={14} y={160} fontSize={12} fill={scene.again ? WARN : "#64748b"}>{scene.again ? "소거 없음: 원인 유지" : "아직 소거 전"}</text>
            )}
          </svg>
        );
      }}
    />
  );
}
