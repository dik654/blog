import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — FAO는 농장·운송·저장·도매·가공의 손실(SDG 12.3.1a)과
 * 소매·외식·가정의 폐기(12.3.1b)를 별도 지표로 잽니다. 사례의 2개는 버린 위치에 따라 나뉩니다.
 * 한 줄에 놓은 칸의 폭과 간격에는 수치 뜻이 없습니다.
 */
const LOSS = ["농장", "운송", "저장", "도매", "가공"] as const;
const WASTE = ["소매", "외식", "가정"] as const;
const BOX_W = 37;
const BOX_STEP = 41;
const LOSS_X = 12;
const WASTE_X = 225;
const BOX_Y = 44;
const BOX_H = 32;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";

const SCENES = [
  { label: "손실(loss) 구간", summary: "SDG 12.3.1a", note: "수확 뒤 농장·운송·저장·도매·가공 단계에서 사라지는 식품을 FAO는 식품 손실로 잽니다." },
  { label: "폐기(waste) 구간", summary: "SDG 12.3.1b", note: "소매·외식·가정 단계의 식품 폐기는 별도 지표로 잽니다." },
  { label: "사례의 2개는 어느 쪽일까요", summary: "버린 위치가 결정합니다", note: "가게에 들어오기 전의 선별·운송 중에 버렸다면 손실 쪽, 진열 뒤 팔리지 않아 버렸다면 폐기 쪽에 들어갑니다." },
] as const;

function Stretch({ on, x, items, color, title, tag }: { on: boolean; x: number; items: readonly string[]; color: string; title: string; tag: string }) {
  const right = x + (items.length - 1) * BOX_STEP + BOX_W;
  return (
    <g opacity={on ? 1 : 0.3}>
      <text x={x} y={14} fontSize={13} fontWeight={700} fill={color}>{title}</text>
      <text x={x} y={30} fontSize={13} fill="#64748b">{tag}</text>
      <path d={`M${x + 0.5} ${BOX_Y - 3}v-4H${right - 0.5}v4`} fill="none" stroke={color} strokeWidth={1} />
      {items.map((item, index) => (
        <g key={item}>
          <rect x={x + index * BOX_STEP + 0.5} y={BOX_Y + 0.5} width={BOX_W - 1} height={BOX_H - 1} rx={4} fill="none" stroke={color} strokeWidth={1} />
          <text x={x + index * BOX_STEP + BOX_W / 2} y={BOX_Y + 21} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{item}</text>
        </g>
      ))}
    </g>
  );
}

/** 버린 2개를 칸 아래에 놓고 어느 칸에서 생긴 일인지 선으로 잇습니다. */
function CaseMark({ boxX, textX, lines }: { boxX: number; textX: number; lines: readonly string[] }) {
  const center = boxX + BOX_W / 2;
  return (
    <g>
      <line x1={center} x2={center} y1={BOX_Y + BOX_H + 2} y2={BOX_Y + BOX_H + 14} stroke={RED} strokeWidth={1} />
      <rect x={center - 13} y={BOX_Y + BOX_H + 14} width={12} height={12} rx={1} fill={RED} />
      <rect x={center + 1} y={BOX_Y + BOX_H + 14} width={12} height={12} rx={1} fill={RED} />
      {lines.map((line, index) => (
        <text key={line} x={textX} y={BOX_Y + BOX_H + 44 + index * 17} fontSize={13} fontWeight={700} fill={RED}>{line}</text>
      ))}
    </g>
  );
}

export default function LossWasteLineViz() {
  return (
    <SceneShell
      eyebrow="국제 통계의 경계"
      title="같은 2개도 어디서 버렸는지에 따라 다른 지표로 갑니다"
      description="FAO의 구분을 한 줄에 놓았고 칸의 폭에는 수치 뜻이 없습니다. SDG는 유엔의 지속가능발전목표이고, 12.3.1a와 12.3.1b는 그 안의 지표 번호입니다."
      ariaLabel="식품 손실 구간과 식품 폐기 구간의 경계와 사례 2개의 위치"
      scenes={SCENES}
      render={(scene) => (
        <svg viewBox="0 0 360 142" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
          <Stretch on={scene !== 1} x={LOSS_X} items={LOSS} color={BLUE} title="식품 손실(loss)" tag="SDG 12.3.1a" />
          <Stretch on={scene !== 0} x={WASTE_X} items={WASTE} color={AMBER} title="식품 폐기(waste)" tag="SDG 12.3.1b" />
          <line x1={219} x2={219} y1={2} y2={BOX_Y + BOX_H + 6} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
          {scene === 2 && (
            <>
              <CaseMark boxX={LOSS_X + BOX_STEP} textX={LOSS_X} lines={["가게에 들어오기 전", "선별·운송 중에 버린 2개"]} />
              <CaseMark boxX={WASTE_X} textX={WASTE_X} lines={["진열 뒤 안 팔려", "버린 2개"]} />
            </>
          )}
        </svg>
      )}
    />
  );
}
