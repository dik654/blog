import type { ReactNode } from "react";
import VizFrame from "@/components/viz/VizFrame";

/**
 * attention_k_eq_v=true인 global층의 K/V 경로. 정지 화면이 관계를 더 정확히 보여 주므로 장면을 두지 않는다.
 * 한 mechanism: 출발 텐서는 하나여도 변환을 달리 거친 두 값이 cache.update에 들어가 ×2가 남는다.
 */
const K = "#2563eb";
const V = "#16a34a";

function Arrow() {
  return (
    <span className="block text-center font-mono text-sm leading-5 text-muted-foreground" aria-hidden="true">
      ↓
    </span>
  );
}

function Step({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div className="min-w-0 rounded-sm border px-3 py-2 text-center text-sm leading-6" style={{ borderColor: color ?? "#94a3b8" }}>
      {children}
    </div>
  );
}

export default function GemmaKvPathViz() {
  return (
    <VizFrame
      documentFlow
      eyebrow="global층의 K와 V"
      title="출발 텐서가 하나여도 cache에는 다른 값 둘이 들어갑니다"
      description="위에서 아래로 한 위치의 계산을 따라갑니다. 왼쪽이 K, 오른쪽이 V의 경로입니다."
      note="고정 Transformers의 gemma4 attention 경로입니다. 용량은 앞의 global 320MiB를 K와 V로 나눈 논리 값입니다."
    >
      <div className="grid gap-2">
        <Step>
          <span className="font-mono">k_proj</span>로 raw key 계산
        </Step>
        <div className="grid grid-cols-2 gap-2">
          <Arrow />
          <Arrow />
          <Step color={K}>
            <strong style={{ color: K }}>K</strong>의 출발값
          </Step>
          <Step color={V}>
            <strong style={{ color: V }}>V</strong>의 출발값
            <span className="block text-xs text-muted-foreground">같은 raw key를 사용</span>
          </Step>
          <Arrow />
          <Arrow />
          <Step color={K}>
            <span className="font-mono">k_norm</span>
            <span className="block text-xs text-muted-foreground">K 전용 정규화</span>
          </Step>
          <Step color={V}>
            <span className="font-mono">v_norm</span>
            <span className="block text-xs text-muted-foreground">V 전용 정규화</span>
          </Step>
          <Arrow />
          <Arrow />
          <Step color={K}>
            위치 회전
            <span className="block text-xs text-muted-foreground">K에만 적용</span>
          </Step>
          <Step color={V}>
            회전 없음
            <span className="block text-xs text-muted-foreground">V는 그대로</span>
          </Step>
          <Arrow />
          <Arrow />
        </div>
        <Step>
          <span className="font-mono">cache.update(K, V)</span>
          <span className="block text-xs text-muted-foreground">두 값을 모두 넘김</span>
        </Step>
        <p className="mt-2 text-center font-mono text-sm font-bold tabular-nums text-primary">
          K 160MiB + V 160MiB = 320MiB
        </p>
      </div>
    </VizFrame>
  );
}
