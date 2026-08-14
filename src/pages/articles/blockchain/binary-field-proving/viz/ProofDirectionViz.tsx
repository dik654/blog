import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const frames = [
  ["문제", "SHA·BLAKE의 XOR·AND·rotate를 큰 prime field circuit에 넣으면 비싸다"],
  ["길 A", "Workload를 Poseidon 같은 field-native primitive로 교체한다"],
  ["길 B", "Workload는 유지하고 binary-field·Boolean prover를 맞춘다"],
  ["선택", "보안 역사·호환성·proof 비용·구현 성숙도를 함께 비교한다"],
] as const;

export default function ProofDirectionViz() {
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setFrame((value) => (value + 1) % frames.length), 1700);
    return () => window.clearInterval(id);
  }, [playing]);
  return (
    <figure data-viz="proof-direction" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption><p className="text-sm font-bold">같은 SHA/BLAKE workload에서 무엇을 바꿀 것인가</p><p className="mt-1 text-sm text-muted-foreground">Primitive 교체와 proof layer 최적화는 서로 다른 설계 선택입니다.</p></figcaption>
      <div data-viz-canvas className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <motion.div animate={{ opacity: frame === 1 ? 1 : 0.55, scale: frame === 1 ? 1.02 : 1 }} className="rounded-xl border border-border bg-background p-5">
          <p className="text-xs font-bold text-primary">PRIMITIVE를 바꾼다</p><div className="mt-4 flex items-center gap-2"><span className="rounded-md border border-border px-3 py-2 text-sm">SHA / BLAKE</span><span>→</span><span className="rounded-full border border-primary px-3 py-2 text-sm font-semibold">Poseidon</span></div><p className="mt-4 text-sm leading-6 text-muted-foreground">Prime-field circuit에서 싼 덧셈·곱셈·power S-box로 workload를 다시 설계합니다.</p>
        </motion.div>
        <div className="grid place-items-center rounded-full border border-primary bg-primary/10 px-5 py-4 text-center"><p className="text-xs font-bold text-primary">고정 요구</p><p className="mt-1 text-sm font-semibold">Hash semantics</p></div>
        <motion.div animate={{ opacity: frame === 2 ? 1 : 0.55, scale: frame === 2 ? 1.02 : 1 }} className="rounded-xl border border-border bg-background p-5">
          <p className="text-xs font-bold text-primary">PROVER를 바꾼다</p><div className="mt-4 flex items-center gap-2"><span className="rounded-md border border-border px-3 py-2 text-sm">SHA / BLAKE</span><span>→</span><span className="rounded-full border border-primary px-3 py-2 text-sm font-semibold">Binary-field proof</span></div><p className="mt-4 text-sm leading-6 text-muted-foreground">XOR·bit logic에 가까운 표현을 써서 기존 primitive를 그대로 증명합니다.</p>
        </motion.div>
      </div>
      <motion.p key={frame} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-sm"><strong>{frames[frame][0]}:</strong> {frames[frame][1]}</motion.p>
      <div className="mt-3 flex gap-2"><button type="button" onClick={() => setPlaying((v) => !v)} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold">{playing ? "일시정지" : "재생"}</button>{frames.map((_, i) => <button type="button" aria-label={`${i + 1}단계 보기`} key={i} onClick={() => { setFrame(i); setPlaying(false); }} className={`h-8 w-8 rounded-full border text-xs ${i === frame ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{i + 1}</button>)}</div>
    </figure>
  );
}
