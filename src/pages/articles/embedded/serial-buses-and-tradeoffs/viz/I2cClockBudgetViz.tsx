import SceneShell from "./SceneShell";

/**
 * 본문 대응: #i2c — 400 kHz 한 주기 2.5 µs에 Fast-mode 최소 LOW 1.3 µs·HIGH 0.6 µs를 넣으면 0.6 µs가 남는다.
 * 가로축은 µs 눈금입니다. 넘치는 양은 글이 정하지 않으므로 길이 없이 화살표로만 그립니다.
 */
const PERIOD = 2.5;
const LOW = 1.3;
const HIGH = 0.6;
const USED = LOW + HIGH;
const SPARE = PERIOD - USED;

const SCENES = [
  { label: "한 주기의 크기", summary: "1 ÷ 400 kHz = 2.5 µs", stage: 0, note: "400 kHz라면 SCL이 한 번 오르내리는 한 주기가 2.5 µs입니다. 규격의 최소 시간이 모두 이 안에 들어가야 합니다." },
  { label: "LOW 최소값", summary: "1.3 µs", stage: 1, note: "UM10204 표 11의 Fast-mode에서 SCL이 낮게 머물러야 하는 최소 시간입니다." },
  { label: "HIGH 최소값", summary: "1.3 + 0.6 = 1.9 µs", stage: 2, note: "SCL이 높게 머물러야 하는 최소 0.6 µs를 더하면 2.5 µs 가운데 1.9 µs를 씁니다." },
  { label: "남는 몫", summary: "2.5 − 1.9 = 0.6 µs", stage: 3, note: "최소값만 넣었을 때 남는 시간입니다. 선이 오르내리는 상승·하강 시간과 부하는 이 여유 안에서 감당해야 합니다." },
  { label: "여유를 넘기면", summary: "400 kHz 주기 유지 안 됨", stage: 4, note: "상승·하강 시간과 부하가 0.6 µs를 넘기면 설정값이 400 kHz여도 그 주기가 유지되지 않습니다. 넘치는 양은 글에서 정하지 않았으므로 화살표 길이는 크기가 아닙니다." },
] as const;

const W = 360;
const H = 118;
const X0 = 14;
const SCALE = 112;
const px = (us: number) => X0 + us * SCALE;
const BAR_Y = 34;
const BAR_H = 34;
const END = px(PERIOD);

function Tick({ us, label }: { us: number; label: string }) {
  return (
    <g>
      <line x1={px(us)} x2={px(us)} y1={BAR_Y + BAR_H} y2={BAR_Y + BAR_H + 6} stroke="#94a3b8" strokeWidth={1} />
      <text x={px(us)} y={BAR_Y + BAR_H + 20} textAnchor="middle" fontSize={12} fill="#64748b">{label}</text>
    </g>
  );
}

export default function I2cClockBudgetViz() {
  return (
    <SceneShell
      eyebrow="400 kHz 한 주기의 예산"
      title="2.5 µs 한 주기 안에 무엇이 들어가야 하는가"
      description="SCL은 박자를 정하는 선입니다. LOW는 그 선이 낮게, HIGH는 높게 머무는 시간입니다. 막대는 시간을 더한 순서이며 실제 파형의 순서가 아닙니다."
      ariaLabel="클록 한 주기 2.5 마이크로초를 LOW 1.3, HIGH 0.6, 여유 0.6으로 나눈 막대"
      scenes={SCENES}
      render={(active) => {
        const { stage, label, summary } = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${label}: ${summary}`}>
            <text x={X0} y={BAR_Y - 10} fontSize={12} fill="#64748b">400 kHz의 한 주기</text>
            <rect x={px(0)} y={BAR_Y} width={END - X0} height={BAR_H} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {stage >= 1 && (
              <g>
                <rect x={px(0)} y={BAR_Y} width={LOW * SCALE} height={BAR_H} rx={2} fill="#2563eb" />
                <text x={px(LOW / 2)} y={BAR_Y + 21} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">LOW 1.3</text>
              </g>
            )}
            {stage >= 2 && (
              <g>
                <rect x={px(LOW)} y={BAR_Y} width={HIGH * SCALE} height={BAR_H} fill="#475569" />
                <text x={px(LOW + HIGH / 2)} y={BAR_Y + 21} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">HIGH 0.6</text>
              </g>
            )}
            {stage >= 3 && (
              <g>
                <rect x={px(USED)} y={BAR_Y} width={SPARE * SCALE} height={BAR_H} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                <text x={px(USED + SPARE / 2)} y={BAR_Y + 21} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">여유 0.6</text>
              </g>
            )}
            {stage >= 4 && (
              <g>
                <line x1={END} x2={W - 12} y1={BAR_Y + BAR_H / 2} y2={BAR_Y + BAR_H / 2} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <path d={`M${W - 12} ${BAR_Y + BAR_H / 2 - 4} L${W - 5} ${BAR_Y + BAR_H / 2} L${W - 12} ${BAR_Y + BAR_H / 2 + 4} Z`} fill="#dc2626" />
                <text x={W - 6} y={BAR_Y - 10} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">넘침</text>
              </g>
            )}
            <Tick us={0} label="0" />
            {stage >= 1 && <Tick us={LOW} label="1.3" />}
            {stage >= 2 && <Tick us={USED} label="1.9" />}
            <Tick us={PERIOD} label="2.5 µs" />
          </svg>
        );
      }}
    />
  );
}
