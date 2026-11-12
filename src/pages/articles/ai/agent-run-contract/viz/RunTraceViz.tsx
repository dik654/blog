import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case·#inside-contract·#context-capability.
 * 위 칸 = 실행 기록 run=layout-1의 다섯 자리. 아래 = 390px 화면에서 문서 폭과 넘침.
 * 넘침 = 문서 폭 − 화면 폭 → 시작 430−390=40, 통과 390−390=0, 실패 410−390=20.
 * 모든 값은 본문이 정한 학습용 가정입니다.
 */
const VIEW = 390;
const AXIS = 440;

type SlotState = "empty" | "set" | "focus" | "bad";

interface Slot {
  head: string;
  body: string;
  state: SlotState;
}

interface TraceScene {
  label: string;
  summary: string;
  note: string;
  slots: readonly Slot[];
  doc: number | null;
  docTag: string;
  check: readonly { text: string; ok: boolean | null }[];
}

const SCENES: readonly TraceScene[] = [
  {
    label: "시작: 390px에서 40px 넘침",
    summary: "430 − 390 = 40px",
    note: "390px 화면에서 문서가 430px이라 40px가 넘칩니다. 실행 기록 run=layout-1에 목표와 /repo/page.css의 시작 버전부터 넣고, 1440px도 함께 확인하기로 합니다. (가정)",
    slots: [
      { head: "목표", body: "가로 넘침 제거", state: "focus" },
      { head: "시작 버전", body: "page.css 시작본", state: "focus" },
      { head: "쓰기 권한", body: "아직 검사 전", state: "empty" },
      { head: "수정 결과", body: "아직 없음", state: "empty" },
      { head: "결과 기록", body: "아직 없음", state: "empty" },
    ],
    doc: 430,
    docTag: "시작 버전",
    check: [
      { text: "390px 넘침 없음", ok: false },
      { text: "1440px 넘침 없음 (함께 확인할 대상)", ok: null },
      { text: "기존 버튼 동작 유지", ok: null },
    ],
  },
  {
    label: "읽기와 쓰기는 따로 검사합니다",
    summary: "쓰기 허용 파일 1개",
    note: "읽기는 자료를 찾는 행동이고, 쓰기는 따로 capability(실제로 허용된 작업) 검사를 받아 /repo/page.css 한 개만 통과합니다. 자료를 읽었어도 다른 파일을 쓸 권한은 생기지 않습니다. (가정)",
    slots: [
      { head: "목표", body: "가로 넘침 제거", state: "set" },
      { head: "시작 버전", body: "page.css 시작본", state: "set" },
      { head: "쓰기 권한", body: "page.css만 허용", state: "focus" },
      { head: "수정 결과", body: "아직 없음", state: "empty" },
      { head: "결과 기록", body: "아직 없음", state: "empty" },
    ],
    doc: null,
    docTag: "",
    check: [],
  },
  {
    label: "v2를 두 폭에서 검사해 통과",
    summary: "390 − 390 = 0px",
    note: "patch=v2를 두 폭에서 검사해 document=390, document=1440이 나오고 버튼도 동작하면 acceptance(완료 조건)를 충족합니다. 결과 기록에는 v2, 두 측정값, 검사 시각을 묶습니다. (가정)",
    slots: [
      { head: "목표", body: "가로 넘침 제거", state: "set" },
      { head: "시작 버전", body: "page.css 시작본", state: "set" },
      { head: "쓰기 권한", body: "page.css만 허용", state: "set" },
      { head: "수정 결과", body: "patch=v2", state: "focus" },
      { head: "결과 기록", body: "완료 · v2 · 두 측정값 · 시각", state: "focus" },
    ],
    doc: 390,
    docTag: "v2",
    check: [
      { text: "390px 넘침 없음", ok: true },
      { text: "1440px 넘침 없음 (document=1440)", ok: true },
      { text: "기존 버튼 동작 유지", ok: true },
    ],
  },
  {
    label: "같은 검사가 실패한 갈래",
    summary: "410 − 390 = 20px",
    note: "앞 장면 대신 390px에서 여전히 410px이면 20px가 남습니다. 미완료로 기록하고 남은 재시도 1회와 수정 대상 위치를 넘기며, 다음 실행은 이 결과를 다시 확인한 뒤 이어갑니다. (가정)",
    slots: [
      { head: "목표", body: "가로 넘침 제거", state: "set" },
      { head: "시작 버전", body: "page.css 시작본", state: "set" },
      { head: "쓰기 권한", body: "page.css만 허용", state: "set" },
      { head: "수정 결과", body: "patch=v2", state: "focus" },
      { head: "결과 기록", body: "미완료 · 재시도 1회 남음", state: "bad" },
    ],
    doc: 410,
    docTag: "v2",
    check: [
      { text: "390px 넘침 없음", ok: false },
      { text: "1440px 값은 이 갈래에서 본문에 없음", ok: null },
      { text: "버튼 결과도 본문에 없음", ok: null },
    ],
  },
  {
    label: "검사 뒤 파일이 v3로 바뀌면",
    summary: "v2 통과 기록 ≠ v3",
    note: "통과 기록은 v2를 검사한 결과입니다. 검사 뒤 파일이 v3로 바뀌면 그 기록을 새 결과에 붙일 수 없으므로, 기록과 파일이 같은 버전을 가리키는지부터 다시 확인합니다.",
    slots: [
      { head: "목표", body: "가로 넘침 제거", state: "set" },
      { head: "시작 버전", body: "page.css 시작본", state: "set" },
      { head: "쓰기 권한", body: "page.css만 허용", state: "set" },
      { head: "수정 결과", body: "검사 뒤 v3로 바뀜", state: "bad" },
      { head: "결과 기록", body: "완료 · v2 기준", state: "focus" },
    ],
    doc: null,
    docTag: "",
    check: [],
  },
];

