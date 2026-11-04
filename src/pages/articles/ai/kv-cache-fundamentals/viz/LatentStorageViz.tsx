import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 8절의 첫 head 기록 K=(0,c), V=(c,2c), c=1·2·3·4. 칸 하나가 숫자 하나(2byte)다.
 * 한 mechanism: 네 위치의 숫자 16개를 c 4개와 공용 변환으로 나타내되, 규칙 밖의 기록은 나타낼 수 없다.
 */
const K = "#2563eb";
const V = "#16a34a";
const C = "#7c3aed";
const CS = [1, 2, 3, 4] as const;

const SCENES = [
  { label: "위치마다 숫자 4개", step: 0, value: "16개 = 32byte", note: "8절의 첫 head가 남긴 기록입니다. 네 위치에 K 2개와 V 2개씩 있어 숫자 16개입니다." },
  { label: "숫자 사이의 규칙", step: 1, value: "K=(0,c), V=(c,2c)", note: "강조한 칸을 위에서 아래로 읽으면 모두 1·2·3·4입니다. K의 첫 칸은 늘 0이고 V의 둘째 칸은 그 값의 2배입니다." },
  { label: "c=3 하나로 되살리기", step: 2, value: "(0,3), (3,6)", note: "c에 K 쪽 열벡터 (0,1)을 곱하면 K가, V 쪽 열벡터 (1,2)를 곱하면 V가 나옵니다. 세 번째 위치의 네 숫자가 그대로 나옵니다." },
  { label: "저장할 숫자 비교", step: 3, value: "32byte → 8byte", note: "위치마다 c 하나만 남기면 숫자 4개, 8byte입니다. 두 열벡터는 위치마다 저장하지 않고 모든 위치가 함께 씁니다." },
  { label: "규칙 밖의 기록", step: 4, value: "K=(1,0)은 불가", note: "K의 첫 칸은 c×0이라 c가 얼마여도 0입니다. 첫 칸이 1인 기록은 이 변환으로 만들 수 없습니다. (가정)" },
] as const;

function Cell({ value, color, on, strong, reduced }: { value: number; color: string; on: boolean; strong: boolean; reduced: boolean }) {
  return (
    <motion.span
      className="flex h-8 items-center justify-center rounded-sm border font-mono text-sm font-bold text-foreground"
      initial={false}
      animate={{ opacity: on ? 1 : 0.22, backgroundColor: strong ? `${color}55` : `${color}14` }}
      transition={{ duration: reduced ? 0 : 0.3 }}
      style={{ borderColor: color }}
    >
      {value}
    </motion.span>
  );
}

export default function LatentStorageViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const step = scene.step;
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="작은 공통 숫자"
      title="네 숫자가 한 숫자에서 나온다면 저장할 칸이 줄어듭니다"
      description="왼쪽 표는 네 위치의 K와 V입니다. 칸 하나가 숫자 하나이고 숫자마다 2byte입니다."
      note="규칙이 맞도록 일부러 정한 작은 사례입니다(가정). 위치 회전용 기록은 아직 넣지 않았으며 20절에서 따로 셉니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="K와 V 숫자 16개와 latent 숫자 4개의 대응"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.value}</span>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="grid grid-cols-[3rem_repeat(4,minmax(0,1fr))] gap-1 text-center text-xs font-bold">
                <span />
                <span className="col-span-2" style={{ color: K }}>K</span>
                <span className="col-span-2" style={{ color: V }}>V</span>
              </div>
              <div className="mt-1 grid gap-1">
                {CS.map((c) => {
                  const on = step !== 2 || c === 3;
                  const strong = step === 1;
                  return (
                    <div key={c} className="grid grid-cols-[3rem_repeat(4,minmax(0,1fr))] items-center gap-1">
                      <span className="text-xs text-muted-foreground">위치 {c}</span>
                      <Cell value={0} color={K} on={on} strong={false} reduced={reduced} />
                      <Cell value={c} color={K} on={on} strong={strong} reduced={reduced} />
                      <Cell value={c} color={V} on={on} strong={strong} reduced={reduced} />
                      <Cell value={2 * c} color={V} on={on} strong={false} reduced={reduced} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex min-h-[8.5rem] min-w-0 flex-col justify-center gap-2 border-l border-border pl-4 font-mono text-sm leading-7">
              {step === 0 ? (
                <p className="font-sans text-muted-foreground">4위치 × 숫자 4개 = 16개<br />16개 × 2byte = 32byte</p>
              ) : null}
              {step === 1 ? (
                <>
                  <p><strong style={{ color: K }}>K</strong> = (0, c)</p>
                  <p><strong style={{ color: V }}>V</strong> = (c, 2c)</p>
                  <p className="text-muted-foreground">c = 1·2·3·4</p>
                </>
              ) : null}
              {step === 2 ? (
                <>
                  <p><strong style={{ color: C }}>c</strong> = 3</p>
                  <p><strong style={{ color: K }}>K</strong> = 3 × (0, 1) = (0, 3)</p>
                  <p><strong style={{ color: V }}>V</strong> = 3 × (1, 2) = (3, 6)</p>
                </>
              ) : null}
              {step === 3 ? (
                <>
                  <p className="font-sans text-xs font-bold text-muted-foreground">위치마다 남기는 c</p>
                  <div className="grid grid-cols-4 gap-1">
                    {CS.map((c) => (
                      <Cell key={c} value={c} color={C} on strong reduced={reduced} />
                    ))}
                  </div>
                  <p>4개 × 2byte = 8byte</p>
                  <p className="font-sans text-xs text-muted-foreground">모든 위치가 함께 쓰는 변환: (0,1), (1,2)</p>
                </>
              ) : null}
              {step === 4 ? (
                <>
                  <p>c × (0, 1) = (<strong>0</strong>, c)</p>
                  <p>원하는 K = (<strong>1</strong>, 0)</p>
                  <p className="font-sans text-xs text-muted-foreground">첫 칸이 맞지 않아 어떤 c도 답이 아닙니다</p>
                </>
              ) : null}
            </div>
          </div>
          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
