import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #generation-sources — Evol-Instruct의 In-Depth·In-Breadth 갈래와 Elimination 거름.
 * 52,000 → 250,000(약 4.8배), 그 가운데 70,000개(28%)를 뽑아 학습. 제거된 개수는 글에 없어 그리지 않습니다.
 */
const SEED = 52000;
const EVOLVED = 250000;
const PICKED = 70000;

const SCENES = [
  { label: "In-Depth: 같은 지시를 더 어렵게", summary: "다섯 방법 중 하나", note: "seed instruction 하나에 다섯 방법 중 하나를 적용해 더 어렵게 다시 씁니다." },
  { label: "In-Breadth: 옆으로 넓히기", summary: "같은 영역의 더 드문 지시", note: "또는 더 어렵게 고치는 대신 같은 영역에서 더 드문 새 instruction을 만듭니다." },
  { label: "Elimination: 진화 결과 거르기", summary: "두 경우를 제거", note: "정보 이득이 없거나 모델이 답을 만들지 못한 결과를 거릅니다. 빠지는 개수는 글에 없습니다." },
  { label: "4 epoch(진화 4회) 뒤의 규모", summary: "52,000 → 250,000개", note: `seed의 약 ${(EVOLVED / SEED).toFixed(1)}배가 되고, 그 ${Math.round((PICKED / EVOLVED) * 100)}%인 70,000개를 뽑아 학습에 썼습니다.` },
] as const;

function Box({ on, children }: { on: boolean; children: ReactNode }) {
  return <div className={`rounded-lg border px-3 py-2 text-xs leading-5 ${on ? "border-primary bg-primary/10" : "border-border text-muted-foreground"}`}>{children}</div>;
}

function CountBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${(value / EVOLVED) * 100}%` }} />
      </div>
      <span className="text-right font-mono">{value.toLocaleString("en-US")}</span>
    </div>
  );
}

export default function EvolInstructBranchViz() {
  return (
    <SceneShell
      eyebrow="Evol-Instruct"
      title="한 instruction은 깊어지거나 넓어진 뒤 거름을 지나 pool에 남습니다"
      description="Alpaca의 instruction 52,000개가 seed입니다. 한 개의 길을 따라간 뒤 전체 규모를 봅니다."
      ariaLabel="Evol-Instruct의 In-Depth, In-Breadth, Elimination 갈래와 4 epoch 뒤의 규모"
      scenes={SCENES}
      render={(index) =>
        index === 3 ? (
          <div className="space-y-3 pt-2">
            <CountBar label="seed" value={SEED} />
            <CountBar label="4 epoch 뒤" value={EVOLVED} />
            <CountBar label="학습에 뽑음" value={PICKED} />
          </div>
        ) : (
          <div className="min-w-0 space-y-2">
            <div className="hidden rounded-lg border border-border bg-background px-3 py-2 text-center text-xs font-semibold sm:block">seed instruction 하나</div>
            <p aria-hidden="true" className="hidden text-center text-primary sm:block">↓</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Box on={index === 0}>
                <strong className="block">In-Depth Evolving</strong>
                <span className="block">제약 추가 · deepening(더 깊이 묻기) · concretizing(더 구체적으로) · 추론 단계 증가 · 입력 확장</span>
              </Box>
              <p className="text-center text-xs leading-3 text-primary sm:hidden">또는</p>
              <Box on={index === 1}>
                <strong className="block">In-Breadth Evolving</strong>
                <span className="block">같은 영역에서 더 드문 새 instruction</span>
              </Box>
            </div>
            <p aria-hidden="true" className="text-center text-xs leading-3 text-primary sm:text-base sm:leading-6">↓</p>
            <Box on={index === 2}>
              <strong className="block">Elimination Evolving</strong>
              <span className="block">정보 이득 없음 · 답을 못 만듦 → 제거, 나머지만 남음</span>
            </Box>
          </div>
        )
      }
    />
  );
}
