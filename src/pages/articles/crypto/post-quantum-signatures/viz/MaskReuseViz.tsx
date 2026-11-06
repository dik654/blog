import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 같은 마스크를 다른 challenge에 쓰면 두 응답의 차이에서 마스크가 사라지고 (c1−c2)s가 남는다.
 * y=[2,1], s=[1,2], c1=1(3절), c2=−1(가정). z1=[3,3], z2=[1,−1], 차이 [2,4]=2×[1,2].
 */
const INK = "#64748b";
const AMBER = "#d97706";
const RED = "#dc2626";
const W = 360;
const H = 212;

const ROWS = [
  { name: "첫 서명", before: "z₁ = ", mask: "[2,1]", after: " + 1×[1,2] = [3,3]" },
  { name: "둘째 서명", before: "z₂ = ", mask: "[2,1]", after: " + (−1)×[1,2] = [1,−1]" },
  { name: "두 응답을 뺌", before: "z₁ − z₂ = [2,4] = 2×s", mask: "", after: "" },
  { name: "c₁−c₂로 나눔", before: "[2,4] ÷ 2 = [1,2] = s", mask: "", after: "" },
];

const SCENES = [
  { label: "첫 서명", summary: "y=[2,1], c₁=1", note: "3절의 작은 예입니다. 마스크 y=[2,1], challenge c₁=1이면 응답은 [3,3]입니다." },
  { label: "같은 마스크로 둘째 서명", summary: "y=[2,1], c₂=−1", note: "같은 마스크를 다른 challenge에 쓰는 경우입니다. 작은 예로 c₂=−1이라고 놓으면(가정) 응답은 [1,−1]입니다." },
  { label: "차이에서 마스크가 사라집니다", summary: "z₁−z₂ = (c₁−c₂)s", note: "두 응답을 빼면 양쪽의 [2,1]이 지워지고 (c₁−c₂)s만 남습니다. 이 예에서 c₁−c₂=2이므로 [2,4]입니다." },
  { label: "비밀이 드러납니다", summary: "s = [1, 2]", note: "응답과 challenge를 아는 사람이라면 작은 예에서 둘로 나눠 비밀 [1,2]를 얻습니다. 실제 구현에서도 난수·내부 nonce·재시도 규칙을 임의로 바꾸지 않습니다." },
] as const;

export default function MaskReuseViz() {
  return (
    <SceneShell
      eyebrow="마스크 재사용"
      title="같은 마스크를 두 번 쓰면 뺄셈 한 번으로 마스크가 지워집니다"
      description="주황 글자 [2,1]이 두 서명에 함께 쓰인 마스크입니다. c₂=−1은 작은 예를 위한 가정이고, 나머지 값은 3절의 장난감 예에서 계산했습니다. −1은 17로 나눈 나머지로 쓰면 16과 같은 값입니다."
      ariaLabel="같은 마스크를 쓴 두 응답을 빼면 비밀 벡터만 남는 계산 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {ROWS.map((row, i) => {
            const y = 4 + i * 52;
            const shown = i <= active;
            const last = i === 3 && shown;
            return (
              <g key={row.name}>
                <rect x={4} y={y} width={352} height={44} rx={6} fill={last ? RED : "none"} fillOpacity={last ? 0.08 : 0} stroke={last ? RED : INK} strokeWidth={1} strokeDasharray={shown ? undefined : "4 3"} strokeOpacity={shown ? 1 : 0.5} />
                {shown && (
                  <>
                    <text x={14} y={y + 17} fontSize={11} fill={last ? RED : INK}>{row.name}</text>
                    <text x={14} y={y + 35} fontSize={13} fontFamily="monospace" fontWeight={700} className="fill-foreground">{row.before}{row.mask && <tspan fill={AMBER}>{row.mask}</tspan>}{row.after}</text>
                    {i < 2 && <text x={346} y={y + 17} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>마스크 [2,1]</text>}
                    {i === 2 && <text x={346} y={y + 17} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>마스크 사라짐</text>}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
