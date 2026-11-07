import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-sample — START_ONCE 뒤 READY가 낮아졌다가 ADC 클록 96주기 뒤 높아진다.
 * 48 MHz에서 96 / 48,000,000 s = 2 µs. 앞뒤 소프트웨어 구간의 길이는 본문이 정하지 않았다.
 * 칸 하나 = 12주기, 8칸 = 96주기. 가로축은 2 µs 구간 안에서만 의미가 있고 바깥 구간은 축척이 아니다.
 */
const W = 360;
const H = 178;
const WAVE_START = 62;
const FALL = 130;
const RISE = 274;
const WAVE_END = 350;
const HIGH_Y = 52;
const LOW_Y = 82;
const CELL = (RISE - FALL) / 8;
const ACCENT = "#2563eb";
const DONE = "#16a34a";
const MUTED = "#64748b";

const SCENES = [
  { label: "변환 전", summary: "READY = 1", until: WAVE_START + 60, cells: 0, note: "ADC 입력 0을 고른 상태입니다. READY(변환 완료 표시 비트)는 1입니다." },
  { label: "시작 비트를 세움", summary: "CS.START_ONCE → READY = 0", until: FALL + 8, cells: 0, note: "adc_read가 CS.START_ONCE(한 번 변환 시작 비트)를 세웁니다. READY가 낮아지고 함수는 다시 1이 될 때까지 기다립니다." },
  { label: "클록을 세는 동안", summary: "96 ÷ 48,000,000 s = 2 µs", until: RISE, cells: 8, note: "칸 하나가 12주기, 8칸이 96주기입니다. ADC 클록을 48 MHz로 맞춘 조건에서 이 구간이 2 µs입니다." },
  { label: "READY가 다시 1", summary: "RESULT를 반환", until: WAVE_END, cells: 8, note: "READY가 높아지면 함수가 RESULT(결과 레지스터)의 값을 읽어 돌려줍니다." },
  { label: "2 µs에 들어가지 않는 것", summary: "앞뒤 시간은 별도", until: WAVE_END, cells: 8, note: "알람 대기와 함수 호출, 결과 저장은 이 나눗셈 밖입니다. 소프트웨어 시각이 실제 입력을 잡은 순간과 같다고 자동으로 가정할 수도 없습니다." },
] as const;

export default function AdcReadyTimingViz() {
  return (
    <SceneShell
      eyebrow="adc_read 한 번"
      title="READY가 내려갔다 올라오는 사이가 변환 2 µs입니다"
      description="가운데 선이 READY 비트의 높낮이입니다. 시간은 왼쪽에서 오른쪽으로 흐릅니다."
      note="96주기와 2 µs는 48 MHz ADC 클록에서의 값입니다. 보드에서 잰 결과가 아닙니다."
      ariaLabel="START_ONCE 이후 READY가 96주기 동안 낮아졌다가 높아지는 타이밍 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const points: string[] = [`M${WAVE_START} ${HIGH_Y}`];
        if (scene.until <= FALL) points.push(`L${scene.until} ${HIGH_Y}`);
        else {
          points.push(`L${FALL} ${HIGH_Y}`, `L${FALL} ${LOW_Y}`);
          if (scene.until <= RISE) points.push(`L${scene.until} ${LOW_Y}`);
          else points.push(`L${RISE} ${LOW_Y}`, `L${RISE} ${HIGH_Y}`, `L${WAVE_END} ${HIGH_Y}`);
        }
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={HIGH_Y + 19} fontSize={11} fontWeight={700} fill={MUTED}>READY</text>
            <text x={WAVE_START - 6} y={HIGH_Y + 3.5} textAnchor="end" fontSize={10} fill={MUTED}>1</text>
            <text x={WAVE_START - 6} y={LOW_Y + 3.5} textAnchor="end" fontSize={10} fill={MUTED}>0</text>
            <path d={points.join(" ")} fill="none" stroke={ACCENT} strokeWidth={1.25} />
            {active >= 1 && (
              <>
                <line x1={FALL} x2={FALL} y1={24} y2={HIGH_Y - 4} stroke={ACCENT} strokeWidth={1} />
                <path d={`M${FALL - 3} ${HIGH_Y - 8} L${FALL} ${HIGH_Y - 4} L${FALL + 3} ${HIGH_Y - 8}`} fill="none" stroke={ACCENT} strokeWidth={1} />
                <text x={FALL} y={18} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={ACCENT}>START_ONCE 세움</text>
              </>
            )}
            {active >= 3 && (
              <>
                <line x1={RISE} x2={RISE} y1={24} y2={HIGH_Y - 4} stroke={DONE} strokeWidth={1} />
                <path d={`M${RISE - 3} 28 L${RISE} 24 L${RISE + 3} 28`} fill="none" stroke={DONE} strokeWidth={1} />
                <text x={RISE} y={18} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={DONE}>RESULT 읽음</text>
              </>
            )}
            {Array.from({ length: scene.cells }, (_, i) => (
              <rect key={i} x={FALL + i * CELL + 0.5} y={92} width={CELL - 1} height={10} fill={ACCENT} opacity={i % 2 === 0 ? 0.45 : 0.25} />
            ))}
            {scene.cells > 0 && (
              <text x={(FALL + RISE) / 2} y={116} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={ACCENT}>12주기 × 8 = 96주기 = 2 µs</text>
            )}
            {active === 4 && (
              <>
                <rect x={8} y={130} width={116} height={32} rx={5} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={66} y={144} textAnchor="middle" fontSize={10} fill={MUTED}>알람 대기·함수 호출</text>
                <text x={66} y={156} textAnchor="middle" fontSize={9.5} fill={MUTED}>길이 미정</text>
                <rect x={FALL} y={130} width={RISE - FALL} height={32} rx={5} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={1} />
                <text x={(FALL + RISE) / 2} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>2 µs는 여기만</text>
                <rect x={RISE + 6} y={130} width={W - RISE - 16} height={32} rx={5} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={(RISE + 6 + W - 10) / 2} y={144} textAnchor="middle" fontSize={10} fill={MUTED}>결과 저장</text>
                <text x={(RISE + 6 + W - 10) / 2} y={156} textAnchor="middle" fontSize={9.5} fill={MUTED}>길이 미정</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
