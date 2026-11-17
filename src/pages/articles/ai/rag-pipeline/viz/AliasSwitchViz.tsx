import SceneShell from "./SceneShell";

/**
 * 본문 대응: #embedding 셋째 문단 — active index 보존 → 새 version으로 shadow index 생성 →
 * ANN recall·검색 품질·latency·storage 비교 → alias 전환 → 문제 시 이전 index와 query encoder tuple로 복귀.
 * index-v42는 본문의 active index 이름, index-v43은 새 version을 가리키는 설명용 이름(가정).
 */
type Slot = "old" | "new";
const SCENES = [
  { label: "현재 active", summary: "alias → index-v42", note: "alias는 검색 요청이 어느 index를 쓸지 가리키는 이름표입니다. 사용자 query는 alias가 가리키는 index와 같은 tuple의 query encoder로 encode됩니다.", alias: "old" as Slot, built: false, compare: false, rolledBack: false },
  { label: "shadow index 만들기", summary: "새 version으로 corpus 재encode", note: "기존 active index는 그대로 둡니다. 새 version의 encoder로 corpus를 다시 encode해 shadow index(사용자 요청에는 아직 쓰지 않는 index)를 만듭니다.", alias: "old" as Slot, built: true, compare: false, rolledBack: false },
  { label: "같은 조건에서 비교", summary: "recall · 품질 · latency · storage", note: "Exact-search subset에서 잰 ANN(근사 최근접 검색) recall, 같은 query의 검색 품질, latency와 storage를 두 index에 대해 비교합니다. 이 동안에도 요청은 index-v42가 처리합니다.", alias: "old" as Slot, built: true, compare: true, rolledBack: false },
  { label: "alias 전환", summary: "alias → index-v43 (가정)", note: "비교한 뒤 alias만 새 index로 옮깁니다. index와 query encoder가 한 쌍으로 함께 바뀌고, 이전 index-v42는 지우지 않고 보존합니다.", alias: "new" as Slot, built: true, compare: false, rolledBack: false },
  { label: "문제가 생기면 되돌리기", summary: "alias → index-v42 + 이전 encoder", note: "문제가 생기면 보존해 둔 이전 index와 query encoder tuple로 alias를 되돌립니다. 둘 중 하나만 되돌리면 query vector와 문서 vector가 다시 다른 좌표계에 놓입니다.", alias: "old" as Slot, built: true, compare: false, rolledBack: true },
] as const;

function IndexColumn({ name, encoder, pointed, present, comparing, faded, tag }: { name: string; encoder: string; pointed: boolean; present: boolean; comparing: boolean; faded: boolean; tag: string }) {
  return (
    <div className="flex min-w-0 flex-col items-stretch gap-2">
      <div className="flex h-12 flex-col items-center justify-end">
        {pointed && (
          <>
            <span className="rounded-md border border-[#2563eb] bg-[#2563eb]/15 px-2 py-0.5 text-[11px] font-bold text-[#1d4ed8] dark:text-[#93c5fd]">alias</span>
            <span className="text-sm leading-4 text-[#2563eb]" aria-hidden>↓</span>
          </>
        )}
      </div>
      <div
        className={`rounded-lg border px-2 py-2.5 text-center ${
          !present ? "border-dashed border-border/60 text-muted-foreground/50" : pointed ? "border-[#2563eb] bg-background" : "border-border bg-background"
        } ${faded ? "opacity-70" : ""}`}
      >
        <p className="font-mono text-[11px] text-muted-foreground">{present ? encoder : "아직 없음"}</p>
        <p className="mt-0.5 font-mono text-xs font-bold sm:text-sm">{present ? name : "—"}</p>
        <p className="mt-1 min-h-4 text-[10px] text-muted-foreground">{present ? tag : ""}</p>
      </div>
      <div className={`min-h-6 text-center text-[10px] font-semibold ${comparing ? "text-[#b45309] dark:text-[#fbbf24]" : "text-transparent"}`}>비교 대상</div>
    </div>
  );
}

export default function AliasSwitchViz() {
  return (
    <SceneShell
      eyebrow="Index 교체"
      title="alias는 index와 query encoder 한 쌍을 함께 가리킵니다"
      description="왼쪽이 지금 쓰는 index, 오른쪽이 새 version으로 만든 index입니다. 파란 alias가 가리키는 쌍이 사용자 요청을 처리합니다. index-v43은 설명용 이름입니다(가정)."
      ariaLabel="active index를 보존한 채 shadow index를 만들고 비교한 뒤 alias를 전환하고 되돌리는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-2 gap-4 sm:gap-8">
            <IndexColumn
              name="index-v42"
              encoder="이전 encoder"
              pointed={scene.alias === "old"}
              present
              comparing={scene.compare}
              faded={scene.alias !== "old"}
              tag={scene.alias === "old" ? (scene.rolledBack ? "복귀한 active" : "active") : "보존"}
            />
            <IndexColumn
              name="index-v43"
              encoder="새 encoder"
              pointed={scene.alias === "new"}
              present={scene.built}
              comparing={scene.compare}
              faded={scene.rolledBack}
              tag={scene.alias === "new" ? "active" : scene.rolledBack ? "요청에서 뺌" : "shadow"}
            />
          </div>
        );
      }}
    />
  );
}
