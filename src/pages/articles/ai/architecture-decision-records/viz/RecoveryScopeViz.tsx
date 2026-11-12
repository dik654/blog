import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case, #inside-decision — 프로필 200개, 잘못된 변경은 A 하나.
 * 파일 1개면 복구 단위가 200개 전체, 프로필별 파일이면 A의 파일 하나.
 * 파일을 나눠도 여러 프로필 함께 갱신(원자성)과 같은 A 파일 동시 쓰기·중단은 남는다.
 */
const COLS = 20;
const ROWS = 10;
const CELL = 13;
const STEP = 16;
const GX = 21;
const GY = 34;
const CELLS = Array.from({ length: COLS * ROWS }, (_, index) => index);

const SCENES = [
  { label: "파일 1개", summary: "복구 단위 = 프로필 200개", note: "잘못 바뀐 것은 A 하나인데 백업에서 되돌리는 단위는 200개가 함께 든 파일 하나입니다. 나머지 199개를 건드리지 않으려면 A만 골라 합치는 절차가 따로 필요합니다." },
  { label: "프로필별 파일", summary: "복구 단위 = A 파일 1개", note: "프로필마다 파일을 두면 A의 파일만 복구 대상으로 삼을 수 있습니다. 대신 파일 수가 1개에서 200개로 늘고 백업 관리도 늘어납니다." },
  { label: "여러 프로필 함께 갱신", summary: "A·B 새 값 · C 옛 값", note: "세 프로필을 한 번에 바꾸다 중간에 멈췄다고 합시다(가정). 일부 파일만 새 값이 됩니다. 파일을 나눈다고 여러 프로필 갱신의 일관성(원자성) 문제가 풀리지는 않습니다." },
  { label: "같은 A 파일", summary: "동시 쓰기 · 저장 중단 → 손실 가능", note: "파일을 나눠도 같은 A 파일에 두 작업자가 동시에 쓰거나 저장 도중 중단되면 손실이 날 수 있습니다. 임시 파일에서 교체하는 절차, 쓰기 조정, 백업 검증을 이 선택의 후속 일로 남깁니다." },
] as const;

const RED = "#dc2626";
const BLUE = "#2563eb";
const GRAY = "#64748b";
const LIGHT = "#94a3b8";

function Grid({ split }: { split: boolean }) {
  const right = GX + COLS * STEP - (STEP - CELL);
  const bottom = GY + ROWS * STEP - (STEP - CELL);
  return (
    <g>
      {!split && <rect x={GX - 6} y={GY - 6} width={right - GX + 12} height={bottom - GY + 12} rx={6} fill="none" stroke={RED} strokeWidth={1.25} strokeDasharray="4 3" />}
      {CELLS.map((index) => {
        const x = GX + (index % COLS) * STEP;
        const y = GY + Math.floor(index / COLS) * STEP;
        const isA = index === 0;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={CELL}
            height={CELL}
            rx={2}
            fill={isA ? RED : LIGHT}
            fillOpacity={isA ? 0.85 : 0.25}
            stroke={split ? (isA ? RED : LIGHT) : "none"}
            strokeWidth={split && isA ? 1.25 : 1}
          />
        );
      })}
      {split && <rect x={GX - 4} y={GY - 4} width={CELL + 8} height={CELL + 8} rx={4} fill="none" stroke={RED} strokeWidth={1.25} strokeDasharray="4 3" />}
      <text x={GX} y={GY - 14} fontSize={11} fontWeight={700} fill={RED}>{split ? "복구 대상: A 파일 1개" : "복구 대상: 파일 1개 = 프로필 200개"}</text>
      <text x={GX + 3} y={GY + 10} fontSize={9} fontWeight={700} fill="#ffffff">A</text>
      <text x={GX} y={bottom + 22} fontSize={10} fill={GRAY}>{split ? "칸 하나 = 파일 하나 (200개)" : "칸 하나 = 프로필 하나, 바깥 테두리 = 파일 하나"}</text>
    </g>
  );
}

