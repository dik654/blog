import { useState } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 실행이 모델을 통과하는 의사코드를 한 줄씩 실행한다.
 * prefill과 decode는 같은 코드를 쓰고, 줄마다 다루는 행렬의 행 수(새 위치 수)만 4와 1로 다르다.
 */
const CODE = [
  "x = embed(새 토큰들)",
  "for l in 1..32:",
  "    q, k, v = proj[l](x)",
  "    cache[l].append(k, v)",
  "    a = attend(q, cache[l])",
  "    x = x + out[l](a)",
  "    x = x + ffn[l](x)",
  "next = sample(head(x[마지막]))",
] as const;

type Mode = "prefill" | "decode";

interface Step {
  line: number;
  label: string;
  layer: string;
  value: Record<Mode, string>;
  note: Record<Mode, string>;
}

const STEPS: readonly Step[] = [
  {
    line: 0,
    label: "입력 벡터",
    layer: "—",
    value: { prefill: "x: 4 × d  (A B C D)", decode: "x: 1 × d  (E)" },
    note: {
      prefill: "프롬프트 네 위치를 한 행씩 벡터로 바꿉니다. 행이 네 개인 행렬이 됩니다.",
      decode: "앞에서 고른 E 하나만 벡터로 바꿉니다. A~D의 벡터는 다시 만들지 않습니다.",
    },
  },
  {
    line: 2,
    label: "층 1 · Q K V",
    layer: "1",
    value: { prefill: "q, k, v: 각 4 × d", decode: "q, k, v: 각 1 × d" },
    note: {
      prefill: "같은 가중치 proj[1]에 네 행을 함께 곱합니다.",
      decode: "같은 가중치 proj[1]에 한 행만 곱합니다. 가중치는 prefill과 똑같이 전부 읽습니다.",
    },
  },
  {
    line: 3,
    label: "층 1 · cache 저장",
    layer: "1",
    value: { prefill: "cache[1]: 0 → 4", decode: "cache[1]: 4 → 5" },
    note: {
      prefill: "A~D의 k, v를 층 1의 cache에 남깁니다. 이후 decode가 이것을 읽습니다.",
      decode: "E의 k, v를 층 1의 cache 끝에 덧붙입니다. q는 이번 계산에만 쓰고 남기지 않습니다.",
    },
  },
  {
    line: 4,
    label: "층 1 · attention",
    layer: "1",
    value: { prefill: "점수 4 × 4 중 10칸", decode: "점수 1 × 5 = 5칸" },
    note: {
      prefill: "각 위치는 자기와 앞 위치만 봅니다. 미래를 가리는 mask 때문에 16칸 중 아래 삼각형 10칸만 씁니다.",
      decode: "E의 q 하나가 cache의 k 다섯 개와 점수를 내고 v 다섯 개를 섞습니다. 과거 위치는 읽기만 합니다.",
    },
  },
  {
    line: 5,
    label: "층 1 · 출력 투영",
    layer: "1",
    value: { prefill: "x: 4 × d", decode: "x: 1 × d" },
    note: {
      prefill: "섞은 결과를 다시 d 차원으로 돌려 x에 더합니다.",
      decode: "E 한 행에만 더합니다. 행 수는 계속 1입니다.",
    },
  },
  {
    line: 6,
    label: "층 1 · FFN",
    layer: "1",
    value: { prefill: "FFN: 4행", decode: "FFN: 1행" },
    note: {
      prefill: "FFN은 위치마다 따로 적용합니다. 네 행이 같은 가중치를 지납니다.",
      decode: "E 한 행만 FFN을 지납니다. cache가 있어도 FFN을 건너뛰지는 않습니다.",
    },
  },
  {
    line: 1,
    label: "층 2 … 32 반복",
    layer: "2 → 32",
    value: { prefill: "31층 × 같은 다섯 줄", decode: "31층 × 같은 다섯 줄" },
    note: {
      prefill: "층 2는 층 1이 바꾼 x를 받아 자기 cache[2]에 네 위치를 남깁니다. 층 32까지 같습니다.",
      decode: "층 2는 cache[2]에 있는 A~D를 읽습니다. 층마다 cache가 따로라서 32층을 모두 지나야 32개 cache가 다 5칸이 됩니다.",
    },
  },
  {
    line: 7,
    label: "다음 토큰",
    layer: "—",
    value: { prefill: "D 행 → E", decode: "E 행 → F" },
    note: {
      prefill: "다음 토큰 확률은 마지막 층을 지난 마지막 위치 D의 벡터에서 나옵니다. 그래서 첫 출력 E는 32층을 다 지난 뒤에야 나옵니다.",
      decode: "F의 확률도 32층을 다 지난 E의 벡터에서 나옵니다. 층을 줄이면 이 벡터가 만들어지지 않습니다.",
    },
  },
];

