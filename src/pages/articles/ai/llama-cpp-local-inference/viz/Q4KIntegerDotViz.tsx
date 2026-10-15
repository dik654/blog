import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: Weights.tsx #integer-dot — Q4_K 가중치 × q8_1 활성값의 내적을 정수 합 두 개로 끝낸다.
 * 예시 값은 본문 그대로: q = [3, 0, 15, 7], d = 0.5, sc = 2, dmin = 0.25, m = 1, u = [1, −2, 3, 4], d8 = 0.1.
 * 실수 곱셈 수는 이 그림의 계산 순서로 센 값이다.
 */
const Q = [3, 0, 15, 7];
const U = [1, -2, 3, 4];
const W = Q.map((q) => q - 0.25); // d·sc·q − dmin·m = q − 0.25
const A = U.map((u) => Math.round(u * 0.1 * 10) / 10);
const INT_PROD = Q.map((q, i) => q * U[i]);

type Mode = "real" | "int" | "sumu" | "scale" | "final" | "block32";

interface Scene {
  label: string;
  mode: Mode;
  result: string;
  realMuls: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "실수로 되돌려 곱하기", mode: "real", result: "0.275 + 0.05 + 4.425 + 2.7 = 7.45", realMuls: "값 4개 × 3번 + 2 = 14", note: "가중치를 q − 0.25로, 활성값을 u × 0.1로 되돌린 뒤 곱해 더합니다. 값마다 실수 곱셈이 세 번(가중치 복원·활성값 복원·곱) 듭니다." },
  { label: "정수끼리 곱하기", mode: "int", result: "3 + 0 + 45 + 28 = 76", realMuls: "0 (정수 곱 4개)", note: "배율을 붙이기 전의 정수 q와 u를 바로 곱해 더합니다. 네 쌍의 정수 곱과 합은 dp4a 명령 한 번이 맡습니다." },
  { label: "활성값만 더하기", mode: "sumu", result: "1 − 2 + 3 + 4 = 6", realMuls: "0", note: "빼는 값 dmin·m에 곱할 몫은 활성값의 정수 합 하나면 됩니다." },
  { label: "배율은 합 밖에서", mode: "scale", result: "0.5·2·76 − 0.25·1·6 = 74.5", realMuls: "블록당 4", note: "가중치 배율 d·sc와 빼는 값 dmin·m은 블록마다 하나라서 합 밖으로 꺼냅니다. 실수 곱셈은 네 번입니다." },
  { label: "활성값 배율 한 번", mode: "final", result: "74.5 × 0.1 = 7.45", realMuls: "블록당 5", note: "마지막으로 d8을 한 번 곱하면 첫 장면과 같은 7.45가 나옵니다. 같은 값을 계산 순서만 바꿔 얻었습니다." },
  { label: "실제 블록 32개", mode: "block32", result: "같은 식 · 블록마다 반복", realMuls: "실수 경로 98 vs 정수 경로 5", note: "실제 블록은 값 32개입니다. 실수 경로는 값마다 세 번이라 32 × 3 + 2 = 98번이지만 정수 경로는 블록 크기와 무관하게 다섯 번입니다." },
];

function Row({ label, values, tone, highlight, delayBase, reduced }: { label: string; values: (number | string)[]; tone: string; highlight: boolean; delayBase: number; reduced: boolean }) {
  return (
    <div className="grid grid-cols-[4.2rem_repeat(4,minmax(0,1fr))] items-center gap-1">
      <span className="text-[11px] font-bold text-muted-foreground">{label}</span>
      {values.map((v, i) => (
        <motion.span
          key={`${label}-${i}-${v}`}
          className="flex h-8 items-center justify-center rounded-sm border font-mono text-xs font-bold"
          style={{ borderColor: tone, color: highlight ? "#ffffff" : tone, backgroundColor: highlight ? tone : "transparent" }}
          initial={{ opacity: reduced ? 1 : 0.15 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : delayBase + i * 0.25 }}
        >
          {v}
        </motion.span>
      ))}
    </div>
  );
}

export default function Q4KIntegerDotViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const m = scene.mode;

  return (
    <VizFrame
      eyebrow="Integer dot product"
      title="정수 곱을 먼저 더하고 배율은 블록마다 한 번 곱합니다"
      description="위 두 줄은 저장된 정수(4비트 q, int8 u), 아래 줄은 이번 장면이 만든 값입니다. 오른쪽 숫자는 이 계산 순서에서 실수 곱셈을 몇 번 했는지 셉니다."
      note="본문 예시의 값 4개짜리 축소 블록입니다. 활성값을 int8로 바꿀 때의 반올림 오차는 0으로 두었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Q4_K와 int8 활성값 내적을 정수 경로로 계산하는 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="min-h-[15rem] min-w-0 space-y-1 sm:min-h-0">
              <Row label="q (4비트)" values={Q} tone="#7c3aed" highlight={m === "int" || m === "block32"} delayBase={0} reduced={reduced} />
              <Row label="u (int8)" values={U} tone="#0891b2" highlight={m === "int" || m === "sumu" || m === "block32"} delayBase={0} reduced={reduced} />
              {m === "real" ? (
                <>
                  <Row label="w 실수" values={W} tone="#7c3aed" highlight={false} delayBase={0.3} reduced={reduced} />
                  <Row label="a 실수" values={A} tone="#0891b2" highlight={false} delayBase={0.6} reduced={reduced} />
                  <Row label="w × a" values={W.map((w, i) => Math.round(w * A[i] * 1000) / 1000)} tone="#2563eb" highlight delayBase={1.2} reduced={reduced} />
                </>
              ) : m === "int" ? (
                <Row label="q × u" values={INT_PROD} tone="#2563eb" highlight delayBase={0.4} reduced={reduced} />
              ) : m === "sumu" ? (
                <Row label="u 합" values={U.map((u, i) => (i === 0 ? u : `+${u}`).toString().replace("+-", "−"))} tone="#0891b2" highlight delayBase={0.4} reduced={reduced} />
              ) : m === "block32" ? (
                <div className="grid grid-cols-[4.2rem_minmax(0,1fr)] items-center gap-1">
                  <span className="text-[11px] font-bold text-muted-foreground">32값 블록</span>
                  <div className="grid gap-[2px]" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
                    {Array.from({ length: 32 }, (_, i) => (
                      <motion.span key={i} className="h-3 rounded-[2px]" style={{ backgroundColor: i < 4 ? "#2563eb" : "#93c5fd" }} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : i * 0.03 }} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[4.2rem_minmax(0,1fr)] items-center gap-1">
                  <span className="text-[11px] font-bold text-muted-foreground">배율</span>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    {[
                      ["d", "0.5"],
                      ["sc", "2"],
                      ["dmin", "0.25"],
                      ["m", "1"],
                      ["d8", "0.1"],
                    ].map(([k, v]) => (
                      <span key={k} className={`rounded-sm border px-2 py-1 ${m === "final" && k === "d8" ? "border-[#2563eb] bg-[#2563eb] text-white" : m === "scale" && k !== "d8" ? "border-[#2563eb] bg-[#2563eb]/15" : "border-border"}`}>
                        {k} {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-2 border-y border-border py-2 font-mono text-sm font-bold text-[#2563eb]">{scene.result}</p>
            </div>
            <dl className="min-w-0 space-y-2 font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">실수 곱셈</dt>
                <dd className="text-base font-bold text-foreground">{scene.realMuls}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">정수 경로 합</dt>
                <dd className="font-bold text-foreground">Σqu = 76 · Σu = 6</dd>
              </div>
            </dl>
          </div>
          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
