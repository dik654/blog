import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 4 단위 구간의 번호만 읽으면 [7,9]와 [6,9]는 모두 [1,2].
 * 번호 = 값 ÷ 4의 몫. 8이 7로 바뀌면 구간 2가 1로 변한다. FIPS 알고리즘이 아니라 글의 설명용 규칙이다.
 */
const INK = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const W = 360;
const H = 180;
const CELL = 28;
const LEFT = 12;
const cx = (v: number) => LEFT + v * CELL + CELL / 2;
const BINS = [0, 1, 2];

const SCENES = [
  { label: "첫째 성분: 7과 6", summary: "둘 다 구간 1", top: 7, bottom: 6, topName: "서명자 Ay", bottomName: "검증자 결과", same: true, note: "값은 7과 6으로 1 다르지만 같은 구간 안에 있어 번호가 같습니다. 설명을 위해 값을 4로 나눈 몫을 구간 번호로 읽습니다." },
  { label: "둘째 성분: 9와 9", summary: "[7,9]와 [6,9] 모두 구간 번호 [1,2]", top: 9, bottom: 9, topName: "서명자 Ay", bottomName: "검증자 결과", same: true, note: "둘째 성분은 양쪽 모두 9입니다. 구간 번호만 읽으면 두 벡터가 [1,2]로 같아집니다. 이 [1,2]는 구간 번호이고, 비밀 s=[1,2]와는 숫자만 우연히 같습니다." },
  { label: "경계에 있으면: 8이 7로", summary: "구간 2 → 구간 1", top: 8, bottom: 7, topName: "바뀌기 전", bottomName: "바뀐 뒤", same: false, note: "똑같이 1만 줄어도 경계를 넘으면 번호가 바뀝니다. 실제 표준의 분해·반올림·힌트는 이런 경계 차이를 정해진 규칙으로 처리하며, 이 4 단위 규칙이 FIPS 알고리즘은 아닙니다." },
] as const;

export default function BinBoundaryViz() {
  return (
    <SceneShell
      eyebrow="구간 경계"
      title="1 차이가 구간 안에서는 묻혀도 경계에서는 번호를 바꿉니다"
      description="수직선 위의 칸이 값이고 4칸마다 구간 번호가 바뀝니다. 글이 설명용으로 고른 임의의 4 단위 규칙입니다."
      ariaLabel="4 단위 구간에서 7과 6, 9와 9는 번호가 같고 8과 7은 번호가 달라지는 수직선"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {BINS.map((bin) => (
              <g key={bin}>
                <rect x={LEFT + bin * 4 * CELL + 1} y={36} width={4 * CELL - 2} height={40} rx={3} fill={INK} fillOpacity={bin % 2 === 0 ? 0.08 : 0.18} />
                <text x={LEFT + bin * 4 * CELL + 2 * CELL} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>구간 {bin}</text>
              </g>
            ))}
            {[0, 4, 8, 12].map((v) => (
              <line key={v} x1={LEFT + v * CELL} x2={LEFT + v * CELL} y1={28} y2={84} stroke={INK} strokeWidth={1} />
            ))}
            {Array.from({ length: 12 }, (_, v) => {
              const on = v === scene.top || v === scene.bottom;
              return (
                <text key={v} x={cx(v)} y={61} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight={on ? 700 : 400} className={on ? "fill-foreground" : undefined} fill={on ? undefined : INK}>{v}</text>
              );
            })}
            <path d={`M${cx(scene.top) - 6} 28 L${cx(scene.top) + 6} 28 L${cx(scene.top)} 36 Z`} fill={AMBER} />
            <path d={`M${cx(scene.bottom) - 6} 84 L${cx(scene.bottom) + 6} 84 L${cx(scene.bottom)} 76 Z`} fill={BLUE} />
            <path d="M8 104 L20 104 L14 112 Z" fill={AMBER} />
            <text x={26} y={113} fontSize={12} fill={INK}>{scene.topName}</text>
            <text x={348} y={113} textAnchor="end" fontSize={12} fontWeight={700} className="fill-foreground">{scene.top} → 구간 {Math.floor(scene.top / 4)}</text>
            <path d="M8 138 L20 138 L14 130 Z" fill={BLUE} />
            <text x={26} y={139} fontSize={12} fill={INK}>{scene.bottomName}</text>
            <text x={348} y={139} textAnchor="end" fontSize={12} fontWeight={700} className="fill-foreground">{scene.bottom} → 구간 {Math.floor(scene.bottom / 4)}</text>
            <text x={348} y={166} textAnchor="end" fontSize={12} fontWeight={700} fill={scene.same ? BLUE : RED}>{scene.same ? "번호 같음" : "번호 다름"}</text>
          </svg>
        );
      }}
    />
  );
}
