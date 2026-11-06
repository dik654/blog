import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — (가정) A의 기록 감소 2를 B와 같은 1, 계기 교체 0.5, 남은 0.5로 나눈다.
 * 막대 전체 = A의 기록 10→8. 가로 길이가 kWh에 비례한다. 교정 뒤 값 8.5 = 8 + 0.5.
 */
const SCENES = [
  { label: "기록된 감소", summary: "10 → 8, 감소 2", note: "A의 기록만 보면 2kWh가 줄었습니다. 아직 아무것도 나누지 않은 값입니다." },
  { label: "B만큼 덜어내기", summary: "2 − 1 = 추가감소 1", note: "장치가 없던 B에서도 1이 줄었으므로 A도 그만큼은 장치와 무관하게 줄었다고 가정합니다. 남은 1이 본문의 추가감소입니다." },
  { label: "계기 교체 덜어내기", summary: "1 − 0.5 = 0.5", note: "(가정) A에서만 계기를 바꿔 이후 값이 0.5 낮게 기록됐다면 추가감소 중 0.5는 측정 변화일 수 있습니다. 그 몫을 되돌리면 8이 아니라 8.5입니다. 교정정보로 확인할 일입니다." },
  { label: "남은 0.5", summary: "아직 장치 효과가 아님", note: "나머지 0.5는 ‘남은 값’일 뿐입니다. 동시 변화가 없다는 조건을 따로 검토해야 장치와 연결할 수 있습니다." },
] as const;

const W = 340;
const H = 176;
const BAR_Y = 40;
const BAR_H = 44;
const x = (value: number) => 12 + ((10 - value) / 2) * 316;

const TREND = "#94a3b8";
const EXTRA = "#2563eb";
const METER = "#d97706";
const INK = "#64748b";

function Segment({ from, to, fill, opacity = 0.75, dashed = false }: { from: number; to: number; fill: string; opacity?: number; dashed?: boolean }) {
  return dashed ? (
    <rect x={x(from)} y={BAR_Y} width={x(to) - x(from)} height={BAR_H} fill="none" stroke={fill} strokeWidth={1.25} strokeDasharray="4 3" />
  ) : (
    <rect x={x(from)} y={BAR_Y} width={x(to) - x(from)} height={BAR_H} fill={fill} opacity={opacity} />
  );
}

function Tag({ from, to, lines, color }: { from: number; to: number; lines: readonly string[]; color: string }) {
  const mid = (x(from) + x(to)) / 2;
  return (
    <g>
      <line x1={x(from) + 2} x2={x(to) - 2} y1={BAR_Y + BAR_H + 8} y2={BAR_Y + BAR_H + 8} stroke={color} strokeWidth={1.25} />
      {lines.map((line, index) => (
        <text key={line} x={mid} y={BAR_Y + BAR_H + 26 + index * 18} textAnchor="middle" fontSize={15} fontWeight={700} fill={color}>{line}</text>
      ))}
    </g>
  );
}

export default function MeterSplitViz() {
  return (
    <SceneShell
      eyebrow="감소 2 나누기"
      title="A의 감소 2에서 장치가 차지할 수 있는 자리는 얼마나 남는가"
      description="막대 전체가 A의 기록 10→8이고 왼쪽에서 오른쪽으로 사용량이 줄어듭니다. 길이는 kWh에 비례합니다. 모든 값은 설명용 (가정)입니다."
      ariaLabel="A의 기록 감소 2를 B와 같은 감소, 계기 교체 몫, 남은 몫으로 나누는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[
            { value: 10, label: "10", show: true },
            { value: 9, label: "9", show: active >= 1 },
            { value: 8.5, label: "8.5", show: active >= 2 },
            { value: 8, label: "8", show: true },
          ].map(({ value, label, show }) => show && (
            <g key={value}>
              <line x1={x(value)} x2={x(value)} y1={BAR_Y - 6} y2={BAR_Y + BAR_H} stroke={INK} strokeWidth={1} />
              <text x={x(value)} y={BAR_Y - 12} textAnchor={value === 10 ? "start" : value === 8 ? "end" : "middle"} fontSize={15} fontWeight={600} fill={INK}>{label}</text>
            </g>
          ))}
          {active === 0 && <Segment from={10} to={8} fill={EXTRA} opacity={0.45} />}
          {active >= 1 && <Segment from={10} to={9} fill={TREND} />}
          {active === 1 && <Segment from={9} to={8} fill={EXTRA} />}
          {active === 2 && <Segment from={9} to={8.5} fill={EXTRA} />}
          {active === 3 && <Segment from={9} to={8.5} fill={EXTRA} dashed />}
          {active >= 2 && <Segment from={8.5} to={8} fill={METER} />}

          {active === 0 && <Tag from={10} to={8} lines={["기록된 감소 2"]} color={EXTRA} />}
          {active >= 1 && <Tag from={10} to={9} lines={["B와 같은 1", "(가정)"]} color={INK} />}
          {active === 1 && <Tag from={9} to={8} lines={["추가감소 1"]} color={EXTRA} />}
          {active >= 2 && <Tag from={9} to={8.5} lines={active === 2 ? ["남은 0.5"] : ["남은 0.5", "미확인"]} color={EXTRA} />}
          {active >= 2 && <Tag from={8.5} to={8} lines={["계기 0.5"]} color={METER} />}
        </svg>
      )}
    />
  );
}
