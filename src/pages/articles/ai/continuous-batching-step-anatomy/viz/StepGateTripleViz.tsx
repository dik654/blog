import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 새 요청 C(입력 10)가 token 잔액·진행 요청 자리·KV 저장 공간이라는 세 관문을 차례로 지난다.
 * 한 mechanism: 세 조건은 서로 다른 양이라 하나만 남아도 C는 들어오지 못하고, 실패하면 잔액을 빼지 않는다.
 */
type Gate = "pass" | "fail" | "skip";

interface Scene {
  label: string;
  seatCap: number;
  kvOk: boolean;
  threshold?: number;
  gates: [Gate, Gate, Gate];
  cTokens: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "기본 · 세 관문 통과",
    seatCap: 4,
    kvOk: true,
    gates: ["pass", "pass", "pass"],
    cTokens: 6,
    note: "A·B가 token 2칸과 자리 2개를 씁니다. C는 남은 6칸을 받고 자리 하나와 저장 공간을 얻어 들어옵니다. 배정 합은 8입니다.",
  },
  {
    label: "자리 상한 2",
    seatCap: 2,
    kvOk: true,
    gates: ["pass", "fail", "skip"],
    cTokens: 0,
    note: "진행 요청 상한을 2로 낮추면 A·B가 두 자리를 모두 씁니다. token이 6칸 남아도 C는 자리 관문에서 멈추고 대기 목록에 남습니다.",
  },
  {
    label: "저장 공간 부족",
    seatCap: 4,
    kvOk: false,
    gates: ["pass", "pass", "fail"],
    cTokens: 0,
    note: "token과 자리는 통과했지만 allocate_slots가 저장 공간을 주지 못하면 break합니다. C를 받은 것처럼 6칸을 빼지 않으므로 잔액은 6 그대로입니다.",
  },
  {
    label: "조각 상한 4",
    seatCap: 4,
    kvOk: true,
    threshold: 4,
    gates: ["pass", "pass", "pass"],
    cTokens: 4,
    note: "long_prefill_token_threshold를 4로 두면 C는 min(10, 6, 4) = 4칸만 받습니다. 잔액 2칸은 다른 요청이 같은 관문을 통과해야 쓸 수 있습니다.",
  },
];

const LAMP: Record<Gate, string> = {
  pass: "border-[#16a34a] bg-[#dcfce7] text-[#166534] dark:bg-[#14532d]/50 dark:text-[#bbf7d0]",
  fail: "border-[#dc2626] bg-[#fee2e2] text-[#991b1b] dark:bg-[#7f1d1d]/50 dark:text-[#fecaca]",
  skip: "border-dashed border-border text-muted-foreground",
};
const LAMP_TEXT: Record<Gate, string> = { pass: "통과", fail: "거부", skip: "검사 안 함" };

function Row({ title, children, gate, delay, reduced }: { title: string; children: ReactNode; gate: Gate; delay: number; reduced: boolean }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 sm:grid-cols-[6rem_minmax(0,1fr)_4.5rem]">
      <span className="text-[11px] font-bold leading-4 text-foreground">{title}</span>
      <div className="min-w-0">{children}</div>
      <motion.span
        className={`flex h-8 items-center justify-center rounded-sm border text-[11px] font-bold ${LAMP[gate]}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : delay, duration: reduced ? 0 : 0.25 }}
      >
        {LAMP_TEXT[gate]}
      </motion.span>
    </div>
  );
}

export default function StepGateTripleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const admitted = scene.cTokens > 0;
  const tokenCells = Array.from({ length: 8 }, (_, i) => (i < 2 ? "AB" : i < 2 + scene.cTokens ? "C" : "free"));
  const seats = Array.from({ length: 4 }, (_, i) => (i >= scene.seatCap ? "closed" : i < 2 ? "AB" : i === 2 && admitted ? "C" : "free"));

  return (
    <VizFrame
      eyebrow="Three admission gates"
      title="token이 남아도 자리나 저장 공간이 없으면 C는 들어오지 못합니다"
      description="한 줄이 한 조건입니다. 첫 줄은 예산 8 token, 둘째 줄은 진행 요청 자리, 셋째 줄은 KV 저장 공간입니다. 오른쪽 램프가 그 관문의 판정입니다."
      note="예산 8, 자리 4(또는 2), A·B가 1 token씩 먼저 쓴다는 조건은 본문의 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="새 요청 C가 세 조건을 통과하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-xs text-muted-foreground">대기 C: 입력 10 · 계산 0</span>
          </div>

          <Row title="① token 8" gate={scene.gates[0]} delay={0.3} reduced={reduced}>
            <div className="grid grid-cols-8 gap-0.5">
              {tokenCells.map((c, i) => (
                <motion.span
                  key={i}
                  className={`flex h-8 items-center justify-center rounded-sm border text-[10px] font-bold ${
                    c === "AB" ? "border-[#2563eb] bg-[#2563eb] text-white" : c === "C" ? "border-[#f59e0b] bg-[#f59e0b] text-[#451a03]" : "border-dashed border-border text-muted-foreground"
                  }`}
                  initial={{ opacity: c === "C" ? 0 : 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 1.6 + i * 0.06 }}
                >
                  {c === "AB" ? (i === 0 ? "A" : "B") : c === "C" ? "C" : ""}
                </motion.span>
              ))}
            </div>
          </Row>

          <Row title="② 진행 자리" gate={scene.gates[1]} delay={0.8} reduced={reduced}>
            <div className="grid grid-cols-4 gap-0.5">
              {seats.map((c, i) => (
                <span
                  key={i}
                  className={`flex h-8 items-center justify-center rounded-sm border text-[10px] font-bold ${
                    c === "AB" ? "border-[#2563eb] bg-[#2563eb] text-white" : c === "C" ? "border-[#f59e0b] bg-[#f59e0b] text-[#451a03]" : c === "closed" ? "border-border bg-muted text-muted-foreground" : "border-dashed border-border"
                  }`}
                >
                  {c === "AB" ? (i === 0 ? "A" : "B") : c === "C" ? "C" : c === "closed" ? "상한 밖" : ""}
                </span>
              ))}
            </div>
          </Row>

          <Row title="③ KV 공간" gate={scene.gates[2]} delay={1.3} reduced={reduced}>
            <div className="grid grid-cols-6 gap-0.5">
              {Array.from({ length: 6 }, (_, i) => (
                <span
                  key={i}
                  className={`h-8 rounded-sm border ${
                    i < 2 ? "border-[#2563eb] bg-[#2563eb]/70" : scene.gates[2] === "skip" ? "border-dashed border-border" : scene.kvOk ? (admitted ? "border-[#f59e0b] bg-[#f59e0b]" : "border-dashed border-border") : "border-border bg-muted"
                  }`}
                />
              ))}
            </div>
          </Row>

          <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">C 배정</dt>
              <dd className="font-bold text-[#b45309]">{scene.cTokens} token</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">남은 잔액</dt>
              <dd className="font-bold">{6 - scene.cTokens}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">C 진행</dt>
              <dd className="font-bold">0 → {scene.cTokens} / 10</dd>
            </div>
          </dl>

          <p className="min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
