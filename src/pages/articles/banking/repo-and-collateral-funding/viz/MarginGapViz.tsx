import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 현금 채무를 95억으로 단순화(가정).
 * 90×.95=85.5 → 부족 9.5 · 95÷.95=100 → 담보 +10 · 90×.9=81 → 부족 14 · 100×.9=90 → 부족 5.
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  base: number;
  added: number;
  haircut: number;
}

const DEBT = 95;
const SCENES: readonly Scene[] = [
  { label: "처음", summary: "100 × 0.95 = 95억", base: 100, added: 0, haircut: 5, note: "담보 100억 원에서 5% 헤어컷을 뗀 인정 금액이 현금 채무 95억 원과 딱 맞습니다." },
  { label: "가격이 90억으로", summary: "90 × 0.95 = 85.5억 · 부족 9.5억", base: 90, added: 0, haircut: 5, note: "인정 금액이 85.5억 원으로 내려가 95억 원 선에 9.5억 원 못 미칩니다. 이만큼을 현금으로 갚거나 같은 인정률의 담보를 보충해야 합니다." },
  { label: "담보로 채우면", summary: "95 ÷ 0.95 = 100억 · 담보 +10억", base: 90, added: 10, haircut: 5, note: "추가한 담보에도 5%를 공제하므로 10억 원을 넣어야 9.5억 원이 인정됩니다. 현금 9.5억 원과 담보 10억 원은 같은 부족분을 메웁니다." },
  { label: "헤어컷도 10%로", summary: "90 × 0.90 = 81억 · 부족 14억", base: 90, added: 0, haircut: 10, note: "계약에 따라 공제율을 다시 정하거나 새 거래를 맺으며 헤어컷이 10%로 오르면, 같은 90억 원 담보의 허용액은 81억 원, 부족액은 14억 원입니다." },
  { label: "가격은 그대로, 헤어컷만", summary: "100 × 0.90 = 90억 · 부족 5억", base: 100, added: 0, haircut: 10, note: "가격이 100억 원 그대로여도 헤어컷이 10%면 조달액은 90억 원으로 줄어 95억 원에 5억 원 모자랍니다. 가격 전망을 맞혀도 차입이 유지되지는 않습니다." },
];

const W = 380;
const LEFT = 78;
const BAR_W = 270;
const x = (value: number) => LEFT + (value / 110) * BAR_W;
const ROW_H = 26;
const ROWS = [30, 76, 122];

function RowLabel({ y, top, bottom }: { y: number; top: string; bottom: string }) {
  return (
    <g>
      <text x={2} y={y + 11} fontSize={13} fontWeight={700} className="fill-foreground">{top}</text>
      <text x={2} y={y + 26} fontSize={12} className="fill-muted-foreground">{bottom}</text>
    </g>
  );
}

function ValueBar({ y, value, color, label }: { y: number; value: number; color: string; label: string }) {
  return (
    <g>
      <rect x={LEFT} y={y} width={x(value) - LEFT} height={ROW_H} rx={3} fill={color} />
      <text x={x(value) - 6} y={y + 18} textAnchor="end" fontSize={13} fontWeight={700} fill="#ffffff">{label}</text>
    </g>
  );
}

export default function MarginGapViz() {
  return (
    <SceneShell
      eyebrow="가격과 공제율"
      title="인정 금액이 95억 원 선 아래로 내려간 만큼 메워야 합니다"
      description="막대 길이는 금액에 비례합니다. 헤어컷은 담보 시장가치에서 현금액을 줄이는 비율이고, 점선이 현금 채무 95억 원입니다."
      note="모든 금액은 설명을 위한 가정이며 현금 채무를 단순히 95억 원으로 둡니다. 실제 계산에는 누적 이자와 계약의 최소 이체액도 들어갑니다."
      ariaLabel="담보 가치와 헤어컷에 따른 인정 금액과 95억 원 채무의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = scene.base + scene.added;
        const allowed = (total * (100 - scene.haircut)) / 100;
        const gap = DEBT - allowed;
        return (
          <svg viewBox={`0 0 ${W} 156`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <RowLabel y={ROWS[0]} top="담보" bottom="시장가치" />
            <ValueBar y={ROWS[0]} value={scene.base} color="#64748b" label={`${scene.base}억`} />
            {scene.added > 0 && (
              <g>
                <rect x={x(scene.base)} y={ROWS[0]} width={x(total) - x(scene.base)} height={ROW_H} rx={3} fill="#d97706" />
                <text x={x(total) + 4} y={ROWS[0] + 18} fontSize={13} fontWeight={700} fill="#d97706">+{scene.added}억</text>
              </g>
            )}
            <RowLabel y={ROWS[1]} top="인정 금액" bottom={`헤어컷 ${scene.haircut}%`} />
            <ValueBar y={ROWS[1]} value={allowed} color="#2563eb" label={`${allowed}억`} />
            {gap > 0 && (
              <g>
                <rect x={x(allowed)} y={ROWS[1]} width={x(DEBT) - x(allowed)} height={ROW_H} fill="#dc2626" opacity={0.2} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
                <text x={x(DEBT) + 4} y={ROWS[1] + 18} fontSize={13} fontWeight={700} fill="#dc2626">부족 {gap}억</text>
              </g>
            )}
            <RowLabel y={ROWS[2]} top="현금 채무" bottom="단순화 (가정)" />
            <ValueBar y={ROWS[2]} value={DEBT} color="#475569" label={`${DEBT}억`} />
            <line x1={x(DEBT)} x2={x(DEBT)} y1={20} y2={ROWS[2]} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(DEBT)} y={14} textAnchor="middle" fontSize={13} className="fill-muted-foreground">95억 선</text>
          </svg>
        );
      }}
    />
  );
}
