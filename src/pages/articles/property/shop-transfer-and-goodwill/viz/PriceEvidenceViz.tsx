import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 2,000 + 300 + 1,000 = 3,300만 원을 칸마다 다른 자료로 확인한다.
 * 막대 길이 = 만 원 비례.
 */
const W = 340;
const H = 92;
const X0 = 8;
const UNIT = (W - 2 * X0) / 3300;
const BAR_Y = 30;
const BAR_H = 48;

const px = (value: number) => X0 + value * UNIT;

const FACILITY = "#64748b";
const STOCK = "#b45309";
const GOODWILL = "#2563eb";
const TEXT = "#64748b";

type Part = "facility" | "stock" | "goodwill";

const SCENES: readonly { label: string; summary: string; note: string; focus: Part | null; heading: string; items: readonly string[]; verdict: string }[] = [
  { label: "한 덩어리 값", summary: "2,000 + 300 + 1,000 = 3,300만", note: "실제 거래 통계나 세법상 배분이 아닌 설명용 가격 합의 (가정)입니다. 숫자 하나로 합치기 전에 칸마다 확인 방법이 다르다는 점을 봅니다.", focus: null, heading: "이 3,300만 원에서 뺀 것", items: ["보증금", "세금", "중개비", "인수 뒤 운영 자금"], verdict: "세 칸의 합만 봅니다" },
  { label: "시설 칸", summary: "2,000만", note: "손에 잡히는 물건이라 눈앞에서 대조할 수 있습니다. 소유자가 다르면 이 칸의 값을 기존 점주에게 낼 근거가 없어집니다.", focus: "facility", heading: "확인할 것", items: ["장비 번호", "소유자", "작동 상태"], verdict: "대조해 볼 수 있습니다" },
  { label: "재고 칸", summary: "300만", note: "가장 작은 칸이지만 수량과 사용기한을 직접 셉니다. 인수일에 실제 수량과 미리 합의한 단가로 다시 계산하므로 금액이 움직일 수 있는 칸입니다.", focus: "stock", heading: "셀 것", items: ["수량", "사용기한"], verdict: "세어 볼 수 있습니다" },
  { label: "미래 손님 칸", summary: "1,000만", note: "기존 손님이 계속 올 가능성에 준 값입니다. 앞의 두 칸과 달리 자료를 아무리 검토해도 미래의 일이라 확정 현금으로 바뀌지 않습니다.", focus: "goodwill", heading: "검토할 것", items: ["과거 매출 자료", "새 임대료"], verdict: "검토해도 기대로 남습니다" },
];

function Stage({ step }: { step: number }) {
  const scene = SCENES[step];
  const op = (part: Part) => (scene.focus === null || scene.focus === part ? 1 : 0.3);
  const expected = scene.focus === "goodwill";
  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
        <text x={px(2150)} y={BAR_Y - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={STOCK} opacity={op("stock")}>재고 300</text>
        <rect x={px(0)} y={BAR_Y} width={2000 * UNIT} height={BAR_H} fill={FACILITY} opacity={op("facility")} />
        <text x={px(1000)} y={BAR_Y + 29} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff" opacity={op("facility")}>시설 2,000</text>
        <rect x={px(2000)} y={BAR_Y} width={300 * UNIT} height={BAR_H} fill={STOCK} opacity={op("stock")} />
        <rect x={px(2300) + 0.5} y={BAR_Y + 0.5} width={1000 * UNIT - 1} height={BAR_H - 1} fill="none" stroke={GOODWILL} strokeWidth={1.25} strokeDasharray="4 3" opacity={op("goodwill")} />
        <text x={px(2800)} y={BAR_Y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={GOODWILL} opacity={op("goodwill")}>미래 손님</text>
        <text x={px(2800)} y={BAR_Y + 39} textAnchor="middle" fontSize={13} fontWeight={700} fill={GOODWILL} opacity={op("goodwill")}>1,000</text>
        <text x={W - X0} y={BAR_Y - 8} textAnchor="end" fontSize={13} fill={TEXT}>단위: 만 원</text>
      </svg>
      <p className="mt-3 text-xs font-semibold text-muted-foreground">{scene.heading}</p>
      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {scene.items.map((item) => (
          <li key={item} className="min-w-0 border-l border-primary/50 pl-2 leading-6">{item}</li>
        ))}
      </ul>
      <p className={`mt-3 text-sm font-semibold ${expected ? "text-amber-700 dark:text-amber-400" : "text-primary"}`}>{scene.verdict}</p>
    </div>
  );
}

export default function PriceEvidenceViz() {
  return (
    <SceneShell
      eyebrow="대금 나누기"
      title="3천300만 원의 세 칸은 확인하는 방법이 서로 다릅니다"
      description="막대 길이는 금액에 비례합니다. 점선 칸은 물건이 아니라 기대에 준 값입니다. 금액은 설명용 가격 합의 (가정)입니다."
      ariaLabel="3천300만 원을 시설, 재고, 미래 손님으로 나누고 칸마다 확인할 자료를 보여 주는 막대"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
