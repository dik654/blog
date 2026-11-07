import SceneShell from "./SceneShell";

/**
 * 본문 대응: #layout-and-order — 영역을 나눈 페이지를 어떤 순서로 잇느냐가 문장을 바꾼다.
 * 페이지와 문장은 모두 설명용 예시(가정)이며, 저장 순서 역시 "다를 수 있다"를 보이려는 한 경우다.
 */
const ACCENT = "#6366f1";
const WARN = "#dc2626";
const MUTED = "#64748b";

const SCENES = [
  {
    label: "영역을 나눈다",
    summary: "제목 1 · 본문 4",
    note: "Layout parsing은 페이지를 제목·본문 같은 영역으로 나눕니다. 어느 영역이 먼저인지는 아직 정해지지 않았습니다.",
  },
  {
    label: "저장 순서로 이으면",
    summary: "왼쪽 → 오른쪽 → 왼쪽 → 오른쪽",
    note: "PDF의 저장 순서는 화면 순서와 다를 수 있습니다. 왼쪽 컬럼을 다 읽기 전에 오른쪽으로 건너뛰면 서로 다른 내용이 한 문장처럼 이어집니다.",
  },
  {
    label: "읽는 순서로 정렬하면",
    summary: "왼쪽 전체 → 오른쪽 전체",
    note: "Reading order detection이 영역을 사람이 읽는 순서로 세우면 두 문장이 원래 뜻대로 분리됩니다. PDF 도구 PyMuPDF의 blocks·dict 형식은 이 계산에 쓸 블록 좌표를 제공합니다.",
  },
  {
    label: "표가 끼어들면",
    summary: "좌표만으로는 어긋날 수 있음",
    note: "이미지나 표 영역이 섞인 페이지에서는 좌표만으로 복원한 순서가 여전히 어긋날 수 있습니다. 그래서 번호를 확정하지 않고 물음표로 두었습니다.",
  },
] as const;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  kind: string;
  order: string;
}

