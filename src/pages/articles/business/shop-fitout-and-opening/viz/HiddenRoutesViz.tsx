import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 장비가 요구하는 길을 도면에 먼저 놓고, 추가 작업 800만 원을 언제 찾느냐를 비교한다.
 * 800만 원은 3절의 추가 전기·배기 가정이다. 뜯는 비용은 본문에 금액이 없으므로 크기를 그리지 않는다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const SLATE = "#94a3b8";
const LABEL = "#64748b";
const PANEL = "#cbd5e1";

const SCENES = [
  {
    label: "먼저 길을 놓습니다",
    summary: "전력·가스·물·냄새의 길",
    note: "실제 장비가 요구하는 전력과 가스, 물이 들어오고 빠지는 경로, 냄새가 나가는 곳입니다. 이 길을 도면에 먼저 놓으면 어디를 지나갈지 마감 전에 알 수 있습니다.",
  },
  {
    label: "닫기 전에 찾으면",
    summary: "추가 작업 800만 원",
    note: "주황색 선이 3절에서 가정한 추가 전기·배기 작업입니다. 벽과 바닥이 아직 열려 있으면 뜯어낼 마감이 없고, 금액은 추가 작업 800만 원으로 적습니다.",
  },
  {
    label: "닫은 뒤에 찾으면",
    summary: "800만 원 + 뜯는 비용",
    note: "같은 작업을 벽 마감 뒤에 발견하면 완성한 부분을 뜯는 비용까지 생깁니다. 본문은 그 금액을 정하지 않았으므로 아래 빨간 칸에 금액 없이 적었습니다.",
  },
] as const;

function Route({ d, color }: { d: string; color: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={1.25} />;
}

function Section({ scene }: { scene: number }) {
  const closed = scene === 2;
  const extra = scene === 0 ? BLUE : AMBER;
  const other = scene === 0 ? BLUE : SLATE;
  const panelProps = closed
    ? { fill: PANEL, stroke: SLATE, strokeWidth: 1 }
    : { fill: "none", stroke: SLATE, strokeWidth: 1, strokeDasharray: "3 3" };
  return (
    <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`점포 단면: ${SCENES[scene].label}`}>
      <line x1={340} y1={52} x2={340} y2={172} stroke={SLATE} strokeWidth={1} />

      {/* 장비가 요구하는 길 */}
      <Route d="M24 16 V152 H72" color={other} />
      <Route d="M44 16 V132 H72" color={extra} />
      <Route d="M14 186 H100 V172" color={other} />
      <Route d="M130 172 V186 H348" color={other} />
      <Route d="M117 106 V40 H348" color={extra} />
      <polygon points="66,149 72,152 66,155" fill={other} />
      <polygon points="66,129 72,132 66,135" fill={extra} />
      <polygon points="97,178 100,172 103,178" fill={other} />
      <polygon points="342,183 348,186 342,189" fill={other} />
      <polygon points="342,37 348,40 342,43" fill={extra} />

      {/* 벽·바닥·천장 마감: 닫으면 그 안의 길을 가린다 */}
      <rect x={14} y={28} width={40} height={172} {...panelProps} />
      <rect x={54} y={28} width={286} height={24} {...panelProps} />
      <rect x={54} y={172} width={286} height={28} {...panelProps} />

      {/* 조리 장비 */}
      <rect x={72} y={116} width={90} height={56} rx={3} fill="none" stroke={LABEL} strokeWidth={1} />
      <polygon points="100,116 134,116 124,106 110,106" fill="none" stroke={LABEL} strokeWidth={1} />
      <text x={117} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill={LABEL}>조리 장비</text>

      {/* 길 이름 */}
      <text x={22} y={11} textAnchor="middle" fontSize={12} fontWeight={700} fill={other}>가스</text>
      <text x={49} y={11} textAnchor="middle" fontSize={12} fontWeight={700} fill={extra}>전력</text>
      <text x={344} y={20} textAnchor="end" fontSize={12} fontWeight={700} fill={extra}>냄새가 나가는 곳(배기)</text>
      <text x={14} y={218} fontSize={12} fontWeight={700} fill={other}>물 들어옴</text>
      <text x={344} y={218} textAnchor="end" fontSize={12} fontWeight={700} fill={other}>물 빠짐</text>

      {/* 현재 상태 */}
      <text x={254} y={108} textAnchor="middle" fontSize={13} fontWeight={700} fill={closed ? "#dc2626" : LABEL}>
        {closed ? "마감 닫힘" : "벽·바닥 열림"}
      </text>
      <text x={254} y={126} textAnchor="middle" fontSize={12} fill={LABEL}>
        {closed ? "안쪽 길이 보이지 않음" : "안쪽 길이 보임"}
      </text>
    </svg>
  );
}

export default function HiddenRoutesViz() {
  return (
    <SceneShell
      eyebrow="설비 경로"
      title="같은 추가 작업도 벽을 닫은 뒤에 찾으면 뜯는 비용이 붙습니다"
      description="점포를 옆에서 자른 그림입니다. 선은 장비에 필요한 길이고 점선 칸은 아직 열린 벽·바닥 자리이며, 마감으로 닫으면 회색 판이 됩니다. 배치와 선의 위치는 설명용 가정입니다."
      note="800만 원은 3절의 가정(추가 전기·배기 작업)이며 실제 금액은 견적과 현장에 따라 달라집니다."
      ariaLabel="벽을 닫기 전과 닫은 뒤에 추가 작업을 찾을 때의 비용 비교"
      scenes={SCENES}
      render={(scene) => (
        <div key={scene} className="min-w-0">
          <Section scene={scene} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs leading-5 sm:text-sm">
            <div className="rounded-lg border border-border bg-background px-3 py-2">
              <span className="block text-muted-foreground">추가 작업</span>
              <span className="block font-mono font-bold">{scene === 0 ? "아직 찾기 전" : "800만 원 (가정)"}</span>
            </div>
            <div className={`rounded-lg border px-3 py-2 ${scene === 2 ? "border-dashed border-red-600" : "border-border bg-background"}`}>
              <span className="block text-muted-foreground">완성한 부분을 뜯는 비용</span>
              <span className={`block font-bold ${scene === 2 ? "text-red-700 dark:text-red-400" : ""}`}>
                {scene === 0 ? "아직 찾기 전" : scene === 1 ? "뜯을 마감이 아직 없음" : "추가로 생김 · 금액 미정"}
              </span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
