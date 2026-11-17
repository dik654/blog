import SceneShell from "./SceneShell";

/**
 * 본문 대응: #freezing — gradual unfreezing의 resume test.
 * unfreeze 경계 직전 checkpoint → 연속 실행 / 새 process 복원 실행 → 같은 다음 batch →
 * LR trace·optimizer membership·buffer·다음 parameter 비교.
 */
const SCENES = [
  { label: "경계 직전 저장", summary: "checkpoint 1개", note: "Upper block을 여는 unfreeze 경계 바로 직전에 checkpoint를 저장합니다." },
  { label: "두 갈래 실행", summary: "연속 실행 · 복원 실행", note: "한쪽은 같은 process에서 그대로 이어 가고, 다른 쪽은 새 process에서 방금 저장한 checkpoint를 불러와 이어 갑니다." },
  { label: "같은 다음 batch", summary: "입력을 똑같이", note: "두 실행에 같은 다음 batch를 넣습니다. 입력이 같아야 차이가 생겼을 때 복원 과정만 의심할 수 있습니다." },
  { label: "네 항목 비교", summary: "LR · membership · buffer · parameter", note: "LR trace, optimizer membership, buffer, 그리고 그 batch로 갱신된 다음 parameter를 두 실행 사이에서 비교합니다." },
  { label: "parity가 없으면", summary: "원인 구분 불가", note: "두 실행이 다르면 다음 stage에서 보이는 변화가 unfreeze의 이득인지 복원 오류인지 구분할 수 없습니다." },
] as const;

const COMPARE = ["LR trace", "optimizer membership", "buffer", "다음 parameter"] as const;

const W = 360;
const H = 176;
const TOP_Y = 44;
const BOT_Y = 128;

function Box({ x, y, w, label, sub, on, tone = "#2563eb" }: { x: number; y: number; w: number; label: string; sub?: string; on: boolean; tone?: string }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <rect x={x} y={y - 17} width={w} height={34} rx={6} fill="#ffffff" stroke={tone} strokeWidth={1.25} />
      <text x={x + w / 2} y={sub ? y - 2 : y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">{label}</text>
      {sub && <text x={x + w / 2} y={y + 11} textAnchor="middle" fontSize={9.5} fill="#475569">{sub}</text>}
    </g>
  );
}

export default function ResumeParityViz() {
  return (
    <SceneShell
      eyebrow="Resume test · unfreeze 경계"
      title="같은 checkpoint에서 두 번 이어 달려 결과가 같은지 봅니다"
      description="Optimizer membership은 optimizer가 실제로 갱신하는 parameter 목록, LR trace는 update마다 기록한 learning rate입니다. 왼쪽 세로 점선이 unfreeze 경계입니다."
      ariaLabel="unfreeze 경계 직전 checkpoint에서 연속 실행과 복원 실행을 나눠 같은 batch로 비교하는 절차"
      scenes={SCENES}
      render={(active) => {
        const bad = active === 4;
        const cmpTone = bad ? "#dc2626" : "#2563eb";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={92} x2={92} y1={10} y2={H - 10} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={96} y={20} fontSize={10} fill="#64748b">unfreeze 경계</text>
              <Box x={6} y={(TOP_Y + BOT_Y) / 2} w={78} label="checkpoint" sub="경계 직전" on />
              <g opacity={active >= 1 ? 1 : 0.2}>
                <path d={`M 84 86 C 100 86 100 ${TOP_Y} 112 ${TOP_Y}`} fill="none" stroke="#64748b" strokeWidth={1} />
                <path d={`M 84 86 C 100 86 100 ${BOT_Y} 112 ${BOT_Y}`} fill="none" stroke="#64748b" strokeWidth={1} />
              </g>
              <Box x={112} y={TOP_Y} w={96} label="연속 실행" sub="같은 process" on={active >= 1} />
              <Box x={112} y={BOT_Y} w={96} label="복원 실행" sub="새 process" on={active >= 1} />
              <g opacity={active >= 2 ? 1 : 0.2}>
                <line x1={208} x2={226} y1={TOP_Y} y2={TOP_Y} stroke="#64748b" strokeWidth={1} />
                <line x1={208} x2={226} y1={BOT_Y} y2={BOT_Y} stroke="#64748b" strokeWidth={1} />
                <rect x={226} y={TOP_Y - 9} width={20} height={18} rx={3} fill="#e2e8f0" stroke="#64748b" strokeWidth={1} />
                <rect x={226} y={BOT_Y - 9} width={20} height={18} rx={3} fill="#e2e8f0" stroke="#64748b" strokeWidth={1} />
                <text x={236} y={(TOP_Y + BOT_Y) / 2 + 4} textAnchor="middle" fontSize={9.5} fill="#475569">같은 batch</text>
              </g>
              <g opacity={active >= 3 ? 1 : 0.2}>
                <path d={`M 246 ${TOP_Y} C 262 ${TOP_Y} 262 86 276 86`} fill="none" stroke={cmpTone} strokeWidth={1} />
                <path d={`M 246 ${BOT_Y} C 262 ${BOT_Y} 262 86 276 86`} fill="none" stroke={cmpTone} strokeWidth={1} />
              </g>
              <Box x={276} y={86} w={78} label={bad ? "불일치" : "비교"} sub={bad ? "원인 구분 불가" : "네 항목"} on={active >= 3} tone={cmpTone} />
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COMPARE.map((item) => (
                <div key={item} className={`min-w-0 rounded-lg border px-2 py-1.5 text-center text-xs font-semibold break-keep ${active >= 3 ? (bad ? "border-[#dc2626]" : "border-[#2563eb]") : "border-border text-muted-foreground"}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
