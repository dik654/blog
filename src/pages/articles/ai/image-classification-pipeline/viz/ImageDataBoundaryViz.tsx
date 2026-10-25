import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

function TraceScene({
  labels,
  notes,
  children,
}: {
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 4800, {
    loop: false,
    autoPlay: false,
  });

  return (
    <VizFrame
      eyebrow="한 객체 추적"
      title="product-17은 파일 네 개가 되어도 평가 단위 하나입니다"
      description="재생하면 잘못된 파일 분리에서 identity 단위 분리와 재현 기록까지 한 단계씩 바뀝니다."
      className="my-8"
    >
      <div
        id={controls.playbackId}
        data-viz-id="image-identity-viz"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only>
          <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
            한 객체 추적 · {String(controls.active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-lg font-bold leading-7">
            {labels[controls.active]}
          </h3>
          <div className="mt-5 min-w-0 overflow-hidden">
            {children(controls.active)}
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
            {notes[controls.active]}
          </p>
        </div>
        <AnimatedSceneControls labels={[...labels]} {...controls} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {labels.map((label, index) => (
            <li key={label}>
              <strong>
                {index + 1}. {label}
              </strong>
              <span className="mt-1 block text-muted-foreground">
                {notes[index]}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

export function ImageIdentityViz() {
  const labels = [
    "상품 하나에서 파일 네 개가 생김",
    "네 파일에 같은 identity를 기록",
    "파일을 따로 나누면 leakage 발생",
    "Identity 전체를 한 split으로 이동",
    "Split과 입력 조건을 receipt로 고정",
  ] as const;
  const notes = [
    "original.jpg와 세 crop은 파일은 넷이지만 배포에서 새로 만날 상품은 product-17 하나입니다.",
    "source_id를 먼저 기록해야 resize·crop 뒤에도 네 파일이 같은 평가 단위라는 사실이 남습니다.",
    "crop-c만 validation으로 보내면 train과 validation 양쪽에 product-17이 남아 모델의 암기를 새 대상 일반화로 오해합니다.",
    "product-17의 파생 파일은 모두 train으로 이동하고 validation에는 다른 identity인 product-42만 둡니다.",
    "group rule·split digest·class map·transform·seed를 gen-04에 묶어 다음 실험이 같은 데이터 경계에서 출발하게 합니다.",
  ] as const;
  const files = ["original.jpg", "crop-a.jpg", "crop-b.jpg", "crop-c.jpg"];

  return (
    <TraceScene labels={labels} notes={notes}>
      {(active) => {
        const wrongSplit = active === 2;
        const fixedSplit = active >= 3;
        return (
          <div
            role="img"
            aria-label={labels[active]}
            className="grid min-h-[26rem] gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center"
          >
            <div className="min-w-0">
              <motion.div
                initial={false}
                animate={{ opacity: active === 0 ? 1 : 0.72 }}
                className="border-l-2 border-primary pl-4"
              >
                <p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">
                  실제 대상
                </p>
                <p className="mt-1 text-xl font-black">product-17</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  같은 상품을 찍고 잘라 만든 네 파일
                </p>
              </motion.div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {files.map((file, index) => {
                  const validationFile = wrongSplit && index === 3;
                  return (
                    <motion.div
                      key={file}
                      initial={false}
                      animate={{
                        opacity: active <= 1 ? 1 : 0.86,
                        y: validationFile ? 8 : 0,
                      }}
                      className={`min-w-0 border p-2 ${
                        validationFile
                          ? "border-destructive"
                          : active === 1
                            ? "border-primary"
                            : "border-border"
                      }`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <div
                          className="absolute border-2 border-foreground/70"
                          style={{
                            inset:
                              index === 0
                                ? "20%"
                                : index === 1
                                  ? "12% 30% 36% 14%"
                                  : index === 2
                                    ? "31% 12% 13% 34%"
                                    : "16% 17% 22% 25%",
                          }}
                        />
                        <span className="absolute bottom-1 right-1 font-mono text-[9px] font-bold">
                          {index === 0 ? "원본" : `crop ${index}`}
                        </span>
                      </div>
                      <p className="mt-2 truncate font-mono text-[10px] font-bold">
                        {file}
                      </p>
                      <p
                        className={`mt-1 text-[10px] ${
                          active >= 1 ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        source_id=product-17
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 space-y-3">
              <motion.div
                initial={false}
                animate={{ opacity: active >= 1 ? 1 : 0.28 }}
                className="grid grid-cols-[6rem_minmax(0,1fr)] items-center border-y border-border py-3 text-xs"
              >
                <strong>Identity</strong>
                <span className="font-mono text-primary">product-17 × 4</span>
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: active >= 2 ? 1 : 0.28 }}
                className="grid gap-2 sm:grid-cols-2"
              >
                <SplitCell label="Train">
                  {wrongSplit ? "product-17 × 3" : fixedSplit ? "product-17 × 4" : "대기"}
                </SplitCell>
                <SplitCell label="Validation" failed={wrongSplit}>
                  {wrongSplit ? "product-17 × 1" : fixedSplit ? "product-42 × 2" : "대기"}
                </SplitCell>
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: active >= 2 ? 1 : 0.28 }}
                className={`border-l-2 pl-3 text-sm font-bold leading-6 ${
                  wrongSplit
                    ? "border-destructive text-destructive"
                    : fixedSplit
                      ? "border-primary text-foreground"
                      : "border-border text-muted-foreground"
                }`}
              >
                {wrongSplit
                  ? "교집합 = {product-17} · 평가 중단"
                  : fixedSplit
                    ? "교집합 = ∅ · 새 identity 평가 가능"
                    : "Split 전에는 누수를 판정할 수 없습니다."}
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: active >= 4 ? 1 : 0.25 }}
                className="border-y border-border py-3"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <strong className="text-sm">baseline receipt</strong>
                  <span className="font-mono text-xs text-primary">gen-04</span>
                </div>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                  group rule · split digest · class map · transform · seed
                </p>
              </motion.div>
            </div>
          </div>
        );
      }}
    </TraceScene>
  );
}

function SplitCell({
  label,
  failed = false,
  children,
}: {
  label: string;
  failed?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`border p-3 ${failed ? "border-destructive" : "border-border"}`}>
      <p className="text-[10px] font-black uppercase tracking-[.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 break-keep text-sm font-bold">{children}</p>
    </div>
  );
}

export function BaselineReceiptViz() {
  const columns = [
    ["Data", "split=9f2a · identity=v2", "같은 group 경계와 제외 목록"],
    ["Input", "resize=256 · crop=224", "decode·색 순서·정규화"],
    ["Model", "backbone=r18 · seed=41", "구조·초기 weight·head"],
    ["Evaluation", "macro recall · p95", "분모·slice·장비·동시성"],
  ] as const;

  return (
    <VizFrame
      eyebrow="비교의 공통 입력"
      title="Baseline과 후보는 같은 receipt 위에서만 비교합니다"
      description="모델 weight 하나가 아니라 데이터·입력·모델·평가 조건의 묶음이 실험 한 세대를 식별합니다."
      className="my-8"
    >
      <div className="grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
        {columns.map(([label, value, detail], index) => (
          <div key={label} className="min-w-0 bg-background p-4">
            <span className="font-mono text-[9px] font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="mt-1 block text-sm">{label}</strong>
            <code className="mt-3 block break-words text-[11px] leading-5 text-foreground">
              {value}
            </code>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <p className="border-l-2 border-border pl-3">
          기준 모델 · recall .81 · p95 18 ms
        </p>
        <span className="text-center font-bold text-primary">같은 receipt</span>
        <p className="border-l-2 border-primary pl-3 sm:text-right">
          후보 모델 · recall .83 · p95 21 ms
        </p>
      </div>
    </VizFrame>
  );
}
