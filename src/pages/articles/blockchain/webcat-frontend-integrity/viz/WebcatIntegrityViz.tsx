import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const stages = [
  { title: "개발자 빌드", note: "배포할 JS·Wasm·CSS의 bytes를 확정", shape: "rounded-md" },
  { title: "서명 manifest", note: "경로별 hash와 CSP를 개발자 key로 서명", shape: "rounded-full" },
  { title: "투명성 log", note: "Manifest가 공개 이력에 포함됐는지 확인", shape: "rounded-md" },
  { title: "서버 응답", note: "HTTPS로 실제 resource bytes를 전달", shape: "rounded-md" },
  { title: "브라우저 검증", note: "실행 전에 hash·signature·log를 대조", shape: "rounded-full" },
] as const;

export default function WebcatIntegrityViz() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(!reduce);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((value) => (value + 1) % stages.length), 1500);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <figure data-viz="webcat-integrity-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-sm font-bold">HTTPS 다음의 질문: 받은 코드가 개발자가 서명한 코드인가?</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">재생하면 manifest가 만들어지고, 공개되고, 실제 응답과 대조되는 순서가 한 단계씩 강조됩니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid min-w-0 gap-2 md:grid-cols-5">
        {stages.map((stage, index) => (
          <div key={stage.title} className="relative min-w-0">
            <motion.div
              animate={{ opacity: index <= step ? 1 : 0.45, y: index === step ? -3 : 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              className={`${stage.shape} min-h-32 border p-4 ${index === step ? "border-primary bg-primary/10" : "border-border bg-background"}`}
            >
              <p className="text-xs font-bold text-primary">0{index + 1}</p>
              <p className="mt-2 text-sm font-semibold">{stage.title}</p>
              <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{stage.note}</p>
            </motion.div>
            {index < stages.length - 1 && <span aria-hidden className="absolute -right-2 top-14 hidden text-primary md:block">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setPlaying((value) => !value)} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold">{playing ? "일시정지" : "흐름 재생"}</button>
        {stages.map((stage, index) => <button type="button" key={stage.title} onClick={() => { setStep(index); setPlaying(false); }} aria-label={`${stage.title} 보기`} className={`h-8 w-8 rounded-full border text-xs ${index === step ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{index + 1}</button>)}
        <p className="text-xs text-muted-foreground">Mismatch면 실행 전 차단 · match면 render</p>
      </div>
    </figure>
  );
}
