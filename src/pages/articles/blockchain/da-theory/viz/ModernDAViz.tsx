import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_SCENES = ["원본", "복원 조각", "약속값", "분산", "표본", "복원", "판정"] as const;
const TRACE_NOTES = [
  "게시자는 원본 조각 D0·D1·D2·D3 네 개를 가지고 있습니다. 아직 일부를 잃었을 때 되살릴 여분이 없습니다.",
  "같은 규칙으로 P4·P5·P6·P7 네 개를 더 계산합니다. 이제 위치를 아는 누락이라면 서로 다른 유효 조각 네 개로 원본을 다시 구할 수 있습니다.",
  "게시자는 여덟 조각에 대한 짧은 약속값을 남깁니다. 각 조각의 증거는 받은 값이 이 약속에 속하는지 확인하지만, 나머지 조각의 존재까지 말하지는 않습니다.",
  "조각을 여러 보관자에게 나눕니다. 한 보관자가 가진 조각만 반복해서 확인하면 독립된 가용성 증거가 되지 않으므로 위치와 응답 경로를 함께 기록합니다.",
  "검증자는 미리 정한 서로 다른 위치를 요청하고, 응답 시간과 증거를 확인합니다. D1·P4·P6·P7 네 조각이 제때 왔다고 가정합니다.",
  "유효한 네 조각을 같은 인코딩 규칙에 넣어 D0·D1·D2·D3을 복원합니다. 표본 성공만 세는 대신 실제 복원이 되는지 확인해야 합니다.",
  "조각 증거, 인코딩 규칙, 정해진 시간 안의 응답과 복원이 모두 통과해야 ‘이 조건에서 자료를 얻을 수 있다’고 판정합니다. 실행 결과의 정당성은 별도 질문입니다.",
] as const;

const PIECES = ["D0", "D1", "D2", "D3", "P4", "P5", "P6", "P7"] as const;
const SAMPLE_INDEXES = new Set([1, 4, 6, 7]);

function PieceRail({ active }: { active: number }) {
  return (
    <div className="grid grid-cols-8 gap-1" aria-label="원본 네 조각과 복원용 네 조각">
      {PIECES.map((piece, index) => {
        const visible = index < 4 || active >= 1;
        const sampled = active >= 4 && SAMPLE_INDEXES.has(index);
        const recovered = active >= 5 && index < 4;
        return (
          <div
            key={piece}
            className={`flex aspect-square min-w-0 items-center justify-center border text-[9px] font-black sm:text-xs ${
              !visible
                ? "border-dashed border-border text-transparent"
                : sampled
                  ? "border-primary bg-primary/15 text-primary"
                  : recovered
                    ? "border-emerald-600/70 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : index < 4
                      ? "border-foreground/35 text-foreground"
                      : "border-border text-muted-foreground"
            }`}
          >
            {visible ? piece : "·"}
          </div>
        );
      })}
    </div>
  );
}

