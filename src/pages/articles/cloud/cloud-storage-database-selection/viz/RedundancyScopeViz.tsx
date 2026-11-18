import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 중복 옵션은 같은 데이터센터·가용 영역·다른 지역 중
 * 어느 장애를 견딜지에 따라 다릅니다. 사본 위치와 장애 범위(빨간 점선)를 겹쳐 봅니다.
 * 사본 개수와 상자 크기는 그림용입니다.
 */
const LINE = "#64748b";
const TEXT = "#475569";
const ACCENT = "#2563eb";
const FAIL = "#dc2626";

type Rect = { x: number; y: number; w: number; h: number };
const REGION_A: Rect = { x: 6, y: 22, w: 250, h: 150 };
const ZONE_1: Rect = { x: 14, y: 42, w: 114, h: 122 };
const ZONE_2: Rect = { x: 136, y: 42, w: 112, h: 122 };
const DC_1: Rect = { x: 22, y: 64, w: 98, h: 92 };
const DC_2: Rect = { x: 144, y: 64, w: 96, h: 92 };
const REGION_B: Rect = { x: 264, y: 22, w: 90, h: 150 };
const DC_B: Rect = { x: 272, y: 64, w: 74, h: 92 };

const SCENES = [
  {
    label: "같은 데이터센터",
    summary: "데이터센터가 멈추면 사본도 함께",
    note: "사본을 모두 한 데이터센터 안에 두면 그 데이터센터 전체가 멈추는 장애에서 사본이 함께 묶입니다. 범위가 좁은 대신 이 장애는 견디지 못합니다.",
    copies: [
      [52, 104],
      [82, 104],
    ],
    fail: DC_1,
    failLabel: "데이터센터 장애",
    survives: false,
  },
  {
    label: "가용 영역에 나눔",
    summary: "영역 하나가 멈춰도 다른 영역에 사본",
    note: "사본을 두 영역에 나누면 영역 1이 멈춰도 영역 2의 사본이 남습니다. 지역 A 전체가 멈추는 장애는 여전히 범위 밖입니다.",
    copies: [
      [64, 104],
      [185, 104],
    ],
    fail: ZONE_1,
    failLabel: "영역 1 장애",
    survives: true,
  },
  {
    label: "다른 지역까지",
    summary: "지역 A가 멈춰도 지역 B에 사본",
    note: "다른 지역에도 사본을 두면 지역 A 전체가 멈춰도 지역 B의 사본이 남습니다. 다만 범위가 넓을수록 무조건 좋은 것이 아니라 비용과 쓰기·전환 조건을 함께 봐야 합니다.",
    copies: [
      [64, 104],
      [302, 104],
    ],
    fail: REGION_A,
    failLabel: "지역 A 장애",
    survives: true,
  },
] as const;

function Area({ r, label, strong = false }: { r: Rect; label: string; strong?: boolean }) {
  return (
    <g>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill="none" stroke={LINE} strokeWidth={1} strokeOpacity={strong ? 1 : 0.7} />
      <text x={r.x + 6} y={r.y + 14} fontSize={strong ? 11 : 10} fontWeight={strong ? 700 : 400} fill={TEXT}>{label}</text>
    </g>
  );
}

function inside(r: Rect, x: number, y: number) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

export default function RedundancyScopeViz() {
  return (
    <SceneShell
      eyebrow="사본을 둘 범위"
      title="중복 옵션은 사본을 어느 경계 밖까지 떨어뜨릴지 고르는 일입니다"
      description="가용 영역은 한 지역 안에서 전원·냉각·네트워크를 따로 쓰는 데이터센터 묶음입니다. 파란 칸은 사본, 빨간 점선은 한 번에 멈추는 범위입니다. 사본 개수와 상자 크기는 그림용입니다(가정)."
      ariaLabel="같은 데이터센터, 가용 영역, 다른 지역에 사본을 둘 때 각 장애에서 남는 사본 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Area r={REGION_A} label="지역 A" strong />
            <Area r={ZONE_1} label="가용 영역 1" />
            <Area r={ZONE_2} label="가용 영역 2" />
            <Area r={DC_1} label="데이터센터" />
            <Area r={DC_2} label="데이터센터" />
            <Area r={REGION_B} label="지역 B" strong />
            <Area r={DC_B} label="데이터센터" />
            <rect
              x={scene.fail.x - 3}
              y={scene.fail.y - 3}
              width={scene.fail.w + 6}
              height={scene.fail.h + 6}
              rx={8}
              fill={FAIL}
              fillOpacity={0.06}
              stroke={FAIL}
              strokeWidth={1.25}
              strokeDasharray="5 3"
            />
            {scene.copies.map(([x, y]) => {
              const lost = inside(scene.fail, x, y);
              return (
                <g key={`${x}-${y}`}>
                  <rect x={x - 10} y={y - 10} width={20} height={20} rx={3} fill={lost ? "none" : ACCENT} fillOpacity={0.85} stroke={lost ? FAIL : ACCENT} strokeWidth={1} strokeDasharray={lost ? "3 2" : undefined} />
                  <text x={x} y={y + 24} textAnchor="middle" fontSize={9} fill={lost ? FAIL : ACCENT}>{lost ? "멈춤" : "남음"}</text>
                </g>
              );
            })}
            <text x={6} y={194} fontSize={11} fontWeight={700} fill={FAIL}>{scene.failLabel}</text>
            <text x={354} y={194} textAnchor="end" fontSize={11} fontWeight={700} fill={scene.survives ? ACCENT : FAIL}>
              {scene.survives ? "다른 사본으로 견딤" : "남는 사본 없음"}
            </text>
          </svg>
        );
      }}
    />
  );
}
