import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proof-withdrawal-boundary 첫째 문단과 R 계산.
 * 고객은 자기 leaf가 liability root에 포함됐는지 확인할 수 있지만, 그것만으로 다른 고객이 모두 포함됐는지,
 * 자산이 담보로 묶이지 않았는지는 알 수 없다.
 * 검증 자산 105 BTC / 포함 채무 100 BTC = 1.05. 숨은 채무 20 BTC가 있으면 105 / 120 = 0.875.
 * 4명짜리 tree와 고객 B·C·D·E는 설명용 가정이다.
 */
const ASSET = 105;
const INCLUDED = 100;
const HIDDEN = 20;
const R_INCLUDED = ASSET / INCLUDED;
const R_ALL = ASSET / (INCLUDED + HIDDEN);

const SCENES = [
  {
    label: "민지가 자기 leaf를 확인",
    summary: "민지 leaf → root 일치",
    note: "Leaf는 고객 한 명의 채무를 해시한 맨 아래 값이고, 두 개씩 묶어 해시하며 올라간 꼭대기 값이 liability root입니다. 민지는 자기 leaf와 곁가지 값(파란 테두리)만 받아 root까지 다시 계산하고, 공개된 root와 같으면 자기 채무가 포함됐다고 확인합니다.",
  },
  {
    label: "트리 밖 채무는 안 보임",
    summary: "민지 확인은 여전히 성공",
    note: "고객 E의 채무(가정)가 tree에 아예 들어가지 않았어도 민지의 계산 경로에는 E가 나오지 않습니다. 민지의 확인은 그대로 성공하므로, 이 사실만으로 다른 고객이 모두 포함됐다고 알 수는 없습니다.",
  },
  {
    label: "숨은 채무 20 BTC",
    summary: `${R_INCLUDED.toFixed(2)} → ${R_ALL.toFixed(3)}`,
    note: "포함 채무 100 BTC에 검증 자산 105 BTC를 대면 R=1.05입니다. 포함되지 않은 채무가 20 BTC 있다면 전체 채무는 120 BTC이고 105÷120=0.875로 1 아래입니다. 그래서 채무 모집단 완전성은 별도 증거로 확인합니다.",
  },
  {
    label: "자산 쪽도 따로",
    summary: "담보로 묶였는지는 leaf로 알 수 없음",
    note: "Leaf 확인은 채무 쪽 tree만 다룹니다. 105 BTC가 담보로 묶였는지는 이 확인으로 알 수 없어, 그 크기를 그림에 정하지 않았습니다. 자산의 법적·운영 통제는 별도 증거입니다.",
  },
] as const;

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const SLATE = "#64748b";
const RED = "#dc2626";

