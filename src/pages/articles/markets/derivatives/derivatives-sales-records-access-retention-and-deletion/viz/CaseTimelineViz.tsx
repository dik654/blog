import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case (1·3절) — 14:10 고객정보, 14:12~14:30 녹취 18분, 14:32 주문.
 * 가로축은 14:10부터 14:32까지 22분을 같은 간격으로 놓습니다.
 * 14:12 = 2/22, 14:30 = 20/22, 14:32 = 22/22.
 */
const TOTAL_MIN = 22;
const pct = (minute: number) => `${(minute / TOTAL_MIN) * 100}%`;

type SlotState = "ok" | "missing" | "wrong" | "bound";

interface Scene {
  label: string;
  summary: string;
  note: string;
  info: boolean;
  rec: boolean;
  order: boolean;
  gap: "none" | "empty" | "focus";
  doc: SlotState;
  bound: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "22분 시간줄", summary: "14:10 → 14:32 = 22분", info: true, rec: true, order: true, gap: "none", doc: "ok", bound: false, note: "14시10분 고객정보 확정, 14시12분부터 18분 설명 녹취, 14시32분 주문입니다. 같은 사건의 자료가 22분 사이에 흩어져 생깁니다." },
  { label: "녹취만 남으면", summary: "18분 녹취 · 나머지는 빈칸", info: false, rec: true, order: false, gap: "empty", doc: "missing", bound: false, note: "음성 파일 하나만 남고 당시 고객정보·설명서 버전·주문 화면이 없으면, 왜 그 주문을 받았는지 재구성하기 어렵습니다(1절)." },
  { label: "2분의 빈칸", summary: "14:30 녹취 끝 → 14:32 주문", info: true, rec: true, order: true, gap: "focus", doc: "ok", bound: false, note: "18분 녹취는 14시30분에 끝납니다. 주문까지 남은 2분 동안의 질문·변경·확인도 따로 기록해야 시간줄이 끊기지 않습니다." },
  { label: "4판만 남으면", summary: "설명에 쓴 판 = 3판 · 저장소 = 4판", info: true, rec: true, order: true, gap: "none", doc: "wrong", bound: false, note: "설명할 때 쓴 설명서는 3판인데 저장소에 최신 4판만 남았다면, 당시 무엇을 설명했는지 증명할 수 없습니다." },
  { label: "버전으로 묶기", summary: "사건번호 ← 3판 해시·버전 식별자", info: true, rec: true, order: true, gap: "none", doc: "bound", bound: true, note: "파일 해시(내용이 한 글자만 바뀌어도 달라지는 지문 값)나 버전 식별자로 주문 시점의 3판을 사건에 묶습니다. 이후 4판이 나와도 이 사건은 3판을 가리킵니다." },
];

const SLOT_STYLE: Record<SlotState, string> = {
  ok: "border-border bg-background",
  missing: "border-dashed border-border/60 text-muted-foreground/60",
  wrong: "border-dashed border-red-600 text-red-700 dark:text-red-400",
  bound: "border-primary bg-primary/10",
};

function Slot({ title, value, state }: { title: string; value: string; state: SlotState }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center text-xs leading-5 ${SLOT_STYLE[state]}`}>
      <span className="block font-semibold">{title}</span>
      <span className="block font-mono">{state === "missing" ? "없음" : value}</span>
    </div>
  );
}

function Timeline({ scene }: { scene: Scene }) {
  const dim = "opacity-25";
  return (
    <div className="relative mx-1 h-32 text-[11px] sm:text-xs">
      {/* 2분 구간 */}
      {scene.gap !== "none" ? (
        <div
          className={`absolute top-6 h-12 rounded-sm border border-dashed ${scene.gap === "focus" ? "border-amber-600 bg-amber-500/15" : "border-border/60"}`}
          style={{ left: pct(20), width: pct(2) }}
        />
      ) : null}
      {/* 고객정보 점 */}
      <div className={`absolute top-8 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-500 ${scene.info ? "" : dim}`} style={{ left: pct(0) }} />
      {/* 녹취 막대 */}
      <div className={`absolute top-[2.85rem] h-3 rounded-sm bg-sky-600 ${scene.rec ? "" : dim}`} style={{ left: pct(2), width: pct(18) }} />
      <span className="absolute top-[4.1rem] -translate-x-1/2 whitespace-nowrap font-semibold text-sky-700 dark:text-sky-400" style={{ left: pct(11) }}>
        녹취 18분
      </span>
      {/* 주문 점 */}
      <div className={`absolute top-8 h-3 w-3 -translate-x-1/2 rotate-45 bg-emerald-600 ${scene.order ? "" : dim}`} style={{ left: pct(22) }} />
      {/* 축 */}
      <div className="absolute inset-x-0 top-[5.6rem] border-t border-border" />
      {[
        { m: 0, t: "14:10", cls: "top-[5.8rem]" },
        { m: 2, t: "14:12", cls: "top-[6.9rem]" },
        { m: 20, t: "14:30", cls: "top-[6.9rem] -translate-x-full" },
        { m: 22, t: "14:32", cls: "top-[5.8rem] -translate-x-full" },
      ].map((tick) => (
        <span key={tick.t} className={`absolute font-mono text-muted-foreground ${tick.cls}`} style={{ left: pct(tick.m) }}>
          <span className={`absolute top-[-0.35rem] h-1.5 border-l border-border ${tick.m === 20 || tick.m === 22 ? "right-0" : "left-0"}`} />
          {tick.t}
        </span>
      ))}
      <span className={`absolute top-0 whitespace-nowrap ${scene.info ? "" : dim}`} style={{ left: pct(0) }}>고객정보</span>
      <span className={`absolute top-0 -translate-x-full whitespace-nowrap ${scene.order ? "" : dim}`} style={{ left: pct(22) }}>주문</span>
      {scene.gap === "focus" ? (
        <span className="absolute top-[1.15rem] -translate-x-full whitespace-nowrap font-semibold text-amber-700 dark:text-amber-400" style={{ left: pct(19.6) }}>
          2분 → 질문·변경·확인
        </span>
      ) : null}
    </div>
  );
}

export default function CaseTimelineViz() {
  return (
    <SceneShell
      eyebrow="22분 판매 사건"
      title="녹취 하나로는 22분이 이어지지 않습니다"
      description="가로축은 14시10분부터 14시32분까지 22분을 같은 간격으로 놓았습니다. 아래 칸은 한 사건번호에 묶을 자료입니다."
      ariaLabel="14시10분 고객정보부터 14시32분 주문까지의 시간줄과 설명서 버전 연결"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-4">
            <Timeline scene={scene} />
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">{scene.bound ? "사건번호 하나에 묶인 자료" : "남아 있는 자료"}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Slot title="고객정보" value="14:10" state={scene.info ? (scene.bound ? "bound" : "ok") : "missing"} />
                <Slot title="설명서" value={scene.doc === "wrong" ? "4판만 있음" : "3판"} state={scene.doc} />
                <Slot title="녹취" value="14:12~14:30" state={scene.bound ? "bound" : "ok"} />
                <Slot title="주문" value="14:32" state={scene.order ? (scene.bound ? "bound" : "ok") : "missing"} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
