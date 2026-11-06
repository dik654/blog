import SceneShell from "./SceneShell";
import SvgArrow from "./SvgArrow";

/**
 * 본문 대응: #source 마지막 문단 — 단순 예산(한 기준일), 부록 B3(완공 시점 잔여 → 평가일 환산 → 취득 부대비용),
 * 할인 현금흐름(시점별 현금의 현재가치). 환산 숫자는 본문에 없어 적지 않습니다.
 */
const W = 340;
const H = 190;
const AXIS_Y = 152;
const X_VALUE = 40;
const X_DONE = 300;

const ACCENT = "#2563eb";
const DIM = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "이 글의 단순 예산", summary: "15 − 2 = 13억", note: "같은 기준일의 가격·비용 수준을 쓰고 지급 시점의 할인을 생략했습니다. 그래서 모든 뺄셈이 시간축의 한 점에서 끝납니다. 계산 순서를 보여 주는 예산이며 시점 조정까지 끝난 값이 아닙니다." },
  { label: "부록 B3의 기본 잔여모형", summary: "완공 시점 → 평가일", note: "남은 돈은 완공 시점의 값으로 나옵니다. 이것을 평가일로 환산한 뒤 취득 부대비용을 뺍니다. 뺄셈 앞에 시간을 거슬러 옮기는 단계가 하나 더 있습니다." },
  { label: "할인 현금흐름 방식", summary: "시점별 현금에서 출발", note: "잔여 하나를 옮기는 대신 시점마다의 현금을 각각 현재가치로 옮기는 데서 출발합니다. 시점의 개수는 설명용이며 금액은 본문에 없어 적지 않았습니다." },
] as const;

const BOX_H = 42;

function Box({ x, y, w, text, color = ACCENT }: { x: number; y: number; w: number; text: string; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={BOX_H} rx={8} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={x + w / 2} y={y + 26} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{text}</text>
    </g>
  );
}

function Stage({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      <line x1={14} x2={W - 14} y1={AXIS_Y} y2={AXIS_Y} stroke={DIM} strokeWidth={1} />
      {step === 0 ? (
        <g>
          <line x1={170} x2={170} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke={TEXT} strokeWidth={1} />
          <text x={170} y={AXIS_Y + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>같은 기준일</text>
          <Box x={8} y={40} w={92} text="잔여 15억" />
          <text x={110} y={66} textAnchor="middle" fontSize={15} fontWeight={700} fill={TEXT}>−</text>
          <Box x={120} y={40} w={88} text="취득 2억" color={TEXT} />
          <text x={218} y={66} textAnchor="middle" fontSize={15} fontWeight={700} fill={TEXT}>=</text>
          <Box x={228} y={40} w={104} text="매도자 13억" />
          <line x1={170} x2={170} y1={82} y2={AXIS_Y - 6} stroke={DIM} strokeWidth={1} strokeDasharray="2 3" />
        </g>
      ) : (
        <g>
          <line x1={X_VALUE} x2={X_VALUE} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke={TEXT} strokeWidth={1} />
          <text x={X_VALUE - 26} y={AXIS_Y + 24} fontSize={13} fontWeight={700} fill={TEXT}>평가일</text>
          <line x1={X_DONE} x2={X_DONE} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke={TEXT} strokeWidth={1} />
          <text x={W - 8} y={AXIS_Y + 24} textAnchor="end" fontSize={13} fontWeight={700} fill={TEXT}>완공 시점</text>
        </g>
      )}
      {step === 1 && (
        <g>
          <Box x={212} y={12} w={120} text="완공 시점 잔여" />
          <SvgArrow x1={212} y1={33} x2={134} y2={33} color={ACCENT} />
          <text x={173} y={24} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>환산</text>
          <Box x={8} y={12} w={126} text="평가일의 값" />
          <SvgArrow x1={71} y1={54} x2={71} y2={80} color={TEXT} />
          <Box x={8} y={80} w={126} text="− 취득 부대비용" color={TEXT} />
          <line x1={272} x2={X_DONE} y1={54} y2={AXIS_Y - 6} stroke={DIM} strokeWidth={1} strokeDasharray="2 3" />
          <line x1={X_VALUE} x2={X_VALUE} y1={122} y2={AXIS_Y - 6} stroke={DIM} strokeWidth={1} strokeDasharray="2 3" />
        </g>
      )}
      {step === 2 && (
        <g>
          {[110, 170, 230, X_DONE].map((x, index) => (
            <g key={x}>
              <circle cx={x} cy={AXIS_Y} r={3} fill={ACCENT} />
              <path d={`M ${x} ${AXIS_Y - 5} Q ${(x + X_VALUE) / 2} ${AXIS_Y - 40 - index * 22} ${X_VALUE + 2} ${AXIS_Y - 8}`} fill="none" stroke={ACCENT} strokeWidth={1} />
            </g>
          ))}
          <path d={`M ${X_VALUE} ${AXIS_Y - 2} L ${X_VALUE - 3} ${AXIS_Y - 11} L ${X_VALUE + 6} ${AXIS_Y - 9} Z`} fill={ACCENT} />
          <text x={W - 8} y={40} textAnchor="end" fontSize={13} fontWeight={700} fill={ACCENT}>시점별 현금의 현재가치</text>
        </g>
      )}
    </svg>
  );
}

export default function ValuationDateViz() {
  return (
    <SceneShell
      eyebrow="언제의 돈인가"
      title="뺄셈 하나로 끝나는 예산과 시간을 옮기는 평가는 순서가 다릅니다"
      description="가로는 시간입니다. 앞 장면은 이 글의 가정, 뒤 두 장면은 RICS 지침이 설명하는 방식이며 가로 길이는 실제 기간과 비례하지 않습니다."
      ariaLabel="한 기준일의 단순 예산, 평가일로 환산하는 기본 잔여모형, 시점별 현재가치에서 출발하는 할인 현금흐름의 차이"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
