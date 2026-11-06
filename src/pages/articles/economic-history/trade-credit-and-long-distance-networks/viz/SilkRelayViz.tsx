import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 실크로드는 한 직선 도로가 아니라 구간마다 소유자와 수단이 바뀌는 육상·해상 망의 묶음.
 * 도시 수와 위치, 상인 번호는 모두 설명용 가정이며 실제 지도가 아니다.
 */
const ACCENT = "#2563eb";
const ALT = "#d97706";
const RED = "#dc2626";
const IDLE = "#94a3b8";

const WEST = { x: 34, y: 100 };
const EAST = { x: 326, y: 100 };
const A = { x: 130, y: 44 };
const B = { x: 230, y: 44 };
const P = { x: 130, y: 156 };
const Q = { x: 230, y: 156 };

const LAND = [[WEST, A], [A, B], [B, EAST]] as const;
const SEA = [[WEST, P], [P, Q], [Q, EAST]] as const;
const LINKS = [[A, P], [B, Q]] as const;

const SCENES = [
  { label: "한 줄로 상상하면", summary: "직통 도로 한 개?", note: "실크로드를 중국에서 지중해까지 이어지는 직통 도로 한 줄로 그려 봅니다. 다음 장면부터 이 그림이 놓치는 경로를 봅니다." },
  { label: "실제로는 여러 길의 묶음", summary: "육상 길 + 해상 항로", note: "오늘날 실크로드라고 부르는 연결은 1,500년 넘게 이어진 육상 길과 해상 항로의 묶음입니다. 물건은 여러 중개 도시와 제국의 경계를 거쳤습니다." },
  { label: "구간마다 갈아탑니다", summary: "소유자·운송 수단이 바뀜", note: "대부분의 상인은 전 구간을 직접 가지 않았습니다. 물건은 구간마다 소유자와 운송 수단을 바꾸고, 언어와 통화도 달라졌습니다." },
  { label: "한 구간이 바뀌면", summary: "경로와 가격이 바뀔 수 있음", note: "어느 한 제국의 흥망, 통행세, 전쟁, 항구 변화가 전체 망의 경로와 가격을 바꿀 수 있었습니다. 주황 길은 돌아가는 경로의 한 예입니다(가정)." },
] as const;

type Pt = { x: number; y: number };

function Seg({ from, to, color, dashed = false }: { from: Pt; to: Pt; color: string; dashed?: boolean }) {
  return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "5 4" : undefined} />;
}

function City({ at, label, dy, on, anchor = "middle", dx = 0 }: { at: Pt; label: string; dy: number; on: boolean; anchor?: "middle" | "start" | "end"; dx?: number }) {
  return (
    <g>
      <circle cx={at.x} cy={at.y} r={5} fill={on ? ACCENT : "#cbd5e1"} stroke={on ? ACCENT : IDLE} strokeWidth={1} />
      <text x={at.x + dx} y={at.y + dy} textAnchor={anchor} fontSize={12} fill="#64748b">{label}</text>
    </g>
  );
}

export default function SilkRelayViz() {
  return (
    <SceneShell
      eyebrow="갈아타는 망"
      title="직통 도로 대신 구간을 넘겨주는 망으로 그립니다"
      description="실선은 육상 길, 점선은 해상 항로입니다. 도시 수와 위치, 상인 번호는 설명을 위한 가정이며 실제 지도가 아닙니다."
      ariaLabel="직선 도로 상상과 여러 구간의 육상 해상 망, 구간 변화에 따른 우회 비교"
      scenes={SCENES}
      render={(active) => {
        const city = active >= 1;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 0 && <Seg from={WEST} to={EAST} color={IDLE} />}
            {active === 0 && <text x={180} y={90} textAnchor="middle" fontSize={12} fill="#64748b">상상 속 한 줄의 길</text>}
            {active === 1 && (
              <g>
                {LAND.map(([from, to], i) => <Seg key={i} from={from} to={to} color={ACCENT} />)}
                {SEA.map(([from, to], i) => <Seg key={i} from={from} to={to} color={ACCENT} dashed />)}
                {LINKS.map(([from, to], i) => <Seg key={i} from={from} to={to} color={IDLE} />)}
                <text x={180} y={36} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>육상 길</text>
                <text x={180} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>해상 항로</text>
              </g>
            )}
            {active === 2 && (
              <g>
                <Seg from={WEST} to={A} color="#cbd5e1" />
                <Seg from={A} to={B} color="#cbd5e1" />
                <Seg from={A} to={P} color="#cbd5e1" />
                <Seg from={Q} to={EAST} color="#cbd5e1" dashed />
                <Seg from={EAST} to={B} color={ACCENT} />
                <Seg from={B} to={Q} color={ALT} />
                <Seg from={Q} to={P} color={ACCENT} dashed />
                <Seg from={P} to={WEST} color={ACCENT} dashed />
                <text x={306} y={56} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>상인 1 · 육상</text>
                <text x={238} y={104} textAnchor="start" fontSize={12} fontWeight={700} fill={ALT}>상인 2 · 육상</text>
                <text x={180} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>상인 3 · 해상</text>
              </g>
            )}
            {active === 3 && (
              <g>
                <Seg from={WEST} to={A} color={ACCENT} />
                <Seg from={B} to={EAST} color={ACCENT} />
                <Seg from={A} to={B} color={RED} />
                <path d="M174 38 L186 50 M186 38 L174 50" stroke={RED} strokeWidth={1.25} fill="none" />
                <text x={180} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>이 구간에 변화</text>
                <Seg from={WEST} to={P} color="#cbd5e1" dashed />
                <Seg from={Q} to={EAST} color="#cbd5e1" dashed />
                <Seg from={B} to={Q} color={ALT} />
                <Seg from={Q} to={P} color={ALT} dashed />
                <Seg from={P} to={A} color={ALT} />
                <text x={180} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill={ALT}>돌아가는 길 (가정)</text>
              </g>
            )}
            <City at={WEST} label="지중해" dy={22} on />
            <City at={EAST} label="중국" dy={22} on />
            {city && <City at={A} label="중개 도시" dy={-6} dx={-8} anchor="end" on={active === 1} />}
            {city && <City at={B} label="중개 도시" dy={-6} dx={8} anchor="start" on={active === 1 || active === 2} />}
            {city && <City at={P} label="항구" dy={20} on={active === 1 || active === 2} />}
            {city && <City at={Q} label="항구" dy={20} on={active === 1 || active === 2} />}
          </svg>
        );
      }}
    />
  );
}
