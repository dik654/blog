import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retrieve-path ExplainedFormula — T_get = route 20 + dial 30 + first 50 + transfer 400 + verify 5 = 505ms.
 * 막대 길이는 505ms 전체에 비례한다. transfer 400 / 505 ≈ 79%.
 */
const PARTS = [
  { key: "route", name: "후보 탐색", ms: 20, color: "#64748b" },
  { key: "dial", name: "연결", ms: 30, color: "#94a3b8" },
  { key: "first", name: "첫 byte 대기", ms: 50, color: "#0891b2" },
  { key: "transfer", name: "나머지 전송", ms: 400, color: "#2563eb" },
  { key: "verify", name: "CID 검증", ms: 5, color: "#16a34a" },
] as const;

const TOTAL = PARTS.reduce<number>((sum, part) => sum + part.ms, 0);
const STARTS = PARTS.map((_, index) => PARTS.slice(0, index).reduce<number>((sum, part) => sum + part.ms, 0));

/** 장면마다 막대에 그려 둘 구간 수 */
const SHOWN = [2, 3, 4, 5] as const;

const SCENES = [
  { label: "후보를 찾아 연결", summary: "20 + 30 = 50ms", note: "Routing 20ms와 연결 30ms를 더하면 50ms입니다. 아직 payload byte는 한 개도 받지 않았습니다." },
  { label: "첫 byte가 도착", summary: "50 + 50 = 100ms", note: "요청 뒤 첫 payload byte까지 50ms를 더 기다려 100ms 시점에 첫 byte가 도착합니다." },
  { label: "나머지를 전송", summary: "100 + 400 = 500ms", note: "나머지 byte를 모두 받는 데 400ms가 걸립니다. 막대에서 가장 긴 구간이며 전체의 약 79%(400 ÷ 505)입니다." },
  { label: "CID를 다시 계산", summary: "500 + 5 = 505ms", note: "마지막으로 decode와 multihash 재계산에 5ms를 써서 505ms에 검증까지 끝납니다. 총합 505ms만 보면 이 구성이 보이지 않습니다." },
] as const;

const W = 360;
const LEFT = 8;
const BAR_W = W - 2 * LEFT;
const x = (ms: number) => LEFT + (ms / TOTAL) * BAR_W;
const TICKS = [0, 50, 100, 500] as const;

export default function LatencyBreakdownViz() {
  return (
    <SceneShell
      eyebrow="505ms 한 건을 구간으로"
      title="파일 한 건의 505ms 중 400ms가 전송 구간입니다"
      description="막대 전체가 검증 완료까지의 505ms이고 길이는 시간에 비례합니다. 숫자는 본문 예제의 값입니다."
      ariaLabel="후보 탐색 20, 연결 30, 첫 byte 50, 전송 400, 검증 5밀리초가 쌓여 505밀리초가 되는 막대"
      scenes={SCENES}
      render={(active) => {
        const shown = SHOWN[active];
        const end = shown === PARTS.length ? TOTAL : STARTS[shown];
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} 74`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={LEFT} y={14} width={BAR_W} height={26} rx={3} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
              {PARTS.map((part, index) =>
                index < shown ? (
                  <rect key={part.key} x={x(STARTS[index])} y={14} width={x(STARTS[index] + part.ms) - x(STARTS[index])} height={26} fill={part.color} />
                ) : null,
              )}
              <line x1={x(end)} x2={x(end)} y1={12} y2={48} stroke="#0f172a" strokeWidth={1.25} />
              <text x={Math.min(x(end), W - LEFT)} y={10} textAnchor={end > 400 ? "end" : "middle"} fontSize={10} fontWeight={700} fill="#0f172a">
                {end}ms
              </text>
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={40} y2={46} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={60} textAnchor={tick === 0 ? "start" : "middle"} fontSize={9} fill="#64748b">
                    {tick}
                  </text>
                </g>
              ))}
              <text x={W - LEFT} y={72} textAnchor="end" fontSize={9} fill="#64748b">
                505ms
              </text>
            </svg>
            <ul className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
              {PARTS.map((part, index) => (
                <li key={part.key} className={`flex items-center gap-2 ${index < shown ? "" : "opacity-35"}`}>
                  <span className="inline-block size-3 shrink-0 rounded-sm" style={{ backgroundColor: part.color }} />
                  <span className="min-w-0 flex-1">{part.name}</span>
                  <span className="font-mono font-semibold">{part.ms}ms</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