function Node({ x, y, label, stroke, dashed = false, bold = false }: { x: number; y: number; label: string; stroke: string; dashed?: boolean; bold?: boolean }) {
  return (
    <g>
      <rect x={x - 32} y={y - 13} width={64} height={26} rx={6} fill="none" stroke={stroke} strokeWidth={bold ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={bold ? 700 : 400} fill={stroke === SLATE ? "#475569" : stroke}>{label}</text>
    </g>
  );
}

function Tree({ showHidden }: { showHidden: boolean }) {
  const leaves = [
    { x: 46, label: "민지 2", stroke: GREEN, bold: true },
    { x: 122, label: "고객 B", stroke: BLUE, bold: false },
    { x: 198, label: "고객 C", stroke: SLATE, bold: false },
    { x: 274, label: "고객 D", stroke: SLATE, bold: false },
  ];
  const leafY = 160;
  const midY = 98;
  const rootY = 36;
  return (
    <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={showHidden ? "tree 밖의 고객 E와 성공한 민지의 포함 확인" : "민지 leaf에서 liability root까지 다시 계산하는 경로"}>
      <line x1={46} y1={leafY - 13} x2={84} y2={midY + 13} stroke={GREEN} strokeWidth={1.25} />
      <line x1={122} y1={leafY - 13} x2={84} y2={midY + 13} stroke={SLATE} strokeWidth={1} />
      <line x1={198} y1={leafY - 13} x2={236} y2={midY + 13} stroke={SLATE} strokeWidth={1} />
      <line x1={274} y1={leafY - 13} x2={236} y2={midY + 13} stroke={SLATE} strokeWidth={1} />
      <line x1={84} y1={midY - 13} x2={160} y2={rootY + 13} stroke={GREEN} strokeWidth={1.25} />
      <line x1={236} y1={midY - 13} x2={160} y2={rootY + 13} stroke={SLATE} strokeWidth={1} />
      <Node x={160} y={rootY} label="root ✓" stroke={GREEN} bold />
      <Node x={84} y={midY} label="민지+B" stroke={GREEN} bold />
      <Node x={236} y={midY} label="C+D" stroke={BLUE} />
      {leaves.map((l) => (
        <Node key={l.label} x={l.x} y={leafY} label={l.label} stroke={l.stroke} bold={l.bold} />
      ))}
      <text x={46} y={leafY + 28} textAnchor="middle" fontSize={10} fill="#475569">BTC</text>
      {showHidden ? (
        <g>
          <Node x={324} y={midY} label="고객 E" stroke={RED} dashed />
          <text x={324} y={midY + 28} textAnchor="middle" fontSize={10} fill={RED}>tree 밖</text>
        </g>
      ) : null}
    </svg>
  );
}

function Bar({ label, value, scale, color, unknown = false }: { label: string; value: number; scale: number; color: string; unknown?: boolean }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_4rem] items-center gap-2 text-xs">
      <span className="font-semibold">{label}</span>
      <div className="h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="flex h-full items-center justify-end rounded-sm pr-1.5" style={{ width: `${(value / scale) * 100}%`, backgroundColor: color }}>
          {unknown ? <span className="text-[10px] font-bold text-white">담보 여부 ?</span> : null}
        </div>
      </div>
      <span className="text-right font-mono">{value} BTC</span>
    </div>
  );
}

function Ratio({ unknownAsset }: { unknownAsset: boolean }) {
  const scale = INCLUDED + HIDDEN;
  return (
    <div className="space-y-2">
      <Bar label="검증 자산" value={ASSET} scale={scale} color={BLUE} unknown={unknownAsset} />
      <Bar label="포함 채무" value={INCLUDED} scale={scale} color={GREEN} />
      <div className={unknownAsset ? "opacity-40" : ""}>
        <Bar label="포함+숨은 채무" value={INCLUDED + HIDDEN} scale={scale} color={RED} />
      </div>
      <div className="grid gap-2 pt-2 text-xs sm:grid-cols-2">
        <p className="rounded-md border border-border px-2 py-1.5"><span className="font-mono font-bold">105 ÷ 100 = {R_INCLUDED.toFixed(2)}</span> · 포함 채무 기준</p>
        <p className={`rounded-md border px-2 py-1.5 ${unknownAsset ? "border-border opacity-40" : "border-red-600"}`}><span className="font-mono font-bold">105 ÷ 120 = {R_ALL.toFixed(3)}</span> · 숨은 20 BTC 포함</p>
      </div>
    </div>
  );
}

export default function PorInclusionViz() {
  return (
    <SceneShell
      eyebrow="PoR leaf 확인"
      title="내 leaf가 들어 있다는 확인은 남이 빠졌는지까지 알려 주지 않습니다"
      description="고객 채무를 leaf로 둔 4명짜리 tree는 설명용 가정입니다. 105 BTC·100 BTC·숨은 채무 20 BTC는 글의 예시 숫자입니다."
      ariaLabel="민지의 leaf 포함 확인, tree 밖 채무, 숨은 채무 20 BTC가 바꾸는 비율, 자산 담보 여부"
      scenes={SCENES}
      render={(active) => (active < 2 ? <Tree showHidden={active === 1} /> : <Ratio unknownAsset={active === 3} />)}
    />
  );
}
