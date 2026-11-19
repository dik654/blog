import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — "여덟 node·fanout 2를 식에 넣어 보기".
 * i_{t+1} ≈ 1 − (1 − i_t)·e^(−f·i_t), f=2, N=8, i₀=1/8.
 * 0.875×0.779=0.681 → i₁≈0.3185(2.55개), 0.681×0.529=0.360 → i₂≈0.6396(5.12개).
 * 같은 식을 한 번 더 넣으면 0.360×0.278=0.100 → i₃≈0.900(7.20개)이며, 이것은 본문 숫자로 한 연장 계산이다.
 * 마름모는 위 EpidemicViz 표본의 정수 개수(1 → 3 → 6 → 8)다.
 */
const N = 8;

const ROUNDS = [
  { from: "i₀", to: "i₁", unknown: 0.875, noPush: 0.779, stay: 0.681, after: 0.3185, shown: "0.3185", sample: 3 },
  { from: "i₁", to: "i₂", unknown: 0.681, noPush: 0.529, stay: 0.36, after: 0.6396, shown: "0.6396", sample: 6 },
  { from: "i₂", to: "i₃", unknown: 0.36, noPush: 0.278, stay: 0.1, after: 0.9, shown: "0.900", sample: 8 },
] as const;

const SCENES = [
  {
    label: "round 0 → 1",
    summary: "0.875 × 0.779 ≈ 0.681 → i₁ ≈ 0.3185",
    note: "처음에는 P0만 알아서 모르는 몫이 0.875입니다. 그중 이번 round에도 push를 못 받을 근사 몫 e^(−2×0.125)≈0.779만 남으므로 0.681이 계속 모르고, 나머지 0.3185(평균 약 2.55개)이 압니다.",
  },
  {
    label: "round 1 → 2",
    summary: "0.681 × 0.529 ≈ 0.360 → i₂ ≈ 0.6396",
    note: "아는 비율이 커지자 못 받을 몫 e^(−2×0.3185)이 0.529로 작아집니다. 모르는 몫이 곱셈으로 줄어 평균 약 5.12개가 아는 상태가 됩니다.",
  },
  {
    label: "round 2 → 3",
    summary: "0.360 × 0.278 ≈ 0.100 → i₃ ≈ 0.900",
    note: "본문의 두 단계 뒤에 같은 식을 한 번 더 넣은 계산입니다. 평균 약 7.2개로 커지지만 1에 닿지는 않습니다. 위 표본은 이번에 8개에 닿았을 뿐이고, 평균장 근사도 표본도 완전 전달을 보장하지 않습니다.",
  },
] as const;

function FactorBar({ label, value, color, text }: { label: string; value: number; color: string; text: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:grid-cols-[11rem_minmax(0,1fr)_4rem] sm:text-sm">
      <span className="break-keep leading-5 text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${value * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{text}</span>
    </div>
  );
}

function NodeStrip({ mean, sample }: { mean: number; sample: number }) {
  const W = 360;
  const LEFT = 8;
  const CELL = (W - 2 * LEFT) / N;
  const x = (count: number) => LEFT + count * CELL;
  return (
    <svg viewBox={`0 0 ${W} 80`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`평균 약 ${(mean * N).toFixed(2)}개, 위 표본 ${sample}개`}>
      {Array.from({ length: N }, (_, index) => (
        <rect key={index} x={x(index)} y={18} width={CELL - 3} height={22} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
      ))}
      <rect x={x(0)} y={18} width={Math.max(0, mean * N * CELL - 3)} height={22} rx={3} fill="#4f46e5" fillOpacity={0.35} />
      {Array.from({ length: N }, (_, index) => (
        <text key={index} x={x(index) + (CELL - 3) / 2} y={34} textAnchor="middle" fontSize={11} fill="#475569">
          {index + 1}
        </text>
      ))}
      <line x1={x(mean * N)} x2={x(mean * N)} y1={12} y2={46} stroke="#4f46e5" strokeWidth={1.25} />
      <text x={Math.min(Math.max(x(mean * N), 52), W - 52)} y={10} textAnchor="middle" fontSize={12} fontWeight={700} fill="#4f46e5">
        평균 ≈ {(mean * N).toFixed(2)}개
      </text>
      <path d={`M ${x(sample) - 4} 56 l 4 -5 l 4 5 l -4 5 Z`} fill="#d97706" />
      <text x={Math.min(Math.max(x(sample), 62), W - 62)} y={77} textAnchor="middle" fontSize={12} fill="#b45309">
        위 표본 한 번: {sample}개
      </text>
    </svg>
  );
}

export default function MeanFieldRoundsViz() {
  return (
    <SceneShell
      eyebrow="평균장 근사 · N=8 · fanout 2"
      title="모르는 몫에 '못 받을 확률'을 곱해 한 round씩 줄입니다"
      description="막대는 비율(0~1)입니다. 다음 round에도 모르는 몫 = 지금 모르는 몫 × e^(−f·i_t)이고, 1에서 그 몫을 뺀 값이 다음 informed 비율입니다. 아래 칸은 같은 비율을 여덟 node 중 몇 개인지로 바꾼 개수 눈금이며, 어느 node가 아는지는 정하지 않습니다."
      note="평균장 근사는 많은 무작위 실행의 평균을 큰 모집단 가정으로 근사한 값이라 2.55개 같은 소수가 나옵니다. 주황 마름모는 위 시각화의 한 번 표본(1 → 3 → 6 → 8개)으로, 근사와 구분해 읽습니다."
      ariaLabel="fanout 2 평균장 식을 세 round 반복해 informed 비율이 커지는 과정"
      scenes={SCENES}
      render={(active) => {
        const round = ROUNDS[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <FactorBar label={`지금 모르는 몫 1−${round.from}`} value={round.unknown} color="#94a3b8" text={round.unknown.toFixed(3)} />
              <FactorBar label="× 이번에도 못 받을 몫" value={round.noPush} color="#d97706" text={round.noPush.toFixed(3)} />
              <FactorBar label="= 다음에도 모르는 몫" value={round.stay} color="#64748b" text={round.stay.toFixed(3)} />
              <FactorBar label={`다음 informed ${round.to}`} value={round.after} color="#4f46e5" text={round.shown} />
            </div>
            <NodeStrip mean={round.after} sample={round.sample} />
          </div>
        );
      }}
    />
  );
}
