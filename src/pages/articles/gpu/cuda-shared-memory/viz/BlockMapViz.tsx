import SceneShell from "./SceneShell";
import { LineArrow } from "./LineArrow";

/**
 * 본문 대응: #names — 표의 이름들을 한 지도에 놓습니다. Block 32×16 threads, warp 32 lanes, tile 32×32.
 * 이 지도는 역할의 포함 관계만 보이며 칩의 실제 배치도가 아닙니다.
 */
const SCENES = [
  { label: "두 메모리", summary: "Global memory ↔ SM", note: "입력과 결과는 Global memory에 있고 요청은 cache를 거치므로 요청량과 실제 DRAM 전송량을 구별합니다. 작업은 칩 안의 처리 구역 SM에서 실행됩니다." },
  { label: "block · warp · lane", summary: "32×16 threads · 한 줄이 warp", note: "협력하는 작업 묶음이 thread block이고 이 글의 원본은 32×16개입니다. x축으로 이웃한 32개가 명령을 함께 진행하는 warp, 그 안의 한 자리가 lane입니다." },
  { label: "shared · barrier", summary: "32×32 tile에 놓고 기다림", note: "block이 값을 함께 놓는 공간이 shared memory이고 여기에 32×32 조각 tile을 둡니다. 모두 놓을 때까지 기다리는 지점이 block barrier입니다." },
  { label: "두 가지 셈", summary: "위로 sector · 옆으로 bank", note: "주소를 적은 32바이트 sector로 모으는 동작이 coalescing입니다. shared의 병렬 구역이 bank이고, 같은 bank의 다른 위치로 몰려 나눠 처리하면 bank conflict입니다." },
] as const;

const GRID_X = 26;
const GRID_Y = 118;
const CELL = 4.8;
const TILE_X = 208;
const TILE_Y = 110;
const TILE_C = 3.6;

export default function BlockMapViz() {
  return (
    <SceneShell
      eyebrow="이름 지도"
      title="앞에서 본 역할들의 이름과 서로의 위치입니다"
      description="칩의 실제 배치도가 아니라 역할의 포함 관계입니다. 아래 표가 같은 이름을 정의합니다."
      ariaLabel="Global memory, SM, thread block, warp, lane, shared memory, bank의 관계"
      scenes={SCENES}
      render={(active) => {
        const color = (scene: number) => (active === scene ? "#2563eb" : "#94a3b8");
        const showBlockDetail = active >= 1;
        const showShared = active >= 2;
        return (
          <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={6} y={6} width={348} height={30} rx={8} fill={active === 0 ? "#2563eb" : "none"} fillOpacity={active === 0 ? 0.1 : 0} stroke={color(0)} strokeWidth={1} />
            <text x={16} y={26} fontSize={12} fontWeight={700} fill={active === 0 ? "#2563eb" : "#64748b"}>Global memory · 입력과 결과 배열</text>
            <rect x={6} y={42} width={348} height={18} rx={6} fill="none" stroke={color(0)} strokeWidth={1} strokeDasharray="3 3" />
            <text x={16} y={55} fontSize={11} fill="#64748b">cache</text>
            <line x1={180} x2={180} y1={36} y2={42} stroke="#94a3b8" strokeWidth={1} />
            <line x1={180} x2={180} y1={60} y2={68} stroke="#94a3b8" strokeWidth={1} />
            <rect x={6} y={68} width={348} height={190} rx={8} fill="none" stroke={color(0)} strokeWidth={1} />
            <text x={16} y={84} fontSize={12} fontWeight={700} fill={active === 0 ? "#2563eb" : "#64748b"}>SM · 칩 안의 처리 구역</text>
            <rect x={16} y={90} width={328} height={162} rx={8} fill="none" stroke={color(1)} strokeWidth={1} opacity={showBlockDetail ? 1 : 0.35} />
            <text x={26} y={106} fontSize={11} fontWeight={700} fill={active === 1 ? "#2563eb" : "#64748b"} opacity={showBlockDetail ? 1 : 0.35}>thread block · 32×16</text>
            <g opacity={showBlockDetail ? 1 : 0.2}>
              <rect x={GRID_X} y={GRID_Y} width={32 * CELL} height={16 * CELL} fill="#64748b" fillOpacity={0.12} stroke="#94a3b8" strokeWidth={1} />
              <rect x={GRID_X} y={GRID_Y + 5 * CELL} width={32 * CELL} height={CELL} fill="#2563eb" fillOpacity={0.55} />
              <rect x={GRID_X + 3 * CELL} y={GRID_Y + 5 * CELL} width={CELL} height={CELL} fill="#d97706" />
              <text x={GRID_X} y={GRID_Y + 16 * CELL + 14} fontSize={10} fill="#2563eb">파란 줄: warp 하나 (lane 32개)</text>
              <text x={GRID_X} y={GRID_Y + 16 * CELL + 28} fontSize={10} fill="#d97706">주황 칸: lane 하나</text>
            </g>
            <g opacity={showShared ? 1 : 0.2}>
              <text x={TILE_X} y={TILE_Y - 6} fontSize={11} fontWeight={700} fill={active === 2 ? "#2563eb" : "#64748b"}>shared memory · tile</text>
              <rect x={TILE_X} y={TILE_Y} width={32 * TILE_C} height={32 * TILE_C} fill={active === 2 ? "#2563eb" : "#64748b"} fillOpacity={0.12} stroke={color(2)} strokeWidth={1} />
              {active === 3 && <rect x={TILE_X + 3 * TILE_C} y={TILE_Y} width={TILE_C} height={32 * TILE_C} fill="#d97706" fillOpacity={0.7} />}
              {active === 3 && <text x={TILE_X} y={TILE_Y + 32 * TILE_C + 12} fontSize={10} fill="#d97706">같은 열 → 같은 bank일 수 있음</text>}
            </g>
            {active === 2 && (
              <g>
                <LineArrow x1={GRID_X + 32 * CELL + 2} y1={GRID_Y + 5.5 * CELL} x2={TILE_X - 2} y2={GRID_Y + 5.5 * CELL} color="#2563eb" />
                <line x1={196} x2={196} y1={96} y2={246} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                <text x={190} y={246} textAnchor="end" fontSize={10} fontWeight={700} fill="#d97706">barrier: 모두 놓을 때까지</text>
              </g>
            )}
            {active === 3 && (
              <g>
                <LineArrow x1={GRID_X + 128} y1={GRID_Y} x2={GRID_X + 128} y2={38} color="#2563eb" />
                <text x={GRID_X + 133} y={82} fontSize={10} fontWeight={700} fill="#2563eb">sector</text>
                <LineArrow x1={GRID_X + 32 * CELL + 2} y1={GRID_Y + 5.5 * CELL} x2={TILE_X - 2} y2={GRID_Y + 5.5 * CELL} color="#d97706" />
                <text x={194} y={GRID_Y + 5.5 * CELL - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#d97706">bank</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
