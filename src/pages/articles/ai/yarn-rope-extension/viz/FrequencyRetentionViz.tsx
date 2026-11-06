import SceneShell from "./SceneShell";

/**
 * 본문 대응: #yarn-method — 세 방법을 같은 축에 놓는다. d=128, b=10000, L=4096, s=8, β=1·32.
 * PI: m/s는 각도 기준으로 θ/s와 같으므로 비율 1/8.
 * NTK-aware: (b′/b)^(−2i/d) = s^(−2i/(d−2)) → i=0: 1, i=63: 1/8.
 * YaRN: r=Lθ/2π, γ=clip((r−1)/31,0,1), 비율=(1−γ)/s+γ → i≤20 γ=1, i≥46 γ=0.
 */
const D = 128;
const B = 10000;
const L = 4096;
const S = 8;
const LAST = D / 2 - 1;

const rotations = (i: number) => (L * B ** ((-2 * i) / D)) / (2 * Math.PI);
const piRatio = () => 1 / S;
const ntkRatio = (i: number) => S ** ((-2 * i) / (D - 2));
const yarnRatio = (i: number) => {
  const gamma = Math.min(1, Math.max(0, (rotations(i) - 1) / 31));
  return (1 - gamma) / S + gamma;
};

const W = 360;
const H = 186;
const LEFT = 34;
const RIGHT = 350;
const TOP = 30;
const BOTTOM = 160;
const x = (i: number) => LEFT + (i / LAST) * (RIGHT - LEFT);
const y = (ratio: number) => BOTTOM - ratio * (BOTTOM - TOP);
const INDEXES = Array.from({ length: LAST + 1 }, (_, i) => i);
const line = (ratio: (i: number) => number) => INDEXES.map((i) => `${x(i)},${y(ratio(i))}`).join(" ");

const ZONE_ONE = x(20.5);
const ZONE_TWO = x(45.5);
const ROWS = [20, 30, 63];

const SCENES = [
  { label: "PI", summary: "모든 차원 1/8", note: "PI는 position을 8로 나누지만, 각도 mθ로 보면 모든 θ를 1/8로 줄인 것과 같아 선이 평평합니다." },
  { label: "NTK-aware", summary: "i=0은 그대로, i=63은 1/8", note: "정적 식 기준으로, i가 클수록 키운 base의 영향이 커져 i=0의 1에서 i=63의 1/8까지 곡선으로 내려갑니다. 구현마다 convention은 다를 수 있습니다." },
  { label: "YaRN", summary: "r로 세 구간을 나눕니다", note: "r이 32 이상인 i=0~20은 그대로, 1 이하인 i=46~63은 PI처럼 1/8, i=21~45는 섞습니다. ramp는 r에 대해 직선이라 i 축에서는 곡선으로 보입니다." },
  { label: "같은 차원끼리 비교", summary: "i=63은 셋 다 1/8", note: "i=63은 셋 다 1/8이라 위치 32768의 각도가 27.1°로 돌아옵니다. 이 그림은 회전 속도만 비교하며, 어느 방법의 품질이 낫다고 말해 주지는 않습니다." },
] as const;

function Cell({ show, value, strong = false }: { show: boolean; value: string; strong?: boolean }) {
  return <span className={`text-right font-mono ${strong && show ? "font-bold" : ""} ${show ? "" : "text-muted-foreground/40"}`}>{show ? value : "·"}</span>;
}

export default function FrequencyRetentionViz() {
  return (
    <SceneShell
      eyebrow="세 방법을 같은 축에"
      title="원래 회전 속도가 차원마다 얼마나 남는지 비교합니다"
      description="가로는 차원 번호 i(작을수록 빠름), 세로는 조정 뒤 속도 θ′÷원래 θ입니다. d=128, base 10000, L=4096, s=8에 기본값 β=1·32(모델마다 다를 수 있음)를 넣어 계산했습니다."
      ariaLabel="차원 번호에 따른 PI, NTK-aware, YaRN의 회전 속도 비율"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[470px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active >= 2 && (
              <g>
                <rect x={LEFT} y={TOP} width={ZONE_ONE - LEFT} height={BOTTOM - TOP} fill="#7c3aed" opacity={0.08} />
                <rect x={ZONE_TWO} y={TOP} width={RIGHT - ZONE_TWO} height={BOTTOM - TOP} fill="#0284c7" opacity={0.08} />
                <text x={(LEFT + ZONE_ONE) / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">r≥32 유지</text>
                <text x={(ZONE_ONE + ZONE_TWO) / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">1&lt;r&lt;32 섞음</text>
                <text x={(ZONE_TWO + RIGHT) / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">r≤1 보간</text>
              </g>
            )}
            {[1, 0.5, 0.125].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={RIGHT} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={1} opacity={0.35} />
                <text x={LEFT - 5} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick === 0.125 ? "1/8" : tick === 0.5 ? "1/2" : "1"}</text>
              </g>
            ))}
            <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            {[0, 20, 30, 63].map((i) => (
              <text key={i} x={x(i)} y={BOTTOM + 15} textAnchor={i === 63 ? "end" : i === 0 ? "start" : "middle"} fontSize={11} fill="#64748b">i={i}</text>
            ))}
            <polyline points={line(piRatio)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="6 3" />
            <text x={x(5)} y={y(0.125) - 6} fontSize={12} fontWeight={700} fill="#64748b">PI</text>
            {active >= 1 && (
              <g>
                <polyline points={line(ntkRatio)} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="2 3" />
                <text x={x(3)} y={y(0.4)} fontSize={12} fontWeight={700} fill="#d97706">NTK-aware</text>
              </g>
            )}
            {active >= 2 && (
              <g>
                <polyline points={line(yarnRatio)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={x(26)} y={y(0.8)} fontSize={12} fontWeight={700} fill="#2563eb">YaRN</text>
              </g>
            )}
          </svg>
          <div className="mx-auto mt-2 grid max-w-[470px] grid-cols-[3rem_repeat(4,minmax(0,1fr))] gap-x-2 gap-y-1 text-xs">
            <span className="font-semibold text-muted-foreground">차원</span>
            <span className="text-right font-semibold text-muted-foreground">회전 수 r</span>
            <span className="text-right font-semibold text-muted-foreground">PI</span>
            <span className="text-right font-semibold text-muted-foreground">NTK</span>
            <span className="text-right font-semibold text-muted-foreground">YaRN</span>
            {ROWS.map((i) => (
              <div key={i} className="contents">
                <span className="font-mono">i={i}</span>
                <Cell show={active >= 2} value={rotations(i) < 1 ? rotations(i).toFixed(3) : rotations(i) < 100 ? rotations(i).toFixed(1) : rotations(i).toFixed(0)} />
                <Cell show value={piRatio().toFixed(3)} />
                <Cell show={active >= 1} value={ntkRatio(i).toFixed(3)} />
                <Cell show={active >= 2} value={yarnRatio(i).toFixed(3)} strong />
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
