import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #visibility — ExplainedFormula interpretation의 length 5 예.
 * 행 = query 위치 i, 열 = key 위치 j. 칸이 열려 있으면 query i가 key j에 weight를 줄 수 있습니다.
 * 장면 1: 실제 token 5개 → query 2가 0…4를 읽음.
 * 장면 2: 마지막 두 slot이 PAD → PAD 열을 모든 query에서 닫고 query 2는 0…2만 읽음.
 * 장면 3: causal decoder(본문 #encoder-boundary) → query i는 prefix 0…i만 읽음.
 */

type Mode = "full" | "pad" | "causal";

const N = 5;
const FOCUS = 2;
const PAD_FROM = 3;

const SCENES: readonly { label: string; summary: string; note: string; mode: Mode }[] = [
  {
    label: "실제 token 5개",
    summary: "query 2 → key 0…4",
    note: "입력 전체가 이미 주어져 있으므로 query 2는 왼쪽 0·1, 자기 자신 2, 오른쪽 3·4를 모두 읽습니다. 모든 행이 같은 모양이라 열린 칸이 꽉 찬 사각형이 됩니다.",
    mode: "full",
  },
  {
    label: "마지막 두 slot이 PAD",
    summary: "query 2 → key 0…2",
    note: "PAD는 길이를 맞추려고 붙인 칸이라 key 3·4 열을 모든 query에서 닫습니다. Query 2에게 남는 key는 0…2이고, softmax는 이 세 칸 안에서만 합이 1이 됩니다. PAD 위치 자체의 출력 행은 이 글에서 다루지 않아 흐리게 두었습니다.",
    mode: "pad",
  },
  {
    label: "비교: causal decoder",
    summary: "query 2 → key 0…2",
    note: "다음 token을 순차 생성하는 causal decoder는 query i가 prefix 0…i만 읽어 열린 칸이 삼각형이 됩니다. Query 2가 읽는 칸 수는 PAD 장면과 같은 3개지만, 이유는 PAD가 아니라 prefix 0…i만 읽는 규칙이고 key 3·4도 실제 token입니다.",
    mode: "causal",
  },
];

const LABELS = SCENES.map((s) => s.label);
const NOTES = SCENES.map((s) => `${s.summary}. ${s.note}`);

function isOpen(mode: Mode, i: number, j: number) {
  if (mode === "full") return true;
  if (mode === "pad") return j < PAD_FROM;
  return j <= i;
}

const CELL = 34;
const GAP = 4;
const LEFT = 70;
const TOP = 46;

function Grid({ mode }: { mode: Mode }) {
  const span = N * CELL + (N - 1) * GAP;
  const focusOpen = Array.from({ length: N }, (_, j) => j).filter((j) => isOpen(mode, FOCUS, j));
  return (
    <svg
      viewBox={`0 0 ${LEFT + span + 16} ${TOP + span + 40}`}
      role="img"
      aria-label={`행은 query, 열은 key. query ${FOCUS}가 읽는 key: ${focusOpen.join(", ")}`}
      className="mx-auto block h-auto w-full max-w-[360px]"
    >
      <text x={LEFT + span / 2} y={12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">
        key 위치 j (읽히는 쪽)
      </text>
      {Array.from({ length: N }, (_, j) => {
        const x = LEFT + j * (CELL + GAP) + CELL / 2;
        const pad = mode === "pad" && j >= PAD_FROM;
        return (
          <text key={`c${j}`} x={x} y={TOP - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill={pad ? "#b45309" : "#475569"}>
            {pad ? `${j} PAD` : j}
          </text>
        );
      })}
      <text
        x={14}
        y={TOP + span / 2}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#64748b"
        transform={`rotate(-90 14 ${TOP + span / 2})`}
      >
        query 위치 i
      </text>
      {Array.from({ length: N }, (_, i) => {
        const y = TOP + i * (CELL + GAP);
        const padRow = mode === "pad" && i >= PAD_FROM;
        const focus = i === FOCUS;
        return (
          <g key={`r${i}`} opacity={padRow ? 0.35 : 1}>
            <text x={LEFT - 10} y={y + CELL / 2 + 4} textAnchor="end" fontSize="11" fontWeight={focus ? "800" : "600"} fill={focus ? "#2563eb" : "#475569"}>
              {padRow ? `${i} PAD` : i}
            </text>
            {Array.from({ length: N }, (_, j) => {
              const x = LEFT + j * (CELL + GAP);
              const open = isOpen(mode, i, j);
              return (
                <g key={`${i}-${j}`}>
                  <rect
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={5}
                    fill={open ? (focus ? "#2563eb" : "#93c5fd") : "#f1f5f9"}
                    fillOpacity={open ? (focus ? 0.9 : 0.55) : 1}
                    stroke={open ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={1}
                    strokeDasharray={open ? undefined : "3 3"}
                  />
                  <text
                    x={x + CELL / 2}
                    y={y + CELL / 2 + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill={open ? (focus ? "#ffffff" : "#1e3a8a") : "#94a3b8"}
                  >
                    {open ? "○" : "×"}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <rect
        x={LEFT - 3}
        y={TOP + FOCUS * (CELL + GAP) - 3}
        width={span + 6}
        height={CELL + 6}
        rx={7}
        fill="none"
        stroke="#2563eb"
        strokeWidth={1.25}
      />
      <text x={LEFT + span / 2} y={TOP + span + 26} textAnchor="middle" fontSize="10" fill="#64748b">
        ○ 열림 · × 닫힘 · 진한 행 = query 2
      </text>
    </svg>
  );
}

export function BertMaskGridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  return (
    <VizFrame
      eyebrow="Visibility mask"
      title="Query 2가 읽는 key 칸: 사각형과 삼각형"
      description="행 i는 새 state를 만들 query 위치, 열 j는 그 query가 읽을 수 있는 key 위치입니다. 아래 식의 length 5 예를 칸으로 옮겼습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="BERT visibility mask 장면 탐색기"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((s) => (
            <div key={s.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{s.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{s.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0">
          <Grid mode={SCENES[scenes.active].mode} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((s) => (
            <p key={s.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {s.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
