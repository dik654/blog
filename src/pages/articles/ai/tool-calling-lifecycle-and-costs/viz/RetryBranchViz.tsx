import SceneShell from "./SceneShell";

/**
 * 본문 대응: #error-handling-and-retry — 실패 종류에 따라 갈라지고, 오류 코드만으로 재시도를 허용하지 않는다.
 * 대기 간격을 정하기 전의 판단이다. 간격 계산은 다음 그림이 맡는다.
 */
type NodeId = "fail" | "arg" | "perm" | "temp" | "fix" | "scope" | "code" | "check" | "retry" | "stop";

const NODES: Record<NodeId, { x: number; y: number; w: number; h: number; lines: readonly string[] }> = {
  fail: { x: 124, y: 2, w: 112, h: 26, lines: ["호출 실패"] },
  arg: { x: 6, y: 50, w: 112, h: 38, lines: ["인자가", "잘못됨"] },
  perm: { x: 124, y: 50, w: 112, h: 38, lines: ["권한이", "없음"] },
  temp: { x: 242, y: 50, w: 112, h: 38, lines: ["시간 초과·", "일부 서버 오류"] },
  fix: { x: 6, y: 108, w: 112, h: 38, lines: ["인자를", "고칩니다"] },
  scope: { x: 124, y: 108, w: 112, h: 38, lines: ["권한 범위에", "맞는 행동 선택"] },
  code: { x: 242, y: 108, w: 112, h: 38, lines: ["오류 코드만으로", "허용하지 않음"] },
  check: { x: 124, y: 166, w: 230, h: 38, lines: ["외부 변경이 있었다면 실제 결과와", "중복 실행 방지 조건을 먼저 확인"] },
  retry: { x: 124, y: 224, w: 112, h: 38, lines: ["안전·횟수 남음", "대기 뒤 재시도"] },
  stop: { x: 242, y: 224, w: 112, h: 38, lines: ["그 밖의 경우", "명시적 오류 반환"] },
};

const EDGES: readonly (readonly [NodeId, NodeId])[] = [
  ["fail", "arg"],
  ["fail", "perm"],
  ["fail", "temp"],
  ["arg", "fix"],
  ["perm", "scope"],
  ["temp", "code"],
  ["code", "check"],
  ["check", "retry"],
  ["check", "stop"],
];

const PATHS: readonly (readonly NodeId[])[] = [
  ["fail", "arg", "fix"],
  ["fail", "perm", "scope"],
  ["fail", "temp", "code", "check"],
  ["fail", "temp", "code", "check", "retry"],
  ["fail", "temp", "code", "check", "stop"],
];

const SCENES = [
  { label: "인자가 잘못됐을 때", summary: "기다려도 안 고쳐짐", note: "같은 인자로 기다렸다 다시 부를 일이 아닙니다. 인자를 고칩니다." },
  { label: "권한이 없을 때", summary: "기다려도 안 고쳐짐", note: "권한 범위에 맞는 행동을 선택합니다. 다른 도구로 우회해 같은 금지 행동을 실행하지 않고, 거부 결과는 원래 호출 ID로 돌려줍니다." },
  { label: "일시적일 수 있는 실패", summary: "먼저 확인", note: "시간 초과나 일부 서버 오류는 일시적일 수 있습니다. 다만 호출이 이미 외부를 바꿨을 수 있으므로 오류 코드만 보고 재시도하지 않습니다." },
  { label: "안전하고 횟수가 남았으면", summary: "대기 뒤 같은 작업 재시도", note: "변경 결과와 중복 방지를 확인한 안전한 경우에만, 횟수가 남아 있을 때 기다렸다가 반복합니다." },
  { label: "그렇지 않으면", summary: "원래 호출 ID에 반환", note: "반복하지 않고 결과 또는 명시적 오류를 원래 호출과 연결해 다음 모델 입력으로 넘깁니다." },
] as const;

export default function RetryBranchViz() {
  return (
    <SceneShell
      eyebrow="재시도 판단"
      title="실패의 종류를 먼저 가르고, 그중 일부만 기다립니다"
      description="파란 길이 지금 장면의 경로입니다. 대기 간격을 계산하기 전에 이 판단이 먼저입니다."
      ariaLabel="실패 종류에 따라 인자 수정, 권한 범위 행동, 확인 뒤 재시도로 갈라지는 분기"
      scenes={SCENES}
      render={(active) => {
        const path = PATHS[active];
        const on = (id: NodeId) => path.includes(id);
        return (
          <svg viewBox="0 0 360 266" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {EDGES.map(([from, to]) => {
              const a = NODES[from];
              const b = NODES[to];
              const lit = on(from) && on(to);
              const x1 = a.x + a.w / 2;
              const x2 = from === "code" ? x1 : b.x + b.w / 2;
              return <line key={`${from}-${to}`} x1={x1} x2={x2} y1={a.y + a.h} y2={b.y} stroke={lit ? "#2563eb" : "#94a3b8"} strokeWidth={lit ? 1.25 : 1} />;
            })}
            {(Object.keys(NODES) as NodeId[]).map((id) => {
              const node = NODES[id];
              const lit = on(id);
              return (
                <g key={id}>
                  <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={6} className="fill-background" stroke={lit ? "#2563eb" : "#94a3b8"} strokeWidth={lit ? 1.25 : 1} />
                  {node.lines.map((line, index) => (
                    <text
                      key={line}
                      x={node.x + node.w / 2}
                      y={node.y + node.h / 2 + 4 + (index - (node.lines.length - 1) / 2) * 14}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={lit ? 700 : 400}
                      fill={lit ? "#2563eb" : "#64748b"}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
