import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — BIS: 0~10 베이스 상관은 0~3·3~7·7~10 시장가치의 합과
 * 0~10 가상 첫손실 구간의 가격이 같아지게 하는 상관. 6절: 0부터 각 끝점까지의 가상 구간마다 맞춘다.
 * 끝점별 상관 값은 본문에 숫자가 없어 높이나 크기로 그리지 않고 기호로만 둡니다.
 */
const TRANCHES = [
  { start: 0, end: 3, color: "#dc2626" },
  { start: 3, end: 7, color: "#d97706" },
  { start: 7, end: 10, color: "#2563eb" },
] as const;

const BASES = [
  { end: 3, symbol: "ρ(3)" },
  { end: 7, symbol: "ρ(7)" },
  { end: 10, symbol: "ρ(10)" },
] as const;

const SCENES = [
  { label: "시장에 있는 것", summary: "0~3 · 3~7 · 7~10 호가", base: 0, note: "시장에서 호가가 붙는 것은 0~3, 3~7, 7~10처럼 시작점과 끝점이 있는 구간들입니다. 아직 상관을 풀지 않았습니다." },
  { label: "가상 구간 0~3", summary: "0~3 = 0~3 → ρ(3)", base: 1, note: "0부터 첫 끝점 3까지의 가상 첫손실 구간은 0~3 구간 그 자체입니다. 이 가격을 맞추는 상관을 ρ(3)이라고 적겠습니다." },
  { label: "가상 구간 0~7", summary: "0~3 + 3~7 → ρ(7)", base: 2, note: "0~7 가상 구간은 0~3과 3~7을 쌓은 것입니다. 두 구간 시장가치의 합에 0~7 가격이 같아지게 하는 상관을 따로 풉니다." },
  { label: "가상 구간 0~10", summary: "0~3 + 3~7 + 7~10 → ρ(10)", base: 3, note: "BIS가 든 예입니다. 세 구간 시장가치의 합과 0~10 가상 첫손실 구간의 가격이 같아지게 하는 상관이 0~10% 베이스 상관입니다." },
  { label: "끝점마다 다른 값", summary: "ρ(3) · ρ(7) · ρ(10)이 같다는 보장 없음", base: 4, note: "끝점마다 따로 역산하므로 세 값은 다를 수 있고, 그래서 곡선이 기울어집니다. 이 값은 호가를 한 곡선으로 표시하는 방법이라 베이스 상관 30%를 실제 회사 쌍의 부도확률 30%로 읽으면 안 됩니다." },
] as const;

const W = 300;
const H = 190;
const TOP = 12;
const BASE_Y = 176;
const UNIT = (BASE_Y - TOP) / 10;
const BOX_X = 34;
const BOX_W = 80;
const y = (value: number) => BASE_Y - value * UNIT;
const bracketX = (index: number) => BOX_X + BOX_W + 22 + index * 52;

export default function BaseTrancheNestViz() {
  return (
    <SceneShell
      eyebrow="베이스 상관"
      title="0부터 각 끝점까지 쌓은 가상 구간마다 상관을 맞춥니다"
      description="왼쪽 칸은 시장에서 호가가 붙는 세 트랜치이고, 오른쪽 괄호는 0에서 시작하는 가상 첫손실 구간입니다. 상관 값은 본문에 숫자가 없어 기호로만 적었습니다."
      ariaLabel="0~3, 0~7, 0~10 가상 첫손실 구간이 아래 트랜치들을 쌓아 만드는 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const covered = scene.base === 0 ? 0 : scene.base >= 4 ? 10 : BASES[scene.base - 1].end;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {TRANCHES.map((tranche) => {
              const inside = tranche.end <= covered;
              return (
                <g key={tranche.start}>
                  <rect
                    x={BOX_X}
                    y={y(tranche.end)}
                    width={BOX_W}
                    height={(tranche.end - tranche.start) * UNIT}
                    fill={tranche.color}
                    opacity={scene.base === 0 || inside ? 0.7 : 0.18}
                    stroke="#94a3b8"
                    strokeWidth={1}
                    className="transition-opacity duration-300 motion-reduce:transition-none"
                  />
                  <text x={BOX_X - 6} y={y(tranche.end) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tranche.end}</text>
                </g>
              );
            })}
            <text x={BOX_X - 6} y={y(0) + 4} textAnchor="end" fontSize={12} fill="#64748b">0</text>
            {BASES.map((base, index) => {
              const shown = scene.base >= 4 || index < scene.base;
              const current = index === scene.base - 1;
              const bx = bracketX(index);
              const color = current || scene.base >= 4 ? "#2563eb" : "#94a3b8";
              return (
                <g key={base.end} opacity={shown ? 1 : 0.15} className="transition-opacity duration-300 motion-reduce:transition-none">
                  <path d={`M ${bx - 6} ${y(0)} H ${bx} V ${y(base.end)} H ${bx - 6}`} fill="none" stroke={color} strokeWidth={current ? 1.25 : 1} />
                  <text x={bx + 5} y={(y(0) + y(base.end)) / 2} fontSize={12} fontWeight={700} fill={color}>0~{base.end}</text>
                  <text x={bx + 5} y={(y(0) + y(base.end)) / 2 + 14} fontSize={13} fontWeight={700} fill={color}>{base.symbol}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
