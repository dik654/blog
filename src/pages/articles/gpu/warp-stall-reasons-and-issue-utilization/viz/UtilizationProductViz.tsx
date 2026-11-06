import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sm-utilization — 50% × 80% = 40%, 98% × 40% = 39.2%.
 * 셋째 층 SM throughput 은 글의 곱셈 예에 값이 없으므로 크기를 주지 않는다.
 */
const CASES = [
  { active: 50, issue: 80 },
  { active: 98, issue: 40 },
  { active: 50, issue: 80 },
] as const;

const SCENES = [
  { label: "SM 이 절반만 active", summary: "50% × 80% = 40%", note: "Active 안에서 issue active 는 80%로 높지만 elapsed 기준으로는 40%입니다. 기준이 다른 숫자를 곱해야 전체가 보이므로 metric 이 active 기준과 elapsed 기준을 따로 둡니다." },
  { label: "SM 은 찼지만 scheduler 가 쉼", summary: "98% × 40% = 39.2%", note: "Elapsed 기준 값은 앞 장면과 거의 같지만 비는 자리가 다릅니다. 이쪽은 SM 이 찬 채 scheduler 가 쉬었으니, 이때 비로소 stall reason 을 읽을 차례입니다." },
  { label: "셋째 층", summary: "SM throughput · 예시 값 없음", note: "SM throughput 은 issue 된 instruction 이 실행 pipe 의 peak 를 얼마나 채웠는지입니다. 곱셈 예에는 이 값이 없어 길이를 주지 않고 빈 점선 틀로만 표시했습니다." },
] as const;

const LEFT = 0;
const WIDTH = 356;
const px = (percent: number) => (percent / 100) * WIDTH;

function Row({ y, label, value, percent, color, dashed = false }: { y: number; label: string; value: string; percent: number; color: string; dashed?: boolean }) {
  return (
    <g>
      <text x={LEFT} y={y - 5} fontSize={12} fill="currentColor">{label}</text>
      <text x={LEFT + WIDTH} y={y - 5} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">{value}</text>
      <rect x={LEFT} y={y} width={WIDTH} height={16} fill="none" stroke={dashed ? color : "#94a3b8"} strokeOpacity={dashed ? 1 : 0.4} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      {!dashed && <rect x={LEFT} y={y} width={px(percent)} height={16} fill={color} fillOpacity={0.45} stroke={color} strokeWidth={1} className="transition-[width] duration-300 motion-reduce:transition-none" />}
    </g>
  );
}

export default function UtilizationProductViz() {
  return (
    <SceneShell
      eyebrow="이용률의 층"
      title="SM active 와 issue active 를 곱하면 elapsed 기준 비율이 나옵니다"
      description="막대 전체 길이가 kernel 의 elapsed 입니다. Active 와 issue 된 clock 은 실제로는 흩어져 있어도 길이만 왼쪽으로 모아 그렸습니다."
      ariaLabel="SM active 비율과 issue active 비율의 곱으로 얻는 elapsed 기준 issue 비율"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        const product = (item.active * item.issue) / 100;
        return (
          <svg viewBox="0 0 360 188" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Row y={22} label="elapsed" value="100%" percent={100} color="#94a3b8" />
            <Row y={68} label="SM active" value={`${item.active}%`} percent={item.active} color="#64748b" />
            <Row y={114} label={`그 안의 issue active ${item.issue}%`} value={`elapsed 의 ${product}%`} percent={product} color="#2563eb" />
            {active === 2 && (
              <Row y={160} label="pipe 를 얼마나 채웠나 (SM throughput)" value="값 없음" percent={0} color="#d97706" dashed />
            )}
          </svg>
        );
      }}
    />
  );
}
