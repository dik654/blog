import SceneShell from "./SceneShell";

/**
 * 본문 대응: #token-id-embedding-matrix — ID 42107은 V×d 표의 한 행을 꺼내는 주소이고,
 * 128,000 × 4,096 × 2 byte = 1,048,576,000 byte ≈ 0.98 GiB, untied면 한 번 더(≈ 1.95 GiB).
 */
const V = 128000;
const ID = 42107;
const ELEMENTS = V * 4096; // 524,288,000
const BYTES = ELEMENTS * 2; // 1,048,576,000
const GIB = 1024 ** 3;

const fmt = (n: number) => n.toLocaleString("en-US");

const SCENES = [
  { label: "ID는 행 번호입니다", summary: "ID 42107 → E[42107]", note: "Embedding matrix E는 vocabulary 항목 하나에 한 행씩, 모두 128,000행을 가진 표입니다. ID 42107을 받으면 model은 그 번호의 행 하나를 그대로 꺼내고, 그 행에 든 4,096개 숫자가 token의 첫 vector가 됩니다." },
  { label: "표 전체의 칸 수", summary: `128,000 × 4,096 = ${fmt(ELEMENTS)}`, note: "행 하나에 4,096칸이 있고 행이 128,000개이므로 표에는 5억 2,428만 8천 개의 숫자가 들어 있습니다. 이 숫자들이 모두 학습되는 값입니다." },
  { label: "숫자 하나에 2 byte", summary: `${fmt(BYTES)} byte ≈ ${(BYTES / GIB).toFixed(2)} GiB`, note: "FP16은 숫자 하나를 2 byte로 저장합니다. 칸 수에 2를 곱하면 10억 4,857만 6천 byte이고, 1 GiB(2³⁰ = 1,073,741,824 byte)로 나누면 약 0.98 GiB입니다." },
  { label: "Untied면 표가 하나 더", summary: `× 2 = ${fmt(BYTES * 2)} byte ≈ ${((BYTES * 2) / GIB).toFixed(2)} GiB`, note: "Input embedding과 output head가 같은 표를 공유하지 않으면(untied) 같은 크기의 V×d 표가 하나 더 필요합니다. 두 표를 합치면 약 1.95 GiB입니다." },
] as const;

const MX = 46;
const MY = 30;
const MW = 104;
const MH = 140;
const ROW_Y = MY + (MH * ID) / V;

const LINES = [
  { from: 1, text: `128,000행 × 4,096열 = ${fmt(ELEMENTS)}칸` },
  { from: 2, text: `× 2 byte(FP16) = ${fmt(BYTES)} byte ≈ 0.98 GiB` },
  { from: 3, text: `untied: × 2 = ${fmt(BYTES * 2)} byte ≈ 1.95 GiB` },
] as const;

export default function EmbeddingTableViz() {
  return (
    <SceneShell
      eyebrow="Token ID → embedding row"
      title="ID는 표의 행 번호이고, 표의 크기는 행 수 × 열 수 × byte입니다"
      description="세로 128,000행은 vocabulary 크기 V, 가로 4,096열은 d_model(token 하나를 나타내는 vector의 길이)입니다. 강조한 가로줄이 ID 42107의 행입니다."
      ariaLabel="Token ID 42107이 embedding matrix의 한 행을 가리키고, 표 크기가 0.98 GiB, untied일 때 1.95 GiB가 되는 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={MX + MW / 2} y={MY - 10} textAnchor="middle" fontSize={11} fill="#64748b">d = 4,096열</text>
            <text x={MX - 8} y={MY + 8} textAnchor="end" fontSize={10} fill="#64748b">0</text>
            <text x={MX - 8} y={MY + MH} textAnchor="end" fontSize={10} fill="#64748b">127,999</text>
            <text x={MX - 8} y={MY + MH / 2 + 20} textAnchor="end" fontSize={10} fill="#64748b">V행</text>
            <rect x={MX} y={MY} width={MW} height={MH} rx={2} fill={active >= 1 ? "#dbeafe" : "#f1f5f9"} stroke="#64748b" strokeWidth={1} />
            <text x={MX + MW / 2} y={MY + MH + 16} textAnchor="middle" fontSize={11} fill="#334155" fontWeight={700}>input embedding E</text>
            <rect x={MX} y={ROW_Y - 2} width={MW} height={4} fill="#2563eb" />
            <text x={MX - 8} y={ROW_Y + 4} textAnchor="end" fontSize={10} fill="#2563eb" fontWeight={700}>42107</text>
            {active === 0 && (
              <g>
                <line x1={MX + MW + 4} y1={ROW_Y} x2={MX + MW + 36} y2={ROW_Y} stroke="#2563eb" strokeWidth={1.25} />
                <path d={`M ${MX + MW + 36} ${ROW_Y - 4} L ${MX + MW + 42} ${ROW_Y} L ${MX + MW + 36} ${ROW_Y + 4} Z`} fill="#2563eb" />
                <rect x={MX + MW + 46} y={ROW_Y - 9} width={150} height={18} rx={2} fill="#ffffff" stroke="#2563eb" strokeWidth={1} />
                {Array.from({ length: 9 }, (_, i) => (
                  <line key={i} x1={MX + MW + 46 + 15 * (i + 1)} y1={ROW_Y - 9} x2={MX + MW + 46 + 15 * (i + 1)} y2={ROW_Y + 9} stroke="#93c5fd" strokeWidth={1} />
                ))}
                <text x={MX + MW + 121} y={ROW_Y + 28} textAnchor="middle" fontSize={11} fill="#1e3a8a">E[42107]: 숫자 4,096개</text>
                <text x={MX + MW + 121} y={ROW_Y + 44} textAnchor="middle" fontSize={10} fill="#64748b">(칸 10개로 줄여 그림)</text>
              </g>
            )}
            {active === 3 && (
              <g>
                <rect x={210} y={MY} width={MW} height={MH} rx={2} fill="#fef3c7" stroke="#b45309" strokeWidth={1} />
                <text x={210 + MW / 2} y={MY - 10} textAnchor="middle" fontSize={11} fill="#64748b">d = 4,096열</text>
                <text x={210 + MW / 2} y={MY + MH + 16} textAnchor="middle" fontSize={11} fill="#92400e" fontWeight={700}>output head</text>
                <text x={210 + MW / 2} y={MY + MH / 2 + 4} textAnchor="middle" fontSize={11} fill="#92400e">≈ 0.98 GiB</text>
                <text x={180} y={MY + MH / 2 + 4} textAnchor="middle" fontSize={14} fill="#334155">+</text>
              </g>
            )}
            {(active === 1 || active === 2) && (
              <text x={MX + MW / 2} y={MY + MH / 2 + 30} textAnchor="middle" fontSize={11} fill="#1e3a8a" fontWeight={700}>{active === 1 ? "524,288,000칸" : "≈ 0.98 GiB"}</text>
            )}
          </svg>
          <div className="mt-3 space-y-1 font-mono text-xs leading-5 sm:text-sm">
            {LINES.map((line) => (
              <p key={line.from} className={`break-words ${active >= line.from ? "text-foreground" : "text-muted-foreground/40"}`}>
                {line.text}
              </p>
            ))}
          </div>
        </div>
      )}
    />
  );
}
