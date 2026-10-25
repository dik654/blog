import type React from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 질문 하나가 encoder에 들어가는 한 줄의 시퀀스가 되는 과정을 칸으로 보여 준다.
 * 한 mechanism: [CLS] 질문 [SEP] [MASK] 선택지0 [MASK] 선택지1 … [SEP] 상태 [SEP]이고,
 * 상태가 쓸 자리 = max_len − 질문 부분 − 1, 점수는 [MASK] 자리에서만 읽어 그 질문의 선택지끼리 softmax한다.
 */
const SCENES = ["질문 세 개, 시퀀스 세 줄", "한 줄의 칸 배치", "[MASK] 자리의 점수", "선택지 77개면"] as const;

interface Cell {
  label: string;
  width: number;
  tone: "special" | "question" | "mask" | "option" | "state";
}

const TONE: Record<Cell["tone"], { border: string; bg: string }> = {
  special: { border: "#a1a1aa", bg: "#f4f4f51a" },
  question: { border: "#2563eb", bg: "#2563eb1a" },
  mask: { border: "#d97706", bg: "#d9770633" },
  option: { border: "#d97706", bg: "#d977060f" },
  state: { border: "#0d9488", bg: "#0d94881a" },
};

const ROW: Cell[] = [
  { label: "CLS", width: 4, tone: "special" },
  { label: "choice question: 어느 부서?", width: 22, tone: "question" },
  { label: "SEP", width: 4, tone: "special" },
  { label: "M", width: 3, tone: "mask" },
  { label: "billing", width: 9, tone: "option" },
  { label: "M", width: 3, tone: "mask" },
  { label: "technical", width: 9, tone: "option" },
  { label: "M", width: 3, tone: "mask" },
  { label: "other", width: 7, tone: "option" },
  { label: "SEP", width: 4, tone: "special" },
  { label: "상태: 두 번 청구됐어요…", width: 28, tone: "state" },
  { label: "SEP", width: 4, tone: "special" },
];

const NOTES = [
  "department·urgency·churn_risk 세 질문은 같은 상태 글을 붙인 세 줄이 되어 한 번의 forward에 함께 들어갑니다. 상태는 한 번만 token으로 바꾸고 줄마다 다시 씁니다.",
  "English checkpoint는 한 줄이 512 token입니다. 상태가 쓸 자리는 512 − 실제 head 길이 − 끝 [SEP] 1칸입니다. head_max_len 192는 실제 길이가 아니라 option prompt의 목표 상한입니다.",
  "선택지 앞의 [MASK] 세 자리에서만 점수를 하나씩 읽습니다. 3.1·0.4·−0.6을 이 질문 안에서 softmax하면 billing 0.916이 됩니다. (점수는 설명용 가정)",
  "English에서 선택지가 77개면 하나에 max(4, 176 ÷ 77) = 4 token을 줍니다. 4-token 하한 때문에 실제 head가 319 token까지 커지고 상태에는 192 token만 남습니다.",
] as const;

const SCORES = [
  { name: "billing", logit: 3.1, p: 0.916 },
  { name: "technical", logit: 0.4, p: 0.062 },
  { name: "other", logit: -0.6, p: 0.023 },
] as const;

function CellRow({ cells, dim }: { cells: Cell[]; dim?: boolean }) {
  const total = cells.reduce((s, c) => s + c.width, 0);
  return (
    <div className={`flex w-full flex-wrap gap-px transition-opacity duration-300 sm:flex-nowrap ${dim ? "opacity-40" : ""}`}>
      {cells.map((c, i) => (
        <div
          key={i}
          className="flex h-8 min-w-0 items-center justify-center overflow-hidden rounded-sm border px-1.5 text-center font-mono text-[10px] leading-3 sm:h-9 sm:w-[var(--cell-w)] sm:px-0.5"
          style={{ "--cell-w": `${(c.width / total) * 100}%`, borderColor: TONE[c.tone].border, backgroundColor: TONE[c.tone].bg } as React.CSSProperties}
        >
          <span className="whitespace-nowrap sm:truncate">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function LayaSystem1DecisionModelViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000, { loop: false });
  const scene = scenes.active;

  return (
    <VizFrame
      eyebrow="Option-marker sequence"
      title="질문마다 한 줄을 만들고 선택지 앞 [MASK] 자리에서 점수를 읽습니다"
      description="칸 하나가 token 묶음입니다. 파랑은 질문, 주황은 선택지와 그 앞의 [MASK](M), 초록은 상태 글입니다."
      note="칸 너비는 비율을 보이기 위한 대략값입니다. 실제 token 수는 tokenizer가 정합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Laya가 질문 하나를 encoder 입력 한 줄로 만드는 방식"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 min-h-[18rem] space-y-2 sm:min-h-[13rem]">
            {scene === 0 &&
              ["department · choice 3", "urgency · score 3", "churn_risk · noul 2"].map((q, i) => (
                <div key={q} className="space-y-1">
                  <p className="font-mono text-[11px] text-muted-foreground">{q}</p>
                  <CellRow
                    cells={[
                      ROW[0],
                      { ...ROW[1], label: q.split(" · ")[0] },
                      ROW[2],
                      ...Array.from({ length: i === 2 ? 2 : 3 }, (_, k) => [
                        { label: "M", width: 3, tone: "mask" as const },
                        { label: "opt" + k, width: 7, tone: "option" as const },
                      ]).flat(),
                      ROW[9],
                      ROW[10],
                      ROW[11],
                    ]}
                  />
                </div>
              ))}
            {scene === 1 && (
              <div className="space-y-3">
                <CellRow cells={ROW} />
                <div className="grid grid-cols-[3fr_5fr] gap-1 font-mono text-[11px]">
                  <div className="rounded-sm border border-dashed px-2 py-1 text-center" style={{ borderColor: "#2563eb" }}>
                    질문 부분 = 실제 head_len
                  </div>
                  <div className="rounded-sm border border-dashed px-2 py-1 text-center" style={{ borderColor: "#0d9488" }}>
                    상태 = 512 − head_len − 1
                  </div>
                </div>
                <p className="text-center font-mono text-xs text-muted-foreground">합계 512 token</p>
              </div>
            )}
            {scene === 2 && (
              <div className="space-y-3">
                <CellRow cells={ROW} />
                <div className="grid grid-cols-3 gap-2">
                  {SCORES.map((s) => (
                    <div key={s.name} className="rounded-sm border px-2 py-2 text-center" style={{ borderColor: "#d97706" }}>
                      <p className="font-mono text-[11px] text-muted-foreground">{s.name}</p>
                      <p className="font-mono text-xs">점수 {s.logit}</p>
                      <div className="mx-auto mt-1 h-2 w-full rounded-sm bg-muted/60">
                        <div className="h-full rounded-sm" style={{ width: `${s.p * 100}%`, backgroundColor: "#d97706" }} />
                      </div>
                      <p className="mt-1 font-mono text-xs font-bold">{s.p.toFixed(3)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {scene === 3 && (
              <div className="space-y-3">
                <div className="grid w-full grid-cols-[repeat(77,minmax(0,1fr))]">
                  {Array.from({ length: 77 }, (_, i) => (
                    <div
                      key={i}
                      className="h-6 border-r border-background"
                      style={{ backgroundColor: i % 2 ? "#d9770666" : "#d97706" }}
                    />
                  ))}
                </div>
                <dl className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>
                    <dt className="text-muted-foreground">선택지 수</dt>
                    <dd className="font-bold">77</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">선택지당 token</dt>
                    <dd className="font-bold">4 (이름 3)</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">선택지 전체</dt>
                    <dd className="font-bold">실제 head 319</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
