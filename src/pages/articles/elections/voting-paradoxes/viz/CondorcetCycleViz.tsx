import { useId } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·cycle·agenda — 같은 세 표가 순환과 의사일정 효과를 만든다. */
const SCENES = [
  "세 사람의 순서를 그대로 적는다",
  "둘씩 세 번 비교한다",
  "세 승패를 한 그림에 잇는다",
  "표결 순서만 바꿔 본다",
] as const;

const CONTROL_LABELS = ["세 표", "세 비교", "승패 고리", "표결 순서"] as const;
const PREFS = [
  ["가", "나", "다"],
  ["나", "다", "가"],
  ["다", "가", "나"],
] as const;

const PAIRS = [
  { left: "가", right: "나", winner: "가", voters: "1번·3번", score: "2대 1" },
  { left: "나", right: "다", winner: "나", voters: "1번·2번", score: "2대 1" },
  { left: "다", right: "가", winner: "다", voters: "2번·3번", score: "2대 1" },
] as const;

const AGENDAS = [
  { first: "가 대 나 → 가 승", second: "가 대 다 → 다 승", winner: "다" },
  { first: "나 대 다 → 나 승", second: "나 대 가 → 가 승", winner: "가" },
  { first: "가 대 다 → 다 승", second: "다 대 나 → 나 승", winner: "나" },
] as const;

const NOTES = [
  "1번은 가>나>다, 2번은 나>다>가, 3번은 다>가>나입니다. 각 사람 안에서는 앞뒤가 모순되지 않습니다.",
  "가-나, 나-다, 다-가를 각각 세면 매번 2대 1입니다. 무승부도 계산 착오도 없는데 세 번의 승자가 서로 이어지지 않습니다.",
  "가가 나를, 나가 다를, 다가 가를 이깁니다. 가장 강한 안 하나가 남지 않고 출발점으로 돌아오는 고리가 생깁니다.",
  "같은 세 표를 두고 먼저 붙일 쌍만 바꾸면 다·가·나가 차례로 우승합니다. 순서를 정하는 권한이 결과를 고르는 권한이 됩니다.",
] as const;

function PreferenceRows() {
  return (
    <div className="space-y-2" aria-label="세 사람의 선호 순서">
      {PREFS.map((pref, voter) => (
        <div
          key={voter}
          className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2"
        >
          <span className="text-xs font-bold text-muted-foreground">
            {voter + 1}번
          </span>
          <div className="grid grid-cols-3 border border-border bg-background">
            {pref.map((option, rank) => (
              <div
                key={option}
                className={`flex min-h-11 items-center justify-center border-r border-border text-sm font-bold last:border-r-0 ${
                  rank === 0 ? "bg-primary/10 text-primary" : "text-foreground"
                }`}
              >
                {option}
                <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                  {rank + 1}위
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CondorcetCycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200, {
    loop: false,
    autoPlay: false,
  });
  const arrowId = `condorcet-${useId().replace(/:/g, "")}`;
  const step = scenes.active;

  return (
    <VizFrame
      className="mobile-viz-stable-height"
      eyebrow="세 번의 2대 1"
      title="표는 그대로인데 마지막 답이 사라집니다"
      description="세 사람의 순서를 적고, 둘씩 비교한 뒤, 표결 순서만 바꿔 봅니다."
      note="사람 수가 홀수이고 모두가 세 안을 빠짐없이 엄격하게 순위 매긴 경우입니다. 그래서 모든 쌍의 승패가 무승부 없이 정해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="같은 세 표에서 다수결의 고리와 의사일정 효과가 생기는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-full min-w-0 flex-col overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <div id={scenes.playbackId} className="min-w-0 py-1">
            <p className="text-[11px] font-black text-primary">
              장면 {step + 1} / {SCENES.length}
            </p>
            <h4 className="mt-2 text-base font-bold leading-6">
              {SCENES[step]}
            </h4>

            <div className="mt-4 min-w-0">
              {step === 0 && (
                <div className="space-y-4">
                  <PreferenceRows />
                  <p className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
                    왼쪽일수록 더 원합니다. 각 행만 보면 세 사람 모두 일관된
                    순서를 가집니다.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-2">
                  {PAIRS.map((pair) => (
                    <div
                      key={`${pair.left}-${pair.right}`}
                      className="grid gap-2 border-b border-border py-3 last:border-b-0 sm:grid-cols-[7rem_5rem_minmax(0,1fr)] sm:items-center"
                    >
                      <span className="text-sm font-semibold">
                        {pair.left} 대 {pair.right}
                      </span>
                      <strong className="text-sm text-primary">
                        {pair.winner} 승 · {pair.score}
                      </strong>
                      <span className="text-xs leading-5 text-muted-foreground">
                        {pair.winner}를 고른 사람: {pair.voters}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="mx-auto w-full max-w-md">
                  <svg
                    viewBox="0 0 360 250"
                    role="img"
                    aria-label="가가 나를, 나가 다를, 다가 가를 이기는 원형 관계"
                    className="h-auto w-full"
                  >
                    <defs>
                      <marker
                        id={arrowId}
                        markerWidth="8"
                        markerHeight="8"
                        refX="7"
                        refY="4"
                        orient="auto"
                      >
                        <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
                      </marker>
                    </defs>
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      className="text-primary"
                      markerEnd={`url(#${arrowId})`}
                    >
                      <path d="M192 57 C244 68 278 98 288 137" />
                      <path d="M270 174 C232 210 150 210 109 174" />
                      <path d="M92 137 C101 98 136 68 168 58" />
                    </g>
                    {[
                      { label: "가", x: 180, y: 42 },
                      { label: "나", x: 298, y: 158 },
                      { label: "다", x: 62, y: 158 },
                    ].map((node) => (
                      <g key={node.label}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="24"
                          className="fill-background stroke-primary"
                          strokeWidth="1.25"
                        />
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          fontSize="16"
                          fontWeight="700"
                          className="fill-foreground"
                        >
                          {node.label}
                        </text>
                      </g>
                    ))}
                    <text
                      x="225"
                      y="91"
                      fontSize="11"
                      className="fill-muted-foreground"
                    >
                      가가 나를 이김
                    </text>
                    <text
                      x="151"
                      y="226"
                      fontSize="11"
                      className="fill-muted-foreground"
                    >
                      나가 다를 이김
                    </text>
                    <text
                      x="29"
                      y="91"
                      fontSize="11"
                      className="fill-muted-foreground"
                    >
                      다가 가를 이김
                    </text>
                  </svg>
                  <p className="mt-2 text-center text-sm font-semibold text-primary">
                    한 바퀴를 돌아 출발점으로 되돌아옵니다.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  {AGENDAS.map((agenda, index) => (
                    <div
                      key={agenda.winner}
                      className="grid gap-2 border border-border bg-background p-3 sm:grid-cols-[2rem_minmax(0,1fr)_4.5rem] sm:items-center"
                    >
                      <span className="text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div className="text-sm leading-6">
                        <span>{agenda.first}</span>
                        <span className="mx-2 text-muted-foreground">→</span>
                        <span>{agenda.second}</span>
                      </div>
                      <strong className="text-sm text-primary">
                        {agenda.winner} 우승
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {NOTES[step]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={CONTROL_LABELS}
          playLabel="과정 재생"
        />
      </div>

      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
