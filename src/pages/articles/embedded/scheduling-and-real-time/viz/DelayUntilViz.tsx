import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-wake — 지난 목표 + 주기로 다음 목표를 만든다. tick 하나 = 1 ms, 카운터 넘침 없음.
 * 현재 3 → 목표 10, 7 tick 대기. 현재 12 → 목표 10 이미 지남, 대기 없음. 다음 호출 14 → 목표 20, 6 tick 대기.
 * 비교용: 완료 시각 3에 10을 더하면 13이 되어 눈금에서 3 밀린다.
 */
const X0 = 16;
const UNIT = 16.5;
const xOf = (t: number) => X0 + t * UNIT;
const AXIS_Y = 118;

const SCENES = [
  { label: "완료 시각에 10을 더한다면", summary: "3 + 10 = 13", formula: "다음 시작 = 완료 3 + 10 = 13", run: [1, 3], now: 3, wait: [3, 13], waitLabel: "10 tick 쉼", mark: 13, markLabel: "13", missed: false, note: "이 함수의 계산이 아니라 비교용입니다. 일을 끝낸 뒤 일정 시간 쉬면 처리 시간이 다음 시작에 더해져 원래 눈금 10에서 벗어납니다." },
  { label: "제때 호출", summary: "0 + 10 = 10, 7 tick 대기", formula: "지난 목표 0 + 주기 10 = 10", run: [1, 3], now: 3, wait: [3, 10], waitLabel: "7 tick 대기", mark: 10, markLabel: "", missed: false, note: "현재가 3 tick이면 목표 10까지 7 tick을 기다리고 지난 목표를 10으로 바꿉니다. 깨어나면 준비 상태가 될 뿐이어서, 더 높은 우선순위 일이 있으면 실제 실행은 늦을 수 있습니다." },
  { label: "늦은 호출 (다른 경우)", summary: "0 + 10 = 10, 이미 지남", formula: "지난 목표 0 + 주기 10 = 10", run: null, now: 12, wait: null, waitLabel: "", mark: 10, markLabel: "", missed: true, note: "호출 때 현재가 12 tick이면 목표 10은 이미 지났습니다. 함수는 기다리지 않고 지난 목표를 10으로 둡니다. 놓친 10 tick의 측정을 과거로 되돌려 실행할 수는 없습니다." },
  { label: "늦은 뒤 다음 호출", summary: "10 + 10 = 20, 6 tick 대기", formula: "지난 목표 10 + 주기 10 = 20", run: [12, 14], now: 14, wait: [14, 20], waitLabel: "6 tick 대기", mark: 20, markLabel: "", missed: true, note: "늦은 작업이 12–14 tick에 2 tick을 쓰고 14에 다시 부르는 가정입니다. 기준이 현재 14가 아니라 지난 목표 10이므로 눈금 20으로 돌아옵니다." },
] as const;

export default function DelayUntilViz() {
  return (
    <SceneShell
      eyebrow="다음 목표 시각"
      title="현재 시각이 아니라 지난 목표에서 다음 목표를 만듭니다"
      description="가로축은 tick이고 tick 하나를 1 ms, 카운터 넘침은 없다고 둡니다(가정). 세로 눈금 0·10·20은 센서의 원래 주기입니다."
      ariaLabel="xTaskDelayUntil의 목표 계산과 대기 구간"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 364 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={182} y={16} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">{scene.formula}</text>
            {[0, 10, 20].map((t) => (
              <g key={t}>
                <line x1={xOf(t)} x2={xOf(t)} y1={34} y2={AXIS_Y} stroke="#64748b" strokeWidth={1} strokeDasharray="3 2" />
                <text x={xOf(t)} y={AXIS_Y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">{t}</text>
              </g>
            ))}
            <line x1={X0} x2={xOf(20)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {scene.run && (
              <g>
                <rect x={xOf(scene.run[0])} y={46} width={(scene.run[1] - scene.run[0]) * UNIT} height={26} rx={3} fill="#2563eb" />
                <text x={xOf((scene.run[0] + scene.run[1]) / 2)} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">실행</text>
              </g>
            )}
            {scene.wait && (
              <g>
                <rect x={xOf(scene.wait[0])} y={46} width={(scene.wait[1] - scene.wait[0]) * UNIT} height={26} rx={3} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 2" />
                <text x={xOf((scene.wait[0] + scene.wait[1]) / 2)} y={63} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">{scene.waitLabel}</text>
              </g>
            )}
            <polygon points={`${xOf(scene.mark) - 6},${AXIS_Y - 12} ${xOf(scene.mark) + 6},${AXIS_Y - 12} ${xOf(scene.mark)},${AXIS_Y}`} fill={scene.missed && scene.mark === 10 ? "#dc2626" : scene.mark === 13 ? "#d97706" : "#16a34a"} />
            {scene.markLabel && <text x={xOf(scene.mark)} y={AXIS_Y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">{scene.markLabel}</text>}
            {scene.missed && scene.mark === 10 && <text x={xOf(10) - 8} y={AXIS_Y - 16} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">목표 10 놓침</text>}
            <line x1={xOf(scene.now)} x2={xOf(scene.now)} y1={78} y2={AXIS_Y} stroke="#2563eb" strokeWidth={1.25} />
            <text x={xOf(scene.now)} y={AXIS_Y + 30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">현재 {scene.now}</text>
          </svg>
        );
      }}
    />
  );
}
