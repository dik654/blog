import SceneShell from "./SceneShell";

/**
 * 본문 대응: #schedule-source — hit 6인 A·B와 miss 0. A만 임시 지연이면 B, miss, A.
 * 대기 요청이 128을 넘으면(129개) LPM과 HRRN은 활성 정책을 FCFS로 바꾼다.
 */
const SCENES = [
  { label: "hit이 긴 요청 먼저", summary: "A(6) · B(6) · miss(0)", note: "LPM은 가장 긴 앞부분이 맞은 요청을 앞세우는 정책입니다. num_matched_prefix_tokens가 큰 요청이 앞서므로 hit 6인 두 요청이 miss 앞에 섭니다. A와 B의 앞뒤는 표시용입니다(가정)." },
  { label: "A만 임시 지연", summary: "B · miss · A", note: "temporary_deprioritized인 요청은 뒤로 미룹니다. A의 hit이 6이어도 miss 0 뒤로 갑니다. 이 조건에서는 길이 6이 항상 0보다 앞선다는 규칙이 성립하지 않습니다." },
  { label: "대기가 128을 넘으면", summary: "128 → LPM · 129 → FCFS", note: "대기 요청이 128을 넘으면 활성 정책이 먼저 온 순서인 FCFS로 바뀝니다. cache 비활성, 다른 정책, 우선순위 설정은 따로 확인해야 합니다." },
];

const ORDERS = [
  [["A", "hit 6", "hit"], ["B", "hit 6", "hit"], ["miss", "hit 0", "miss"]],
  [["B", "hit 6", "hit"], ["miss", "hit 0", "miss"], ["A", "hit 6 · 지연", "delay"]],
] as const;

const TONE = {
  hit: "border-[#16a34a]",
  miss: "border-[#64748b]",
  delay: "border-dashed border-[#d97706]",
} as const;

export default function LpmOrderViz() {
  return (
    <SceneShell
      eyebrow="정렬 함수에 넣은 세 요청"
      title="hit 길이만으로는 실행 순서가 정해지지 않습니다"
      description="앞 두 장면은 왼쪽부터 실행합니다. 세 요청은 본문이 원문 정렬 함수에 넣어 본 요청 객체 대역입니다."
      ariaLabel="임시 지연과 대기 수 경계가 LPM 실행 순서를 바꾸는 과정"
      scenes={SCENES}
      render={(index) => {
        if (index === 2) {
          const x = (n: number) => 30 + (n - 126) * 50;
          return (
            <svg viewBox="0 0 320 124" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label="대기 요청 128까지 LPM, 129부터 FCFS">
              <rect x={x(126)} y={30} width={x(128.5) - x(126)} height={30} fill="#2563eb" />
              <rect x={x(128.5)} y={30} width={x(131) - x(128.5)} height={30} fill="#b45309" />
              <text x={(x(126) + x(128.5)) / 2} y={50} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">LPM</text>
              <text x={(x(128.5) + x(131)) / 2} y={50} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">FCFS</text>
              {[127, 128, 129, 130].map((n) => (
                <g key={n}>
                  <line x1={x(n)} x2={x(n)} y1={60} y2={68} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(n)} y={84} textAnchor="middle" fontSize={12} fontWeight={n === 128 || n === 129 ? 700 : 400} fill="currentColor">{n}</text>
                </g>
              ))}
              <text x={160} y={108} textAnchor="middle" fontSize={11} fill="#64748b">대기 요청 수</text>
            </svg>
          );
        }
        return (
          <ol className="grid grid-cols-3 gap-2">
            {ORDERS[index === 0 ? 0 : 1].map(([name, hit, tone], i) => (
              <li key={name} className={`rounded-lg border p-3 text-center ${TONE[tone]}`}>
                <p className="text-xs text-muted-foreground">{i + 1}번째</p>
                <p className="mt-1 font-mono text-base font-bold">{name}</p>
                <p className="mt-1 text-xs">{hit}</p>
              </li>
            ))}
          </ol>
        );
      }}
    />
  );
}
