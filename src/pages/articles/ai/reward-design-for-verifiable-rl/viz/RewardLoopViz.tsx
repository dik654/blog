import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 문제→응답 생성→채점→유리한 응답의 확률 증가→새 응답 생성의 고리.
 * 틀린 통과 12개는 우연이면 노이즈, 반복 재현되면 학습될 수 있는 경로로 갈립니다.
 * 학습과 평가가 같은 규칙을 쓰면 오류가 함께 숨을 수 있어 독립 검수와 새 확인용 문제를 둡니다.
 */
const SCENES = [
  { label: "채점이 고리 안에 있습니다", summary: "응답 → 채점 → 확률 증가 → 새 응답", note: "채점 결과가 다음 응답의 확률을 바꾸고, 그 응답이 다시 채점됩니다. 채점기의 판단이 고리를 따라 다음 응답으로 돌아옵니다." },
  { label: "틀린 통과가 우연이라면", summary: "노이즈", note: "잘못 통과한 12개가 우연한 오류라면 노이즈가 됩니다. 다음 장면처럼 반복해서 재현되는 경우와 구분합니다." },
  { label: "틀린 통과가 재현된다면", summary: "학습할 수 있는 경로", note: "특정 형식이나 행동으로 반복 재현할 수 있으면 모델이 그 경로를 학습할 수 있습니다. 같은 오류가 고리를 다시 돌 수 있다는 뜻입니다." },
  { label: "평가도 같은 규칙이면", summary: "오류가 두 곳에서 함께 숨을 수 있음", note: "학습 때 쓴 답 추출 규칙과 확인용 문제를 평가에도 그대로 쓰면, 학습에서 놓친 오류를 평가에서도 놓칠 수 있습니다." },
  { label: "평가를 고리 밖에 둡니다", summary: "최적화한 지표 ↔ 실제 작업 성공", note: "독립된 정답 검수, 새로운 확인용 문제, 실패 사례의 분류를 두어 최적화한 지표와 실제 작업 성공을 다시 비교합니다." },
] as const;

function Box({ x, y, w, h, lines, on, color = "#2563eb" }: { x: number; y: number; w: number; h: number; lines: readonly string[]; on: boolean; color?: string }) {
  const mid = y + h / 2 + 4 - ((lines.length - 1) * 14) / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={on ? color : "#94a3b8"} strokeWidth={on ? 1.25 : 1} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={mid + index * 14} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={on ? color : "#64748b"}>{line}</text>
      ))}
    </g>
  );
}

function Slot({ title, body, on, color }: { title: string; body: string; on: boolean; color: string }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-1.5 text-xs leading-5 ${on ? "" : "border-border/60 opacity-45"}`} style={on ? { borderColor: color } : undefined}>
      <span className="block font-semibold">{title}</span>
      <span className="block text-muted-foreground">{body}</span>
    </div>
  );
}

export default function RewardLoopViz() {
  return (
    <SceneShell
      eyebrow="최적화의 고리"
      title="잘못 통과한 답은 고리를 따라 돌아올 수 있습니다"
      description="위는 학습의 고리, 아래는 잘못 통과한 12개가 갈리는 두 경우와 평가의 두 방식입니다."
      ariaLabel="문제 응답 채점 확률 증가의 고리와 틀린 통과의 두 갈래, 평가 방식 비교"
      scenes={SCENES}
      render={(active) => {
        const color = active === 2 ? "#d97706" : "#2563eb";
        const loopOn = active === 0 || active === 2;
        const stroke = loopOn ? color : "#94a3b8";
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 128" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label="문제에서 응답 생성, 채점, 유리한 응답의 확률 증가를 거쳐 새 응답 생성으로 돌아오는 고리">
              <defs>
                <marker id="reward-loop-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L8 4 L0 8 Z" fill="#94a3b8" />
                </marker>
              </defs>
              <Box x={6} y={6} w={70} h={36} lines={["문제"]} on={false} />
              <Box x={112} y={6} w={92} h={36} lines={["응답 생성"]} on={loopOn} color={color} />
              <Box x={252} y={6} w={102} h={36} lines={["채점"]} on={loopOn} color={color} />
              <Box x={234} y={80} w={120} h={44} lines={["유리한 응답의", "확률 증가"]} on={loopOn} color={color} />
              <line x1={76} y1={24} x2={110} y2={24} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#reward-loop-arrow)" />
              <line x1={204} y1={24} x2={250} y2={24} stroke={stroke} strokeWidth={1} markerEnd="url(#reward-loop-arrow)" />
              <line x1={303} y1={42} x2={303} y2={78} stroke={stroke} strokeWidth={1} markerEnd="url(#reward-loop-arrow)" />
              <path d="M234 102 L158 102 L158 44" fill="none" stroke={stroke} strokeWidth={1} markerEnd="url(#reward-loop-arrow)" />
              <text x={165} y={72} fontSize={12} fill={loopOn ? color : "#64748b"}>새 응답 생성</text>
              {active === 3 && <Box x={6} y={80} w={138} h={44} lines={["평가", "학습과 같은 규칙"]} on color="#d97706" />}
              {active === 4 && <Box x={6} y={80} w={138} h={44} lines={["평가 (고리 밖)", "독립 검수·새 문제"]} on color="#2563eb" />}
            </svg>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">잘못 통과한 12개가</p>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <Slot title="우연한 오류" body="노이즈가 됨" on={active === 1} color="#2563eb" />
              <Slot title="반복 재현 가능" body="학습할 수 있음" on={active === 2} color="#d97706" />
            </div>
            <p className="mt-2 text-xs font-semibold text-muted-foreground">평가에 쓰는 규칙이</p>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <Slot title="학습과 같으면" body="함께 숨을 수 있음" on={active === 3} color="#d97706" />
              <Slot title="독립 검수·새 문제" body="실제 성공과 비교" on={active === 4} color="#2563eb" />
            </div>
          </div>
        );
      }}
    />
  );
}