function FileBox({ x, y, name, state }: { x: number; y: number; name: string; state: "new" | "old" }) {
  const color = state === "new" ? BLUE : GRAY;
  return (
    <g>
      <rect x={x} y={y} width={84} height={58} rx={6} fill={color} fillOpacity={state === "new" ? 0.12 : 0.06} stroke={color} strokeWidth={1} />
      <text x={x + 42} y={y + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{name} 파일</text>
      <text x={x + 42} y={y + 43} textAnchor="middle" fontSize={11} fill={color}>{state === "new" ? "새 값" : "옛 값"}</text>
    </g>
  );
}

function PartialUpdate() {
  return (
    <g>
      <text x={20} y={30} fontSize={11} fontWeight={700} fill={GRAY}>A·B·C를 함께 바꾸는 작업 (가정)</text>
      <FileBox x={20} y={62} name="A" state="new" />
      <FileBox x={138} y={62} name="B" state="new" />
      <FileBox x={256} y={62} name="C" state="old" />
      <line x1={239} x2={239} y1={52} y2={130} stroke={RED} strokeWidth={1.25} strokeDasharray="4 3" />
      <text x={239} y={146} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>여기서 중단</text>
      <text x={20} y={180} fontSize={10} fill={GRAY}>세 파일이 함께 바뀌었는지 함께 그대로인지가 보장되지 않음</text>
    </g>
  );
}

function SameFile() {
  return (
    <g>
      <text x={20} y={30} fontSize={11} fontWeight={700} fill={GRAY}>두 작업자가 같은 A 파일에 쓰는 경우 (가정)</text>
      <rect x={20} y={46} width={92} height={30} rx={6} fill="none" stroke={GRAY} strokeWidth={1} />
      <text x={66} y={65} textAnchor="middle" fontSize={11} fill={GRAY}>작업자 1</text>
      <rect x={20} y={104} width={92} height={30} rx={6} fill="none" stroke={GRAY} strokeWidth={1} />
      <text x={66} y={123} textAnchor="middle" fontSize={11} fill={GRAY}>작업자 2</text>
      <line x1={112} y1={61} x2={190} y2={84} stroke={GRAY} strokeWidth={1} />
      <line x1={112} y1={119} x2={190} y2={98} stroke={GRAY} strokeWidth={1} />
      <rect x={190} y={56} width={84} height={70} rx={6} fill={RED} fillOpacity={0.06} stroke={RED} strokeWidth={1.25} />
      <text x={232} y={78} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>A 파일</text>
      <rect x={202} y={90} width={60} height={10} rx={2} fill="none" stroke={RED} strokeWidth={1} />
      <rect x={202} y={90} width={28} height={10} rx={2} fill={RED} fillOpacity={0.7} />
      <text x={232} y={116} textAnchor="middle" fontSize={10} fill={RED}>쓰다 중단</text>
      <text x={20} y={164} fontSize={10} fontWeight={700} fill={BLUE}>후속 일</text>
      <text x={20} y={182} fontSize={10} fill={BLUE}>임시 파일에서 교체 · 쓰기 조정 · 백업 검증</text>
    </g>
  );
}

export default function RecoveryScopeViz() {
  return (
    <SceneShell
      eyebrow="복구 단위"
      title="A 하나를 되돌릴 때 함께 움직이는 범위"
      description="3절의 설명용 조건입니다(가정): 프로필 200개, 잘못된 변경은 A 하나, 작업자 1개. 빨간 점선이 백업에서 되돌리는 단위입니다."
      ariaLabel="파일 1개와 프로필별 파일의 복구 범위, 그리고 파일을 나눠도 남는 갱신 문제"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 220" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Grid split={false} />}
          {active === 1 && <Grid split />}
          {active === 2 && <PartialUpdate />}
          {active === 3 && <SameFile />}
        </svg>
      )}
    />
  );
}