const SLOT_STYLE: Record<SlotState, string> = {
  empty: "border-dashed border-border/60 text-muted-foreground/60",
  set: "border-border bg-background",
  focus: "border-[#2563eb] bg-[#2563eb]/10",
  bad: "border-dashed border-[#dc2626] bg-[#dc2626]/10",
};

function pct(px: number) {
  return `${(px / AXIS) * 100}%`;
}

function WidthPanel({ scene }: { scene: TraceScene }) {
  const doc = scene.doc ?? VIEW;
  const over = Math.max(doc - VIEW, 0);
  return (
    <div className="mt-4 space-y-3">
      <div className="text-xs font-semibold">390px 화면 · 문서 폭 ({scene.docTag})</div>
      <div className="relative h-11 min-w-0">
        <div className="absolute inset-x-0 top-5 h-5 rounded-sm bg-muted/40" />
        <div className="absolute top-5 h-5 rounded-l-sm bg-[#64748b]" style={{ left: 0, width: pct(Math.min(doc, VIEW)) }} />
        {over > 0 && (
          <div className="absolute top-5 h-5 rounded-r-sm bg-[#dc2626]" style={{ left: pct(VIEW), width: pct(over) }} />
        )}
        <div className="absolute top-3 h-8 border-l-2 border-[#2563eb]" style={{ left: pct(VIEW) }} />
        <span className="absolute top-0 -translate-x-full whitespace-nowrap pr-1 text-[11px] leading-3 font-semibold text-[#2563eb]" style={{ left: pct(VIEW) }}>
          화면 끝 390px
        </span>
      </div>
      <div className="font-mono text-xs">
        문서 {doc}px − 화면 {VIEW}px ={" "}
        <span className={over > 0 ? "font-bold text-[#dc2626]" : "font-bold text-[#15803d]"}>넘침 {over}px</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {scene.check.map((c) => (
          <span key={c.text} className={c.ok === true ? "font-semibold text-[#15803d]" : c.ok === false ? "font-semibold text-[#dc2626]" : "text-muted-foreground"}>
            {c.ok === true ? "통과" : c.ok === false ? "실패" : "미정"} · {c.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function CapabilityPanel() {
  const rows = [
    { what: "화면 규칙 문서 읽기", kind: "자료 찾기", ok: true },
    { what: "/repo/page.css 읽기", kind: "자료 찾기", ok: true },
    { what: "/repo/page.css 쓰기", kind: "capability 검사", ok: true },
    { what: "다른 파일 쓰기", kind: "capability 검사", ok: false },
  ] as const;
  return (
    <div className="mt-3 grid gap-1.5">
      {rows.map((r) => (
        <div key={r.what} className="grid grid-cols-[minmax(0,1fr)_auto_3rem] items-center gap-2 rounded-lg border border-border px-3 py-1 text-xs">
          <span className="font-semibold">{r.what}</span>
          <span className="text-muted-foreground">{r.kind}</span>
          <span className={`text-right font-bold ${r.ok ? "text-[#15803d]" : "text-[#dc2626]"}`}>{r.ok ? "허용" : "거절"}</span>
        </div>
      ))}
    </div>
  );
}

function VersionPanel() {
  return (
    <div className="mt-4 grid gap-2 text-xs sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div className="rounded-lg border border-[#2563eb] bg-[#2563eb]/10 px-3 py-2">
        <span className="block font-semibold">결과 기록</span>
        <span className="block">검사한 버전: v2 · 390/1440 · 검사 시각</span>
      </div>
      <span className="text-center font-bold text-[#dc2626]">v2 ≠ v3 → 붙이지 않음</span>
      <div className="rounded-lg border border-dashed border-[#dc2626] bg-[#dc2626]/10 px-3 py-2">
        <span className="block font-semibold">지금 파일</span>
        <span className="block">v3 · 이 버전의 검사 기록 없음</span>
      </div>
    </div>
  );
}

export default function RunTraceViz() {
  return (
    <SceneShell
      eyebrow="실행 기록 따라가기"
      title="한 번의 실행이 기록에 무엇을 남기는가"
      description="위 칸은 실행 기록 run=layout-1의 자리, 아래 막대는 390px 화면에서 문서 폭(px)입니다. 3·4절과 이 절의 학습용 가정 값을 그대로 씁니다(가정)."
      note="넘침은 문서 폭에서 화면 폭을 뺀 값입니다. 네 번째 장면은 세 번째 장면 대신 생길 수 있는 갈래이고, 다섯 번째 장면은 4절의 버전 연결 규칙입니다."
      ariaLabel="실행 기록 run=layout-1이 시작, 권한 검사, v2 검사 통과 또는 실패, 파일 변경을 거치며 채워지는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-5 sm:gap-2">
              {scene.slots.map((slot) => (
                <div
                  key={slot.head}
                  className={`flex items-baseline justify-between gap-2 rounded-lg border px-2 py-0.5 text-xs leading-5 sm:block sm:py-1.5 ${SLOT_STYLE[slot.state]}`}
                >
                  <span className="block shrink-0 font-semibold">{slot.head}</span>
                  <span className="block min-w-0 text-right sm:text-left">{slot.body}</span>
                </div>
              ))}
            </div>
            {index === 1 ? <CapabilityPanel /> : index === 4 ? <VersionPanel /> : <WidthPanel scene={scene} />}
          </div>
        );
      }}
    />
  );
}