export function DataAvailabilityTraceViz() {
  const scenes = useAnimatedScenes(TRACE_SCENES.length, 9000, { loop: false });
  const active = scenes.active;

  const status = active < 2
    ? "복원 조건 준비 중"
    : active < 4
      ? "조각의 진위 확인 가능"
      : active < 5
        ? "표본 응답 4개"
        : active < 6
          ? "원본 4개 복원"
          : "가용성 조건 통과";

  return (
    <VizFrame
      eyebrow="개념 경로 · 한 자료 묶음"
      title="네 조각을 여덟 조각으로 늘리고, 서로 다른 네 조각으로 원본을 되살립니다"
      description="같은 D0~D3 사례에서 복원용 조각, 약속값, 분산, 표본 응답과 실제 복원을 차례로 봅니다."
      note="설명용 (8,4) 조각입니다. 실제 프로토콜의 셀 수·표본 수·보관 규칙은 해당 버전에 귀속합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-da-trace-scene={active}
        tabIndex={0}
        role="group"
        aria-label="원본 네 조각을 확장해 분산하고 표본을 받아 복원하는 일곱 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-7 gap-px bg-border p-px" aria-label="데이터 가용성 판정의 전체 단계">
          {TRACE_SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 sm:block lg:text-[9px]">{label}</strong>
            </div>
          ))}
        </div>

        <section className="mt-3 grid gap-3 border border-border bg-background p-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(10rem,0.8fr)] sm:p-4">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-muted-foreground">현재 조각</span>
              <strong className="break-keep text-right text-[10px] text-primary">{status}</strong>
            </div>
            <div className="mt-3"><PieceRail active={active} /></div>
            <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-[10px]">
              <div className={`bg-background p-2 ${active >= 2 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">조각 증거</strong>{active >= 2 ? "PASS" : "대기"}</div>
              <div className={`bg-background p-2 ${active >= 5 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">복원</strong>{active >= 5 ? "4/4" : "대기"}</div>
              <div className={`bg-background p-2 ${active >= 6 ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}><strong className="block">판정</strong>{active >= 6 ? "AVAILABLE" : "대기"}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-border p-px text-center sm:grid-cols-1">
            {[
              ["보관자 A", "D0 · P4 · P7"],
              ["보관자 B", "D1 · D3 · P6"],
              ["보관자 C", "D2 · P5"],
            ].map(([name, pieces], index) => (
              <div key={name} className={`min-w-0 bg-background p-2 sm:p-3 ${active >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                <strong className="block break-keep text-[9px] sm:text-xs">{name}</strong>
                <span className="mt-1 block break-words font-mono text-[8px] leading-4 sm:text-[10px]">{active >= 3 ? pieces : `경로 ${index + 1}`}</span>
              </div>
            ))}
          </div>
        </section>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{TRACE_NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={TRACE_SCENES}
          controlLabels={["원본", "확장", "약속", "분산", "표본", "복원", "판정"]}
          playLabel="가용성 경로 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={TRACE_SCENES} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

export function ErasureGridViz() {
  return (
    <figure data-viz="da-erasure-grid" className="not-prose my-8 min-w-0 border-y border-border py-5">
      <figcaption>
        <p className="text-sm font-semibold text-foreground">(8,4) 설명용 조각 장부</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">원본 네 조각에 복원용 네 조각을 더합니다. 위치를 아는 누락이고 같은 규칙으로 만든 서로 다른 유효 조각 네 개가 필요합니다.</p>
      </figcaption>
      <div className="mt-5 grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="grid grid-cols-4 gap-2">{PIECES.slice(0, 4).map((piece) => <div key={piece} className="flex aspect-square items-center justify-center border border-foreground/35 text-xs font-black">{piece}</div>)}</div>
        <div className="text-center font-mono text-xs font-black text-primary">+ parity →</div>
        <div className="grid grid-cols-4 gap-2">{PIECES.slice(4).map((piece) => <div key={piece} className="flex aspect-square items-center justify-center border border-border text-xs font-black text-muted-foreground">{piece}</div>)}</div>
      </div>
      <dl className="mt-5 grid gap-px bg-border p-px text-xs sm:grid-cols-3">
        <div className="bg-background p-3"><dt className="font-bold">Code rate</dt><dd className="mt-1 text-muted-foreground">4÷8 = 1/2</dd></div>
        <div className="bg-background p-3"><dt className="font-bold">추가 공간</dt><dd className="mt-1 text-muted-foreground">(8−4)÷4 = 1</dd></div>
        <div className="bg-background p-3"><dt className="font-bold">복원 입력</dt><dd className="mt-1 text-muted-foreground">서로 다른 유효 조각 4개</dd></div>
      </dl>
    </figure>
  );
}

function MiniCells({ rows, columns, sourceRows, sourceColumns, activeColumn }: { rows: number; columns: number; sourceRows: number; sourceColumns: number; activeColumn?: number }) {
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} aria-hidden>
      {Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const source = row < sourceRows && column < sourceColumns;
        const selected = activeColumn === column;
        return <span key={index} className={`aspect-square border ${selected ? "border-primary bg-primary/20" : source ? "border-foreground/30 bg-foreground/10" : "border-border bg-muted/45"}`} />;
      })}
    </div>
  );
}

export function DAArchitectureViz() {
  return (
    <figure data-viz="da-architecture-comparison" className="not-prose my-8 min-w-0 border-y border-border py-5">
      <figcaption>
        <p className="text-sm font-semibold text-foreground">같은 자료 게시 문제를 세 구조가 다르게 풉니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">확장 방향과 검증자가 받는 단위를 먼저 보면 세 이름을 한 구조로 섞지 않을 수 있습니다.</p>
      </figcaption>
      <div className="mt-5 grid gap-px bg-border p-px lg:grid-cols-3">
        <section className="min-w-0 bg-background p-4">
          <span className="font-mono text-[9px] font-black text-primary">EIP-4844</span>
          <h3 className="mt-1 break-keep text-sm font-bold">각 노드가 sidecar 전체를 받습니다</h3>
          <div className="mt-4"><MiniCells rows={1} columns={8} sourceRows={1} sourceColumns={8} /></div>
          <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">표본 추출 없이 전체 blob을 받는 운송·가격 경계입니다.</p>
        </section>
        <section className="min-w-0 bg-background p-4">
          <span className="font-mono text-[9px] font-black text-primary">PEERDAS</span>
          <h3 className="mt-1 break-keep text-sm font-bold">행을 가로로 늘리고 열을 받습니다</h3>
          <div className="mt-4"><MiniCells rows={4} columns={8} sourceRows={4} sourceColumns={4} activeColumn={5} /></div>
          <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">각 blob 행은 1차원 확장하고, 모든 행의 같은 위치를 한 열로 묶습니다.</p>
        </section>
        <section className="min-w-0 bg-background p-4">
          <span className="font-mono text-[9px] font-black text-primary">CELESTIA</span>
          <h3 className="mt-1 break-keep text-sm font-bold">행과 열을 모두 늘린 정사각형입니다</h3>
          <div className="mx-auto mt-4 max-w-40"><MiniCells rows={8} columns={8} sourceRows={4} sourceColumns={4} /></div>
          <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">4×4 원본을 가로·세로로 확장해 8×8 구조를 만듭니다.</p>
        </section>
      </div>
    </figure>
  );
}