const TITLE = { x: 10, y: 10, w: 280, h: 28, text: "분기 보고", kind: "제목" };
const L1 = { x: 10, y: 58, w: 124, h: 56, text: "이번 분기 매출은", kind: "본문" };
const L2 = { x: 10, y: 144, w: 124, h: 56, text: "전년보다 늘었습니다.", kind: "본문" };
const R1 = { x: 166, y: 58, w: 124, h: 56, text: "반품 규정은", kind: "본문" };
const R2 = { x: 166, y: 144, w: 124, h: 56, text: "다음 달부터 바뀝니다.", kind: "본문" };

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 6;
  const left = `${x2 - size * Math.cos(angle - 0.45)},${y2 - size * Math.sin(angle - 0.45)}`;
  const right = `${x2 - size * Math.cos(angle + 0.45)},${y2 - size * Math.sin(angle + 0.45)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <polygon points={`${x2},${y2} ${left} ${right}`} fill={color} />
    </g>
  );
}

function PageBox({ box, accent, kindLabel }: { box: Box; accent: string; kindLabel: boolean }) {
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={4} fill={accent} fillOpacity={0.08} stroke={accent} strokeWidth={1} />
      <text x={box.x + 8} y={box.y + 15} fontSize={10} fontWeight={700} fill={accent}>
        {kindLabel ? box.kind : box.order}
      </text>
      <text x={box.x + 8} y={box.h > 40 ? box.y + 38 : box.y + 19} dx={box.h > 40 ? 0 : 30} fontSize={11} fill={MUTED}>
        {box.text}
      </text>
    </g>
  );
}

function Page({ active }: { active: number }) {
  const orderBoxes: Box[] =
    active === 1
      ? [
          { ...TITLE, order: "1" },
          { ...L1, order: "2" },
          { ...R1, order: "3" },
          { ...L2, order: "4" },
          { ...R2, order: "5" },
        ]
      : [
          { ...TITLE, order: "1" },
          { ...L1, order: "2" },
          { ...L2, order: "3" },
          { ...R1, order: "4" },
          { ...R2, order: "5" },
        ];

  if (active === 3) {
    return (
      <svg viewBox="0 0 300 210" role="img" aria-label="제목 아래 두 컬럼 사이로 표가 가로지르는 페이지" className="h-auto w-full max-w-sm">
        <PageBox box={{ ...TITLE, order: "1" }} accent={ACCENT} kindLabel={false} />
        {[
          { x: 10, y: 48, w: 124, h: 42, text: "본문" },
          { x: 166, y: 48, w: 124, h: 42, text: "본문" },
          { x: 10, y: 158, w: 124, h: 42, text: "본문" },
          { x: 166, y: 158, w: 124, h: 42, text: "본문" },
        ].map((b) => (
          <g key={`${b.x}-${b.y}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
            <text x={b.x + 8} y={b.y + 15} fontSize={10} fontWeight={700} fill={WARN}>?</text>
            <text x={b.x + 8} y={b.y + 32} fontSize={11} fill={MUTED}>{b.text}</text>
          </g>
        ))}
        <rect x={10} y={100} width={280} height={48} rx={4} fill={WARN} fillOpacity={0.08} stroke={WARN} strokeWidth={1} strokeDasharray="4 3" />
        <text x={18} y={115} fontSize={10} fontWeight={700} fill={WARN}>?</text>
        <text x={150} y={129} textAnchor="middle" fontSize={11} fontWeight={700} fill={WARN}>표 영역</text>
      </svg>
    );
  }

  const color = active === 1 ? WARN : ACCENT;
  return (
    <svg viewBox="0 0 300 210" role="img" aria-label="제목과 두 컬럼 네 본문 영역으로 나뉜 페이지" className="h-auto w-full max-w-sm">
      {orderBoxes.map((box) => (
        <PageBox key={box.text} box={box} accent={active === 0 ? MUTED : color} kindLabel={active === 0} />
      ))}
      {active === 1 && (
        <>
          <Arrow x1={72} y1={38} x2={72} y2={56} color={WARN} />
          <Arrow x1={134} y1={86} x2={164} y2={86} color={WARN} />
          <Arrow x1={170} y1={114} x2={130} y2={143} color={WARN} />
          <Arrow x1={134} y1={172} x2={164} y2={172} color={WARN} />
        </>
      )}
      {active === 2 && (
        <>
          <Arrow x1={72} y1={38} x2={72} y2={56} color={ACCENT} />
          <Arrow x1={72} y1={114} x2={72} y2={142} color={ACCENT} />
          <Arrow x1={134} y1={150} x2={164} y2={110} color={ACCENT} />
          <Arrow x1={228} y1={114} x2={228} y2={142} color={ACCENT} />
        </>
      )}
    </svg>
  );
}

function Output({ active }: { active: number }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-bold text-muted-foreground">이어 붙인 결과</p>
      {active === 0 && <p className="mt-2 text-sm leading-6 text-muted-foreground">아직 순서가 없어 이을 수 없습니다.</p>}
      {active === 1 && (
        <p className="mt-2 text-sm font-semibold leading-6">
          <span className="text-muted-foreground">분기 보고</span> 이번 분기 매출은 <span style={{ color: WARN }}>반품 규정은</span> 전년보다 늘었습니다. 다음 달부터 바뀝니다.
        </p>
      )}
      {active === 2 && (
        <p className="mt-2 text-sm font-semibold leading-6">
          <span className="text-muted-foreground">분기 보고</span> 이번 분기 매출은 전년보다 늘었습니다. <span style={{ color: ACCENT }}>반품 규정은</span> 다음 달부터 바뀝니다.
        </p>
      )}
      {active === 3 && <p className="mt-2 text-sm leading-6 text-muted-foreground">표 앞뒤 본문과 표를 어떤 순서로 이을지 좌표만으로 정하면 어긋날 수 있습니다.</p>}
    </div>
  );
}

export default function ReadingOrderViz() {
  return (
    <SceneShell
      eyebrow="Layout · reading order"
      title="같은 2단 페이지도 잇는 순서에 따라 다른 문장이 됩니다"
      description="칸은 layout parsing이 나눈 영역이고, 번호는 텍스트를 이어 붙이는 순서입니다. 페이지 내용과 저장 순서는 설명을 위한 예시입니다(가정)."
      ariaLabel="2단 페이지에서 저장 순서와 읽는 순서가 만드는 문장 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:items-center">
          <Page active={active} />
          <Output active={active} />
        </div>
      )}
    />
  );
}
