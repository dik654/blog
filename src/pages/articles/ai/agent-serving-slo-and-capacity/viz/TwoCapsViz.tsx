import SceneShell from "./SceneShell";

/**
 * 본문 대응: kv-residency 절의 C* = min(C_speed, ⌊K_pool/L⌋).
 * 속도 쪽은 평균 몫으로 어림한 위쪽 한계: 32K 행 16 통과·32 미달 → 16~31, 128K 행 8 통과·16 미달 → 8~15.
 * 메모리 쪽은 200K 세션: 큰 풀 18, 작은 풀 0. 작은 쪽: 16~18, 8~15, 0.
 */
const CASES = [
  { speed: [16, 31], memory: 18, min: [16, 18], speedLabel: "속도 쪽 16~31 (32K 문맥 행)" },
  { speed: [8, 15], memory: 18, min: [8, 15], speedLabel: "속도 쪽 8~15 (128K 문맥 행)" },
  { speed: [16, 31], memory: 0, min: [0, 0], speedLabel: "속도 쪽 16~31 (32K 문맥 행)" },
] as const;

const SCENES = [
  { label: "큰 풀 · 32K 행", summary: "먼저 닿는 쪽 16~18개", note: "평균 몫은 16개에서 20을 넘고 32개에서 넘지 못합니다. 그 사이는 재지 않았으므로 범위로 그렸습니다. 메모리 18개와 비슷한 자리에서 만납니다." },
  { label: "큰 풀 · 128K 행", summary: "속도가 먼저 8~15개", note: "같은 표의 128K 행은 8개에서 21.7, 16개에서 14.0입니다. 문맥이 길면 한 걸음에 읽을 KV가 늘어 속도 쪽이 메모리 18개보다 먼저 닿습니다." },
  { label: "작은 풀", summary: "메모리가 먼저 0개", note: "속도 쪽이 넉넉해도 200K 세션 하나를 온전히 담지 못하면 거기서 막힙니다. KV 형식과 분할 설정이 전제인 이유입니다." },
] as const;

const W = 360;
const LEFT = 12;
const RIGHT = 12;
const MAX = 32;
const x = (value: number) => LEFT + (value / MAX) * (W - LEFT - RIGHT);

export default function TwoCapsViz() {
  return (
    <SceneShell
      eyebrow="두 상한"
      title="동시 수를 늘리다 먼저 닿는 쪽이 용량입니다"
      description="가로축은 동시 에이전트 수입니다. 속도 쪽 막대는 3절 측정표에서 평균 몫이 20 아래로 내려가는 경계가 있을 수 있는 구간, 메모리 쪽은 200K 세션이 KV 풀에 모두 상주하는 개수이며, 맨 아래 띠가 둘 가운데 작은 쪽입니다."
      note="속도 쪽은 평균으로 어림한 위쪽 한계라 P25로 판정하면 더 작아집니다. 속도 쪽은 K2.6의 32K·128K 문맥 행, 메모리 쪽은 K2.5의 200K 세션이라 같은 조건에서 함께 잰 값이 아닙니다. 속도 표는 출력 길이를 강제한 합성 요청의 현장 경험 값이고, 이 결과가 곧 판매 가능한 수는 아닙니다."
      ariaLabel="속도 상한 범위와 메모리 상한을 같은 동시 수 축에 놓고 작은 쪽을 표시"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        const memoryFirst = item.memory === 0;
        return (
          <svg viewBox={`0 0 ${W} 180`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={14} fontSize={12} fontWeight={600} fill="#2563eb">{item.speedLabel}</text>
            <rect x={x(item.speed[0])} y={20} width={x(item.speed[1]) - x(item.speed[0])} height={14} rx={2} fill="#2563eb" opacity={0.6} />
            <text x={LEFT} y={62} fontSize={12} fontWeight={600} fill="#b45309">메모리 쪽 {item.memory}개 (200K 세션)</text>
            <line x1={x(item.memory)} x2={x(item.memory)} y1={68} y2={88} stroke="#b45309" strokeWidth={1.25} />
            <rect x={x(item.memory) - 3} y={75} width={6} height={6} fill="#b45309" />
            <text x={LEFT} y={114} fontSize={12} fontWeight={700} fill="#0f172a" className="dark:fill-[#f1f5f9]">
              {memoryFirst ? "작은 쪽 0개" : `작은 쪽 ${item.min[0]}~${item.min[1]}개`}
            </text>
            <rect x={x(item.min[0]) - (memoryFirst ? 3 : 0)} y={120} width={memoryFirst ? 6 : x(item.min[1]) - x(item.min[0])} height={14} rx={2} fill="#475569" />
            <line x1={LEFT} x2={W - RIGHT} y1={150} y2={150} stroke="#94a3b8" strokeWidth={1} />
            {[0, 8, 16, 24, 32].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={150} y2={155} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(tick)} y={169} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
