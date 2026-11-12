import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mtp — draft path가 future token 후보를 만들고 main model이 한 번에 검증,
 * 앞에서부터 일치한 token만 확정. 마지막 장면은 글의 예: 6.65GB/cycle ÷ 평균 3.5 ≈ 1.9GB/token.
 * 후보 4개, 이번 cycle 3개 일치는 모양을 보이려는 가정이다.
 */
const CANDIDATES = 4;
const MATCHED = 3;
const X0 = 30;
const BOX = 56;
const GAP = 18;
const boxX = (i: number) => X0 + i * (BOX + GAP);
const STREAM_GB = 6.65;
const AVG_COMMIT = 3.5;

const SCENES = [
  {
    label: "일반 decode",
    summary: "main forward 1회 → token 1개",
    note: "일반 decode는 main model forward마다 다음 token 하나를 확정합니다. token 4개를 얻으려면 main weight를 네 번 읽습니다.",
  },
  {
    label: "draft 후보 만들기",
    summary: "draft path → 후보 4개 (가정)",
    note: "MTP 기반 speculative decoding에서는 model-native draft path가 앞으로 올 token 후보를 먼저 만듭니다. GLM-5.2 공식 config에는 next-token-prediction layer가 1개 있고, 별도 독립 draft model이 반드시 있다는 뜻은 아닙니다. 후보 개수 4는 가정입니다.",
  },
  {
    label: "main이 한 번에 검증",
    summary: "main forward 1회로 4자리 확인",
    note: "main model은 후보 위치 여러 개를 forward 한 번으로 검증합니다. 그림에서는 앞의 세 자리가 일치하고 네 번째가 어긋났다고 가정했습니다.",
  },
  {
    label: "앞에서부터 확정",
    summary: "이번 cycle: 3개 확정 (가정)",
    note: "앞에서부터 일치한 token만 받아들이고, 처음 어긋난 자리부터는 버립니다. 그래서 한 verification iteration에서 하나보다 많은 token을 확정할 수 있습니다.",
  },
  {
    label: "weight read를 나눠 쓰기",
    summary: "6.65GB ÷ 3.5 ≈ 1.9GB/token",
    note: "글의 예처럼 6.65GB/cycle을 평균 3.5 token이 나누면 token당 main weight 항은 약 1.9GB입니다. draft·KV·sampling 비용이 0이 아니므로 속도 향상은 acceptance length와 iteration latency를 함께 재야 합니다.",
  },
] as const;

function TokenBox({ i, state }: { i: number; state: "none" | "draft" | "ok" | "bad" | "plain" }) {
  if (state === "none") return null;
  const color = state === "ok" || state === "plain" ? "#16a34a" : state === "bad" ? "#94a3b8" : "#d97706";
  return (
    <g>
      <rect x={boxX(i)} y={96} width={BOX} height={30} rx={4} fill={color} fillOpacity={state === "bad" ? 0.06 : 0.16} stroke={color} strokeWidth={1} strokeDasharray={state === "draft" ? "4 3" : undefined} />
      <text x={boxX(i) + BOX / 2} y={115} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {state === "plain" ? `token ${i + 1}` : `후보 ${i + 1}`}
      </text>
      {state === "bad" && <line x1={boxX(i) + 6} y1={122} x2={boxX(i) + BOX - 6} y2={100} stroke="#dc2626" strokeWidth={1.25} />}
    </g>
  );
}

export default function MtpCycleViz() {
  return (
    <SceneShell
      eyebrow="MTP verification cycle"
      title="main weight를 한 번 읽고 여러 token을 확정합니다"
      description="위 띠는 main model forward, 아래 칸은 token 자리입니다. 후보 4개와 이번 cycle의 일치 위치는 가정이고, 6.65GB와 평균 3.5개는 글의 계산 예입니다."
      ariaLabel="draft 후보 생성, main model 일괄 검증, 앞에서부터 확정, token당 weight traffic 계산 순서"
      scenes={SCENES}
      render={(active) => {
        const states = Array.from({ length: CANDIDATES }, (_, i) => {
          if (active === 0) return "plain" as const;
          if (active === 1) return "draft" as const;
          if (active === 2) return "draft" as const;
          return i < MATCHED ? ("ok" as const) : ("bad" as const);
        });
        const rowW = CANDIDATES * BOX + (CANDIDATES - 1) * GAP;
        const share = rowW / AVG_COMMIT;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 0 &&
              Array.from({ length: CANDIDATES }, (_, i) => (
                <g key={`f-${i}`}>
                  <rect x={boxX(i)} y={40} width={BOX} height={28} rx={4} fill="#2563eb" fillOpacity={0.16} stroke="#2563eb" strokeWidth={1} />
                  <text x={boxX(i) + BOX / 2} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{`main ${i + 1}`}</text>
                  <line x1={boxX(i) + BOX / 2} x2={boxX(i) + BOX / 2} y1={68} y2={94} stroke="#2563eb" strokeWidth={1} />
                </g>
              ))}
            {active === 1 && (
              <>
                <rect x={X0} y={40} width={rowW} height={28} rx={4} fill="#d97706" fillOpacity={0.1} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                <text x={X0 + rowW / 2} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">draft path가 후보를 만듦</text>
              </>
            )}
            {active >= 2 && (
              <>
                <rect x={X0} y={40} width={rowW} height={28} rx={4} fill="#2563eb" fillOpacity={0.16} stroke="#2563eb" strokeWidth={1} />
                <text x={X0 + rowW / 2} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">main forward 1회 · 모든 후보 자리 검증</text>
              </>
            )}
            {active === 2 &&
              Array.from({ length: CANDIDATES }, (_, i) => (
                <text key={`m-${i}`} x={boxX(i) + BOX / 2} y={86} textAnchor="middle" fontSize={12} fontWeight={700} fill={i < MATCHED ? "#16a34a" : "#dc2626"}>
                  {i < MATCHED ? "일치" : "불일치"}
                </text>
              ))}
            {states.map((state, i) => (
              <TokenBox key={`t-${i}`} i={i} state={state} />
            ))}
            {active === 3 && (
              <text x={boxX(MATCHED) + BOX / 2} y={142} textAnchor="middle" fontSize={11} fill="#64748b">버림</text>
            )}
            <text x={X0} y={162} fontSize={11} fontWeight={700} fill="#64748b">
              {active === 0 ? "main weight 읽기 4회 → token 4개" : active === 4 ? "막대 전체 6.65GB를 cycle 평균 3.5개가 나눔" : active === 3 ? "main weight 읽기 1회 → token 3개" : active === 1 ? "아직 main forward 전" : "main weight 읽기 1회"}
            </text>
            {active === 4 && (
              <g>
                {Array.from({ length: 4 }, (_, i) => {
                  const w = i < 3 ? share : rowW - 3 * share;
                  return (
                    <rect key={`s-${i}`} x={X0 + i * share} y={172} width={w} height={22} fill="#2563eb" fillOpacity={i < 3 ? 0.22 : 0.1} stroke="#2563eb" strokeWidth={1} />
                  );
                })}
                {[0, 1, 2].map((i) => (
                  <text key={`l-${i}`} x={X0 + i * share + share / 2} y={187} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">
                    {`≈${(STREAM_GB / AVG_COMMIT).toFixed(1)}GB`}
                  </text>
                ))}
                <text x={X0 + rowW + 4} y={187} fontSize={10.5} fill="#64748b">0.5개분</text>
                <text x={X0} y={208} fontSize={10.5} fill="#64748b">KV·draft·sampling traffic은 이 막대에 없음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