function ScoreGrid({ mode }: { mode: Mode }) {
  const rows = mode === "prefill" ? ["A", "B", "C", "D"] : ["E"];
  const cols = mode === "prefill" ? ["A", "B", "C", "D"] : ["A", "B", "C", "D", "E"];
  return (
    <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `1.25rem repeat(${cols.length}, 1.5rem)` }} aria-label="attention 점수 칸">
      <span />
      {cols.map((c) => (
        <span key={c} className="text-center text-[10px] text-muted-foreground">
          {c}
        </span>
      ))}
      {rows.map((r) => (
        <div key={r} className="contents">
          <span className="text-[10px] leading-6 text-muted-foreground">{r}</span>
          {cols.map((c) => {
            const used = mode === "decode" || cols.indexOf(c) <= rows.indexOf(r);
            return <span key={c} className={`h-6 rounded-sm border ${used ? "border-[#2563eb] bg-[#2563eb]/70" : "border-dashed border-border"}`} />;
          })}
        </div>
      ))}
    </div>
  );
}

export default function LayerLoopProcessViz() {
  const [mode, setMode] = useState<Mode>("decode");
  const scenes = useAnimatedScenes(STEPS.length, 3600);
  const step = STEPS[scenes.active];
  const doneLines = new Set(STEPS.slice(0, scenes.active).map((s) => s.line));

  return (
    <VizFrame
      eyebrow="Same code, different width"
      title="prefill과 decode는 같은 코드를 실행하고 행 수만 다릅니다"
      description="왼쪽 의사코드가 한 실행입니다. 위의 단추로 prefill(A B C D)과 decode(E)를 바꿔 같은 줄이 다루는 크기를 비교합니다."
      note="d는 위치 하나를 나타내는 벡터 길이입니다. 정규화·위치 회전 같은 세부 단계는 생략한 의사코드입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="prefill과 decode의 층 반복 의사코드 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="실행 종류">
            {(["prefill", "decode"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`min-h-9 rounded-md border px-3 text-xs font-bold ${mode === m ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground"}`}
              >
                {m === "prefill" ? "Prefill · A B C D" : "Decode · E"}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <ol className="min-w-0 overflow-x-auto rounded-md border border-border bg-muted/30 py-2 font-mono text-[11px] leading-6 sm:text-xs">
              {CODE.map((line, i) => (
                <li
                  key={i}
                  className={`whitespace-pre px-3 ${i === step.line ? "bg-primary/15 font-bold text-foreground" : doneLines.has(i) ? "text-muted-foreground" : "text-foreground/80"}`}
                >
                  <span className="mr-2 inline-block w-3 text-right text-muted-foreground">{i + 1}</span>
                  {line}
                </li>
              ))}
            </ol>

            <div className="min-w-0 space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold">{step.label}</span>
                <span className="font-mono text-xs text-muted-foreground">l = {step.layer}</span>
              </div>
              <p className="border-y border-border py-2 font-mono text-base font-bold text-[#2563eb]">{step.value[mode]}</p>
              <div className="min-h-[7.5rem]">{step.line === 4 ? <ScoreGrid mode={mode} /> : <RowStack mode={mode} />}</div>
            </div>
          </div>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {step.note[mode]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={STEPS.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}

/** 이번 줄이 다루는 x의 행. prefill은 네 행, decode는 한 행이다. */
function RowStack({ mode }: { mode: Mode }) {
  const rows = mode === "prefill" ? ["A", "B", "C", "D"] : ["E"];
  return (
    <div className="space-y-1" aria-label={`x의 행 ${rows.length}개`}>
      {["A", "B", "C", "D"].map((slot, i) => {
        const label = rows[i];
        return (
          <div key={slot} className="flex items-center gap-2">
            <span className="w-4 text-[10px] text-muted-foreground">{label ?? ""}</span>
            <span className={`h-5 flex-1 rounded-sm border ${label ? "border-[#2563eb] bg-[#2563eb]/70" : "border-dashed border-border"}`} />
          </div>
        );
      })}
    </div>
  );
}
