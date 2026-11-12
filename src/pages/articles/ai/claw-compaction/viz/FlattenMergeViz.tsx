import type { ReactNode } from "react";
import CompactionSceneShell from "./CompactionSceneShell";

/**
 * 본문 대응: #summary-merge — 두 번째 compaction에서 이전 summary를 감싸면 껍질이 늘고,
 * pinned 구현은 이전 highlight를 top level로 올리고(flattening) 이전 timeline은 버린다.
 * 줄 내용은 본문의 “두 번째 cycle” 예제와 같다. 4장면의 permission denial 줄만 가정.
 */
const SCENES = [
  {
    label: "첫 compaction 결과",
    summary: "highlight + timeline",
    note: "첫 summary에는 highlight 두 줄과 timeline 한 줄이 있습니다. 그 뒤에 새 search·edit·test가 쌓이면 runtime은 오래된 구간을 다시 줄여야 합니다.",
  },
  {
    label: "감싸는 방식이었다면",
    summary: "cycle마다 껍질 +1",
    note: "비교용으로 이전 summary 전체를 새 summary의 한 항목으로 감싸 본 모양입니다. 압축할 때마다 “이전의 이전 context” 껍질이 한 겹씩 늘고, 최신 401 실패는 그만큼 뒤로 밀립니다.",
  },
  {
    label: "Pinned flattening",
    summary: "한 겹 · 이전 timeline 제외",
    note: "Pinned 구현은 이전 highlight를 같은 level에 그대로 두고, Newly compacted context 아래에 새 highlight를, Key timeline에는 이번 cycle의 timeline만 넣습니다. 두 Current work가 충돌한다는 사실은 text merge가 해결하지 않습니다.",
  },
  {
    label: "이전 timeline에만 있던 사실",
    summary: "구조적으로 찾지 못함",
    note: "이전 timeline은 highlight 추출에서 빠지므로, 중요한 permission denial이 그곳에만 있었다면 merge 결과에서 사라집니다(이 줄은 가정한 예). 그래서 permission은 typed field로 따로 보존해야 합니다.",
  },
] as const;

function Line({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "new" | "drop" | "warn" }) {
  const cls =
    tone === "new"
      ? "text-blue-700 dark:text-blue-300 font-semibold"
      : tone === "drop"
        ? "text-muted-foreground line-through decoration-[#dc2626]"
        : tone === "warn"
          ? "text-red-700 dark:text-red-400 font-semibold line-through decoration-[#dc2626]"
          : "text-foreground";
  return <p className={`min-w-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-5 sm:text-xs ${cls}`}>{children}</p>;
}

function Box({ title, children, tone = "solid" }: { title: string; children: ReactNode; tone?: "solid" | "dashed" | "accent" }) {
  const border =
    tone === "accent" ? "border-[#2563eb]" : tone === "dashed" ? "border-dashed border-border" : "border-border";
  return (
    <div className={`min-w-0 rounded-md border ${border} bg-background px-3 py-2`}>
      <p className="mb-1 text-[11px] font-bold text-muted-foreground">{title}</p>
      <div className="min-w-0 space-y-0.5">{children}</div>
    </div>
  );
}

export default function FlattenMergeViz() {
  return (
    <CompactionSceneShell
      eyebrow="반복 compaction"
      title="이전 summary를 감싸지 않고 같은 층으로 펼칩니다"
      description="상자 하나가 summary 하나입니다. Highlight는 Scope·Current work처럼 요약의 핵심 줄이고, timeline은 줄인 구간의 사건 목록입니다. 줄 내용은 본문의 두 번째 cycle 예제를 그대로 씁니다."
      ariaLabel="두 번째 compaction에서 중첩 방식과 pinned flattening 방식의 summary 구조 비교"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <Box title="cycle 1 summary">
              <Line>- Scope: 8 earlier messages compacted.</Line>
              <Line>- Current work: inspect auth middleware.</Line>
              <Line>- Key timeline:</Line>
              <Line>  - tool: read auth.ts</Line>
            </Box>
          );
        }
        if (active === 1) {
          return (
            <Box title="cycle 2 summary (감싸기 · 비교용)" tone="dashed">
              <div className="ml-2 border-l border-dashed border-[#d97706] pl-2">
                <p className="mb-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">previous context ▸</p>
                <Line>- Scope: 8 earlier messages compacted.</Line>
                <Line>- Current work: inspect auth middleware.</Line>
                <Line>- Key timeline:</Line>
                <Line>  - tool: read auth.ts</Line>
              </div>
              <Line tone="new">- Current work: patch missing bearer prefix.</Line>
              <Line tone="new">- Key timeline:</Line>
              <Line tone="new">  - tool: test exit=1; 401 remains.</Line>
              <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">다음 cycle에는 이 상자 전체가 다시 previous context ▸ 안으로</p>
            </Box>
          );
        }
        const warn = active === 3;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <Box title="cycle 1에서 넘어온 줄">
              <Line>- Scope: 8 earlier messages compacted.</Line>
              <Line>- Current work: inspect auth middleware.</Line>
              <Line tone="drop">- Key timeline:</Line>
              <Line tone="drop">  - tool: read auth.ts</Line>
              {warn && <Line tone="warn">  - credential read 거부 (가정)</Line>}
              <p className="mt-1 text-[11px] text-red-700 dark:text-red-400">취소선 = 이전 timeline이라 merge에서 빠짐</p>
            </Box>
            <Box title="cycle 2 merged (한 겹)" tone="accent">
              <Line>- Scope: 8 earlier messages compacted.</Line>
              <Line>- Current work: inspect auth middleware.</Line>
              <Line tone="new">- Newly compacted context:</Line>
              <Line tone="new">  - Current work: patch missing bearer prefix.</Line>
              <Line tone="new">- Key timeline:</Line>
              <Line tone="new">  - tool: test exit=1; 401 remains.</Line>
            </Box>
          </div>
        );
      }}
    />
  );
}
