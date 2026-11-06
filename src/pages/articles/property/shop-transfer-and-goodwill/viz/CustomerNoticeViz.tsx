import SceneShell from "./SceneShell";
import SvgArrow from "./SvgArrow";

/**
 * 본문 대응: #source — 한국 개인정보 보호법 제27조 제1항(양도자 사전 통지), 제2항(양수자 통지와
 * 이미 알린 경우의 예외), 제3항(이전 당시 본래 목적으로만 이용·제공).
 */
const W = 340;
const H = 216;
const ACCENT = "#2563eb";
const FAIL = "#dc2626";
const DIM = "#94a3b8";
const TEXT = "#64748b";

const CUSTOMER = { x: 100, y: 6, w: 140, h: 44 };
const PARTY_Y = 162;
const PARTY_H = 46;
const OLD = { x: 8, w: 96 };
const NEW = { x: 236, w: 96 };

const SCENES = [
  { label: "넘기기 전", summary: "기존 점주 → 고객", note: "기존 점주는 법이 정한 방법으로 이전 사실, 받는 사람의 이름·주소·전화번호 등 연락처, 이전을 원하지 않을 때의 조치 방법·절차를 미리 알립니다. 명단은 아직 움직이지 않습니다." },
  { label: "넘긴 뒤, 이미 알렸다면", summary: "새 점주 통지 예외", note: "새 점주가 정보를 받으면 지체 없이 알려야 하지만, 기존 점주가 제1항에 따라 이미 알린 경우는 예외입니다." },
  { label: "넘긴 뒤, 안 알렸다면", summary: "제1항 미이행 · 새 점주가 지체 없이 통지", note: "기존 점주가 제1항에 따라 미리 알려야 할 통지를 하지 않은 경우입니다. 예외에 해당하지 않으므로 새 점주가 지체 없이 알립니다. 같은 명단이라도 앞 단계에 따라 새 점주의 일이 달라집니다." },
  { label: "받은 뒤의 쓰임", summary: "본래 목적으로만", note: "이전 당시의 본래 목적으로만 이용하거나 제공합니다. 가격에 고객 관계를 포함했다고 해서 명단을 다른 사업의 광고에 자유롭게 쓰게 되는 것은 아닙니다." },
] as const;

function Party({ x, y, w, h, text, color }: { x: number; y: number; w: number; h: number; text: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

function Stage({ step }: { step: number }) {
  const oldTold = step === 0;
  const moved = step >= 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      <Party x={CUSTOMER.x} y={CUSTOMER.y} w={CUSTOMER.w} h={CUSTOMER.h} text="고객(정보주체)" color={TEXT} />
      <Party x={OLD.x} y={PARTY_Y} w={OLD.w} h={PARTY_H} text="기존 점주" color={TEXT} />
      <Party x={NEW.x} y={PARTY_Y} w={NEW.w} h={PARTY_H} text="새 점주" color={TEXT} />

      {/* 명단 이동 */}
      <SvgArrow x1={OLD.x + OLD.w} y1={PARTY_Y + PARTY_H / 2} x2={NEW.x} y2={PARTY_Y + PARTY_H / 2} color={moved ? ACCENT : DIM} dashed={!moved} />
      <text x={170} y={PARTY_Y + PARTY_H / 2 - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={moved ? ACCENT : TEXT}>고객 명단</text>

      {/* 기존 점주의 통지 */}
      {step === 0 && <SvgArrow x1={56} y1={PARTY_Y} x2={CUSTOMER.x + 24} y2={CUSTOMER.y + CUSTOMER.h} color={ACCENT} />}
      {step === 1 && <SvgArrow x1={56} y1={PARTY_Y} x2={CUSTOMER.x + 24} y2={CUSTOMER.y + CUSTOMER.h} color={TEXT} />}
      {oldTold && <text x={18} y={104} fontSize={13} fontWeight={700} fill={ACCENT}>미리 알림</text>}
      {step === 1 && <text x={10} y={104} fontSize={13} fill={TEXT}>이미 알림</text>}
      {step === 2 && (
        <g>
          <SvgArrow x1={56} y1={PARTY_Y} x2={CUSTOMER.x + 24} y2={CUSTOMER.y + CUSTOMER.h} color={DIM} dashed />
          <text x={8} y={100} fontSize={13} fontWeight={700} fill={FAIL}>✕ 제1항 의무</text>
          <text x={8} y={118} fontSize={13} fontWeight={700} fill={FAIL}>미이행</text>
        </g>
      )}

      {/* 새 점주의 통지 */}
      {step === 1 && (
        <g>
          <SvgArrow x1={284} y1={PARTY_Y} x2={CUSTOMER.x + CUSTOMER.w - 24} y2={CUSTOMER.y + CUSTOMER.h} color={DIM} dashed />
          <text x={W - 8} y={124} textAnchor="end" fontSize={13} fill={TEXT}>예외</text>
        </g>
      )}
      {step === 2 && (
        <g>
          <SvgArrow x1={284} y1={PARTY_Y} x2={CUSTOMER.x + CUSTOMER.w - 24} y2={CUSTOMER.y + CUSTOMER.h} color={ACCENT} />
          <text x={W - 8} y={124} textAnchor="end" fontSize={13} fontWeight={700} fill={ACCENT}>알림</text>
        </g>
      )}

      {/* 받은 뒤의 쓰임 */}
      {step === 3 && (
        <g>
          <rect x={150} y={64} width={182} height={32} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.25} />
          <text x={241} y={85} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>✓ 이전 당시 본래 목적</text>
          <rect x={150} y={106} width={158} height={32} rx={8} fill="none" stroke={FAIL} strokeWidth={1.25} strokeDasharray="3 3" />
          <text x={229} y={127} textAnchor="middle" fontSize={13} fontWeight={700} fill={FAIL}>✕ 다른 사업의 광고</text>
          <line x1={270} x2={270} y1={PARTY_Y} y2={138} stroke={FAIL} strokeWidth={1} strokeDasharray="3 3" />
          <SvgArrow x1={320} y1={PARTY_Y} x2={320} y2={96} color={ACCENT} />
        </g>
      )}
    </svg>
  );
}

export default function CustomerNoticeViz() {
  return (
    <SceneShell
      eyebrow="고객정보 이전"
      title="기존 점주가 미리 알렸는지에 따라 새 점주의 통지 의무가 갈립니다"
      description="아래 화살표가 명단, 위로 가는 화살표가 고객에게 알리는 통지입니다. 한국 개인정보 보호법 제27조(2026-09-11 시행, 2026-10-04 확인)를 그렸습니다."
      ariaLabel="기존 점주의 사전 통지, 새 점주의 통지와 예외, 본래 목적 제한을 보여 주는 세 당사자 그림"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
