import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #finality whitepaper 문단 — "6 confirmations"와 "현재 deficit 6"은 같은 입력이 아니다.
 * 수신자가 새 block 6개를 기다리는 동안 공격자가 몰래 k개를 만들었다면 남은 deficit은 6 − k.
 * q/p < 1이므로 (q/p)^(6−k) ≥ (q/p)^6, 같은 경우는 k=0뿐. k는 알 수 없어 칸으로 그리지 않는다.
 */
const W = 360;
const H = 176;
const BX = 58;
const BW = 34;
const GAP = 6;

export default function ConfirmationDeficitViz() {
  return (
    <VizFrame
      eyebrow="확인 수 ≠ deficit"
      title="새 block 6개를 기다리는 동안 공격자도 움직였을 수 있습니다"
      description="위 식의 z는 계산을 시작하는 순간 공격 분기가 뒤처진 칸 수입니다. 두 분기의 block work가 같다고 놓은 단순화입니다."
      documentFlow
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="정직한 분기에서 x 뒤에 새 block 6개가 붙는 동안 공격 분기가 k개를 만들면 남은 deficit은 6 빼기 k">
        <text x={8} y={40} fontSize={11} fontWeight={700} fill="#475569">정직</text>
        <rect x={BX - 2} y={22} width={BW + 4} height={30} rx={3} fill="#94a3b8" fillOpacity={0.25} stroke="#475569" strokeWidth={1} />
        <text x={BX + BW / 2} y={41} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">송금 x</text>
        {Array.from({ length: 6 }, (_, i) => {
          const x = BX + BW + GAP + 6 + i * (BW + GAP);
          return (
            <g key={i}>
              <rect x={x} y={22} width={BW} height={30} rx={3} fill="#2563eb" fillOpacity={0.85} />
              <text x={x + BW / 2} y={41} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">+{i + 1}</text>
            </g>
          );
        })}
        <text x={BX + BW + GAP + 6} y={68} fontSize={11} fill="#2563eb">x 뒤에 붙은 새 block 6개</text>

        <text x={8} y={108} fontSize={11} fontWeight={700} fill="#b45309">공격</text>
        <rect x={BX - 2} y={90} width={BW + 4} height={30} rx={3} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
        <text x={BX + BW / 2} y={109} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">x 없음</text>
        <rect x={BX + BW + GAP + 6} y={90} width={6 * (BW + GAP) - GAP} height={30} rx={3} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
        <text x={BX + BW + GAP + 6 + (6 * (BW + GAP) - GAP) / 2} y={109} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">몰래 만든 block k개 · k = ?</text>
        <text x={BX + BW + GAP + 6} y={136} fontSize={11} fill="#b45309">점선 폭은 기다린 시간이지 k가 아닙니다</text>

        <line x1={8} x2={W - 8} y1={148} y2={148} stroke="#94a3b8" strokeWidth={0.75} />
        <text x={8} y={170} fontSize={12} fill="#475569">계산을 시작할 때 남은 deficit = <tspan fontWeight={700} fill="#2563eb">6 − k</tspan></text>
      </svg>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        위 식의 z=6과 같은 입력은 k=0일 때뿐입니다. q/p가 1보다 작으므로 출발 deficit이 6 − k로 줄면 (q/p)^(6−k)는 (q/p)^6보다 커지고, k가 6 이상이면 공격 분기는 이미 동률 이상입니다. Whitepaper는 k를 Poisson 분포로 평균낸 뒤 남은 deficit마다 catch-up 확률을 더합니다.
      </p>
    </VizFrame>
  );
}
