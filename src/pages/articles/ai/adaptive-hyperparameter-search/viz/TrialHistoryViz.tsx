import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proposal-loop — 완료 관측 네 개만으로 두 분포를 만들고,
 * 다섯 번째(조기 중단)·여섯 번째(실패)·일곱 번째(실행 중)는 상태 그대로 보존한다.
 * P 의 비율 6 > Q 의 2 로 P 를 실행하고, 그 결과가 새 행으로 이력에 더해진다.
 * 1~4 행에 손실 0.40·0.25·0.20·0.35 를 놓은 순서는 3절의 나열 순서를 따른 가정이다.
 */
type Row = { id: string; loss: string; state: string; stateColor: string; use: string; useColor: string; phase: number };

const ROWS: readonly Row[] = [
  { id: "1", loss: "0.40", state: "완료", stateColor: "#16a34a", use: "나머지 무리 → g", useColor: "#64748b", phase: 1 },
  { id: "2", loss: "0.25", state: "완료", stateColor: "#16a34a", use: "좋은 무리 → l", useColor: "#2563eb", phase: 1 },
  { id: "3", loss: "0.20", state: "완료", stateColor: "#16a34a", use: "좋은 무리 → l", useColor: "#2563eb", phase: 1 },
  { id: "4", loss: "0.35", state: "완료", stateColor: "#16a34a", use: "나머지 무리 → g", useColor: "#64748b", phase: 1 },
  { id: "5", loss: "최종값 없음", state: "조기 중단", stateColor: "#d97706", use: "중간값 사용은 버전 정책", useColor: "#d97706", phase: 2 },
  { id: "6", loss: "없음", state: "실패", stateColor: "#dc2626", use: "가짜 큰 손실 안 붙임", useColor: "#dc2626", phase: 2 },
  { id: "7", loss: "아직 없음", state: "실행 중", stateColor: "#7c3aed", use: "미래 결과는 못 씀", useColor: "#7c3aed", phase: 2 },
];

const SCENES = [
  { label: "제안 시점의 이력 일곱 행", summary: "완료 4 · 중단 1 · 실패 1 · 실행 중 1", note: "행마다 설정, 관측 손실, 실행 상태를 함께 남깁니다. 손실이 없는 행도 지우지 않습니다. 1~4행에 손실을 놓은 순서는 3절의 나열 순서를 따른 가정입니다." },
  { label: "완료 네 행으로 두 무리", summary: "l ← 0.25·0.20 / g ← 0.40·0.35", note: "이번 단순 계산은 완료 관측 네 개만으로 좋은 무리 분포 l 과 나머지 무리 분포 g 를 만든다고 둡니다." },
  { label: "나머지 세 행은 상태 그대로", summary: "중단·실패·실행 중을 보존", note: "실패한 행에 임의의 큰 손실을 붙이면 자원 실패와 성능이 한 숫자로 섞입니다. 실행 중인 행의 결과는 아직 없으므로 지금의 계산에 넣을 수 없습니다." },
  { label: "P 를 실행해 한 행을 더합니다", summary: "6 > 2 → P 실행 → 새 행", note: "P 의 비율 6 이 Q 의 2 보다 커서 P 를 먼저 실행합니다. 실제 손실은 실행이 끝나야 생기고, 그 결과와 상태가 새 행으로 이력에 더해집니다. P 가 더 나쁠 수도 있습니다." },
] as const;

const ROW_H = 22;
const TOP = 34;

export default function TrialHistoryViz() {
  return (
    <SceneShell
      eyebrow="제안 시점의 이력"
      title="완료 네 행만 계산에 쓰고 나머지 행은 상태 그대로 남깁니다"
      description="한 줄이 실행 한 번(trial)입니다. 오른쪽 칸은 이번 단순 계산에서 그 행을 어떻게 쓰는지입니다."
      ariaLabel="일곱 개 실행 기록 중 완료 네 개로 두 무리를 만들고 P 를 실행해 새 행을 더하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={12} y={20} fontSize={11} fontWeight={700} fill="#64748b">#</text>
          <text x={32} y={20} fontSize={11} fontWeight={700} fill="#64748b">손실</text>
          <text x={104} y={20} fontSize={11} fontWeight={700} fill="#64748b">상태</text>
          <text x={176} y={20} fontSize={11} fontWeight={700} fill="#64748b">이번 계산에서</text>
          <line x1={8} x2={352} y1={26} y2={26} stroke="#cbd5e1" strokeWidth={1} />
          {ROWS.map((row, index) => {
            const y = TOP + index * ROW_H;
            const lit = active === 0 || active === 3 || row.phase === active;
            const showUse = active >= row.phase;
            return (
              <g key={row.id} opacity={lit ? 1 : 0.35}>
                <text x={12} y={y + 11} fontSize={11} fill="#475569">{row.id}</text>
                <text x={32} y={y + 11} fontSize={11} fontWeight={700} fill="#475569">{row.loss}</text>
                <rect x={100} y={y} width={62} height={16} rx={8} fill="none" stroke={row.stateColor} strokeWidth={1} />
                <text x={131} y={y + 11} textAnchor="middle" fontSize={10.5} fill={row.stateColor}>{row.state}</text>
                <text x={176} y={y + 11} fontSize={11} fill={row.useColor}>{showUse ? row.use : "·"}</text>
              </g>
            );
          })}
          {(() => {
            const y = TOP + ROWS.length * ROW_H;
            const on = active === 3;
            return (
              <g>
                <rect x={8} y={y - 4} width={344} height={24} rx={6} fill="none" stroke={on ? "#2563eb" : "#e2e8f0"} strokeWidth={1} strokeDasharray={on ? undefined : "3 2"} />
                <text x={12} y={y + 11} fontSize={11} fontWeight={700} fill={on ? "#2563eb" : "#cbd5e1"}>{on ? "P" : "+"}</text>
                <text x={32} y={y + 11} fontSize={11} fill={on ? "#475569" : "#cbd5e1"}>{on ? "실행 후에 기록" : "다음 제안 자리"}</text>
                <text x={176} y={y + 11} fontSize={11} fill={on ? "#2563eb" : "#cbd5e1"}>{on ? "새 행으로 이력 갱신" : ""}</text>
              </g>
            );
          })()}
        </svg>
      )}
    />
  );
}
