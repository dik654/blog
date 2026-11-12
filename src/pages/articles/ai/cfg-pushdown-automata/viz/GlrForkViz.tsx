import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lr-glr-parsing — LR은 stack 하나, GLR은 action 후보가 둘일 때 stack을 둘로 fork하고
 * 뒤의 입력과 모순되는 branch만 버린다. 토큰 수와 충돌 위치(t3), 버리는 위치(t5)는 그림을 위한 가정.
 */
const TOKENS = ["t1", "t2", "t3", "t4", "t5", "t6"] as const;
const tx = (i: number) => 40 + i * 56;
const MID = 76;
const UP = 50;
const DOWN = 102;
const AXIS = 136;
const FORK = 2;
const DROP = 4;
const LAST = TOKENS.length - 1;

const SCENES = [
  { label: "LR: stack 하나", summary: "lookahead + table → action 1개", note: "LR parser는 다음 몇 토큰(lookahead)과 parsing table을 보고 shift(토큰을 stack에 올림) 또는 reduce(stack 위 symbol들을 rule 왼쪽 하나로 줄임) 중 하나를 골라 stack을 하나만 유지합니다." },
  { label: "충돌", summary: "t3에서 action 후보 2개", note: "문법이 모호해 같은 lookahead에서 shift와 reduce가 둘 다 가능하면 LR table은 충돌합니다. 그림의 충돌 위치 t3은 가정입니다." },
  { label: "GLR: 둘로 fork", summary: "stack A(shift) · stack B(reduce)", note: "GLR은 여기서 reject하지 않고 stack을 둘로 나눠 두 해석을 함께 진행합니다. 두 stack 모두 다음 토큰을 계속 읽습니다." },
  { label: "모순된 branch 버림", summary: "t5에서 B 탈락 → A 채택", note: "몇 토큰 뒤 입력이 B의 해석과 맞지 않으면 B만 버리고 남은 A를 채택합니다. 어느 쪽이 남는지와 갈리는 위치 t5는 그림을 위한 가정입니다." },
  { label: "비용", summary: "t3~t5 동안 stack 2개 유지", note: "둘이 함께 살아 있는 구간에는 stack을 두 개 들고 있어 LR보다 메모리와 시간이 더 듭니다. 충돌이 드문 대부분의 프로그래밍 언어 문법에 LR 계열이 더 흔히 쓰이는 이유입니다." },
] as const;

export default function GlrForkViz() {
  return (
    <SceneShell
      eyebrow="LR과 GLR"
      title="충돌 지점에서 GLR은 stack을 나눴다가 하나만 남깁니다"
      description="가로축은 읽은 토큰 순서이고 선 하나가 stack 하나입니다. 토큰 개수와 충돌·탈락 위치는 그림을 위한 가정입니다."
      ariaLabel="LR의 단일 stack과 GLR의 stack fork 및 branch 탈락"
      scenes={SCENES}
      render={(active) => {
        const forked = active >= 2;
        const dropped = active >= 3;
        const blue = "#2563eb";
        const amber = "#d97706";
        const gray = "#94a3b8";
        const endMain = active === 0 ? LAST : FORK;
        return (
          <svg viewBox="0 0 360 162" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 4 && <rect x={tx(FORK)} y={34} width={tx(DROP) - tx(FORK)} height={84} fill="#2563eb" opacity={0.08} />}
            {active === 4 && (
              <text x={(tx(FORK) + tx(DROP)) / 2} y={30} textAnchor="middle" fontSize={12} fill="#475569">stack 2개 구간</text>
            )}
            {TOKENS.map((t, i) => (
              <g key={t}>
                <line x1={tx(i)} x2={tx(i)} y1={AXIS - 2} y2={AXIS + 2} stroke={gray} strokeWidth={1} />
                <text x={tx(i)} y={AXIS + 18} textAnchor="middle" fontSize={13} fill="#64748b">{t}</text>
              </g>
            ))}
            <line x1={tx(0)} x2={tx(LAST)} y1={AXIS} y2={AXIS} stroke={gray} strokeWidth={1} />
            <line x1={tx(0)} x2={tx(endMain)} y1={MID} y2={MID} stroke={blue} strokeWidth={1.25} />
            {active === 1 && (
              <>
                <line x1={tx(FORK)} x2={tx(FORK) + 40} y1={MID} y2={UP + 6} stroke={gray} strokeWidth={1} strokeDasharray="3 3" />
                <line x1={tx(FORK)} x2={tx(FORK) + 40} y1={MID} y2={DOWN - 6} stroke={gray} strokeWidth={1} strokeDasharray="3 3" />
                <text x={tx(FORK) + 46} y={UP + 10} fontSize={13} fill="#475569">shift?</text>
                <text x={tx(FORK) + 46} y={DOWN - 2} fontSize={13} fill="#475569">reduce?</text>
                <text x={tx(FORK)} y={MID - 12} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">충돌</text>
              </>
            )}
            {forked && (
              <>
                <polyline points={`${tx(FORK)},${MID} ${tx(FORK + 1)},${UP} ${tx(LAST)},${UP}`} fill="none" stroke={blue} strokeWidth={1.25} />
                <text x={tx(LAST)} y={UP - 8} textAnchor="end" fontSize={13} fontWeight={700} fill={blue}>stack A (shift)</text>
                <polyline
                  points={`${tx(FORK)},${MID} ${tx(FORK + 1)},${DOWN} ${tx(dropped ? DROP : LAST)},${DOWN}`}
                  fill="none"
                  stroke={amber}
                  strokeWidth={1.25}
                  strokeDasharray={dropped ? "4 3" : undefined}
                />
                <text x={dropped ? tx(DROP) + 12 : tx(LAST)} y={dropped ? DOWN + 4 : DOWN + 20} textAnchor={dropped ? "start" : "end"} fontSize={13} fontWeight={700} fill={amber}>
                  {dropped ? "B 버림" : "stack B (reduce)"}
                </text>
                {dropped && (
                  <g stroke="#dc2626" strokeWidth={1.25}>
                    <line x1={tx(DROP) - 5} x2={tx(DROP) + 5} y1={DOWN - 5} y2={DOWN + 5} />
                    <line x1={tx(DROP) - 5} x2={tx(DROP) + 5} y1={DOWN + 5} y2={DOWN - 5} />
                  </g>
                )}
              </>
            )}
            {active === 0 && <text x={tx(LAST)} y={MID - 10} textAnchor="end" fontSize={13} fontWeight={700} fill={blue}>stack 1개</text>}
          </svg>
        );
      }}
    />
  );
}
