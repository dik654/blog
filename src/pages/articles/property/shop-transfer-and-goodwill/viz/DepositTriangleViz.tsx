import SceneShell from "./SceneShell";
import SvgArrow from "./SvgArrow";

/**
 * 본문 대응: #limits 마지막 문단 — 양도가 성립해도 세 사람의 계약서에서 대조할 세 질문.
 * 본문은 답이 아니라 질문을 제시하므로 화살표마다 물음표로 남기며, 금액은 본문에 없어 적지 않습니다.
 */
const W = 340;
const H = 208;
const ACCENT = "#2563eb";
const WARN = "#b45309";
const DIM = "#94a3b8";
const TEXT = "#64748b";

const LANDLORD = { x: 110, y: 6, w: 120, h: 44 };
const OLD = { x: 8, y: 156, w: 100, h: 44 };
const NEW = { x: 232, y: 156, w: 100, h: 44 };

const SCENES = [
  { label: "기존 점주의 책임", summary: "임대차 책임이 끝나나?", note: "양도가 성립해도 기존 점주의 임대차 책임이 끝나는지는 따로 대조합니다. 대금을 받았다는 사실이 답이 아닙니다." },
  { label: "기존 보증금", summary: "누가 돌려받나?", note: "임대인이 가진 보증금을 누가 돌려받는지가 둘째 질문입니다. 3절의 3천300만 원에는 보증금이 들어 있지 않아 이 돈은 그 계산 밖에서 움직입니다." },
  { label: "신규 보증금", summary: "언제 지급하나?", note: "양수인의 신규 보증금이 언제 지급되는지가 셋째 질문입니다. 지급 시점도 계약서에서 확인합니다." },
  { label: "세 계약서 대조", summary: "화살표 3개를 한 번에", note: "세 질문을 세 사람의 계약서에서 대조합니다. 명의만 바꾸고 채무 정산을 놓치지 않기 위해서입니다." },
] as const;

function Party({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={TEXT} strokeWidth={1} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>{text}</text>
    </g>
  );
}

function Stage({ step }: { step: number }) {
  const on = (scene: number) => step === scene || step === 3;
  const tint = (scene: number, color: string) => (on(scene) ? color : DIM);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      <Party {...LANDLORD} text="임대인" />
      <Party {...OLD} text="기존 점주" />
      <Party {...NEW} text="새 점주" />

      {/* 임대차 책임: 기존 점주 ↔ 임대인 */}
      <line x1={36} y1={OLD.y} x2={LANDLORD.x + 6} y2={LANDLORD.y + LANDLORD.h} stroke={tint(0, WARN)} strokeWidth={on(0) ? 1.25 : 1} strokeDasharray="3 3" />
      {on(0) && <text x={8} y={100} fontSize={13} fontWeight={700} fill={WARN}>책임 끝?</text>}

      {/* 기존 보증금: 임대인 → 누구 */}
      <SvgArrow x1={LANDLORD.x + 40} y1={LANDLORD.y + LANDLORD.h} x2={76} y2={OLD.y} color={tint(1, ACCENT)} dashed />
      <SvgArrow x1={LANDLORD.x + 60} y1={LANDLORD.y + LANDLORD.h} x2={NEW.x + 14} y2={NEW.y} color={tint(1, ACCENT)} dashed />
      {on(1) && <text x={160} y={136} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>기존 보증금 누구에게?</text>}

      {/* 신규 보증금: 새 점주 → 임대인 */}
      <SvgArrow x1={NEW.x + 70} y1={NEW.y} x2={LANDLORD.x + LANDLORD.w - 4} y2={LANDLORD.y + LANDLORD.h} color={tint(2, WARN)} dashed={!on(2)} />
      {on(2) && (
        <g>
          <text x={W - 6} y={74} textAnchor="end" fontSize={13} fontWeight={700} fill={WARN}>신규 보증금</text>
          <text x={W - 6} y={92} textAnchor="end" fontSize={13} fontWeight={700} fill={WARN}>언제?</text>
        </g>
      )}
    </svg>
  );
}

export default function DepositTriangleViz() {
  return (
    <SceneShell
      eyebrow="보증금과 책임"
      title="대금이 끝나도 임대인을 낀 세 질문이 남습니다"
      description="칸은 세 사람, 점선은 아직 확인하지 않은 책임과 돈입니다. 본문이 답이 아니라 질문을 제시하므로 답을 그리지 않았고, 금액도 본문에 없어 적지 않았습니다."
      ariaLabel="임대인, 기존 점주, 새 점주 사이의 임대차 책임, 기존 보증금, 신규 보증금에 관한 세 질문"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
