import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 출력 한 칸의 평균 제곱은 ∥v∥²/k이고 k칸을 더하면 ∥v∥²로 돌아온다.
 * v는 본문 첫째·둘째 점의 차이 (1,1,1,1)이라 ∥v∥²=4입니다. r은 평균 0, 분산 1/k인 독립 성분입니다.
 */
const BLUE = "#2563eb";
const GRAY = "#64748b";
const W = 340;
const H = 216;
const CELL = 38;
const X0 = 30;
const Y0 = 26;
const NAMES = ["r₁", "r₂", "r₃", "r₄"] as const;

const SCENES = [
  { label: "제곱을 펼치기", summary: "(r₁+r₂+r₃+r₄)² → 16칸", note: "v=(1,1,1,1)이면 행렬 한 줄과 곱한 출력 한 칸은 r₁+r₂+r₃+r₄입니다. 이를 제곱하면 두 성분의 곱 16개가 나옵니다." },
  { label: "교차항은 평균 0", summary: "12칸 → 0", note: "서로 다른 두 성분은 독립이고 평균이 0이므로 두 성분을 곱한 값의 평균도 0입니다. 대각선 밖 12칸이 지워집니다." },
  { label: "대각선만 남음", summary: "4 × 1/k = 4/k", note: "대각선 네 칸은 같은 성분의 제곱이고 그 평균이 분산 1/k입니다. 네 칸을 더하면 4/k, 곧 ∥v∥²/k입니다." },
  { label: "k칸을 더하기", summary: "k × 4/k = 4 = ∥v∥²", note: "출력 k칸의 평균 제곱을 모두 더하면 k가 약분되어 원래 제곱 길이 4로 돌아옵니다. 평균이 제곱 길이일 뿐 한 번 뽑은 결과나 길이 자체의 평균은 아닙니다." },
] as const;

export default function ExpectedLengthGridViz() {
  return (
    <SceneShell
      eyebrow="왜 1/k 분산인가"
      title="곱셈표에서 대각선만 남아 제곱 길이가 돌아옵니다"
      description="칸 하나가 두 성분의 곱의 평균입니다. 차이 벡터는 본문 첫째와 둘째 점의 (1,1,1,1)입니다."
      note="표의 r은 정규분포 행렬 한 줄의 성분입니다. 독립, 평균 0, 분산 1/k가 모두 필요합니다."
      ariaLabel="출력 한 칸의 제곱을 곱셈표로 펼쳐 기대 제곱 길이를 구하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 && NAMES.map((name, index) => (
            <g key={name}>
              <text x={X0 + index * (CELL + 2) + CELL / 2} y={Y0 - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>{name}</text>
              <text x={X0 - 8} y={Y0 + index * (CELL + 2) + 24} textAnchor="end" fontSize={12} fontWeight={700} fill={GRAY}>{name}</text>
            </g>
          ))}
          {active < 3 && NAMES.map((_, row) => NAMES.map((__, col) => {
            const diagonal = row === col;
            const text = active === 0 ? `${NAMES[row]}${NAMES[col]}` : diagonal ? (active === 1 ? `${NAMES[row]}²` : "1/k") : "0";
            return (
              <g key={`${row}-${col}`}>
                <rect x={X0 + col * (CELL + 2)} y={Y0 + row * (CELL + 2)} width={CELL} height={CELL} rx={3} fill={diagonal && active > 0 ? BLUE : "none"} fillOpacity={0.14} stroke={diagonal && active > 0 ? BLUE : "#94a3b8"} strokeWidth={1} />
                <text x={X0 + col * (CELL + 2) + CELL / 2} y={Y0 + row * (CELL + 2) + 24} textAnchor="middle" fontSize={active === 0 ? 11 : 13} fontWeight={diagonal && active > 0 ? 700 : 400} fill={diagonal && active > 0 ? BLUE : GRAY}>{text}</text>
              </g>
            );
          }))}
          {active === 1 && <text x={218} y={102} fontSize={13} fontWeight={700} fill={GRAY}>12칸 평균 0</text>}
          {active === 2 && (
            <g>
              <text x={218} y={92} fontSize={13} fontWeight={700} fill={BLUE}>대각선 합</text>
              <text x={218} y={112} fontSize={14} fontWeight={700} fill={BLUE}>4/k</text>
              <text x={218} y={132} fontSize={12} fill={GRAY}>= ∥v∥²/k</text>
            </g>
          )}
          {active === 3 && (
            <g>
              <text x={W / 2} y={24} textAnchor="middle" fontSize={12} fill={GRAY}>출력 k칸의 평균 제곱</text>
              {["4/k", "4/k", "…", "4/k"].map((text, index) => (
                <g key={index}>
                  <rect x={50 + index * 62} y={44} width={54} height={40} rx={3} fill={text === "…" ? "none" : BLUE} fillOpacity={0.14} stroke={text === "…" ? "#94a3b8" : BLUE} strokeWidth={1} />
                  <text x={50 + index * 62 + 27} y={69} textAnchor="middle" fontSize={13} fontWeight={700} fill={text === "…" ? GRAY : BLUE}>{text}</text>
                </g>
              ))}
              <path d="M 50 96 v 6 H 290 v -6" fill="none" stroke={GRAY} strokeWidth={1} />
              <text x={170} y={122} textAnchor="middle" fontSize={12} fill={GRAY}>k칸을 모두 더하면</text>
              <text x={170} y={154} textAnchor="middle" fontSize={16} fontWeight={700} fill={BLUE}>k × 4/k = 4</text>
              <text x={170} y={180} textAnchor="middle" fontSize={12} fill={GRAY}>원래 차이의 제곱 길이 ∥v∥² = 1+1+1+1</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
