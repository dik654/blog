import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 2절의 판매·체결·증거금·민원 네 묶음에 흩어진 기록을
 * 계좌 개설 → 주문 → 손실 → 통지 → 청산 → 문의 → 답변의 한 시간줄로 다시 놓는다.
 * 3절이 묻는 "고객 통지 전에 청산했는지"를 두 순서로 나란히 둔다. 간격은 실제 시간 비율이 아니다.
 */
const BUNDLES = ["판매", "체결", "증거금", "민원"] as const;
type Bundle = (typeof BUNDLES)[number];

const EVENTS: readonly { name: string; detail: string; bundles: readonly Bundle[] }[] = [
  { name: "계좌 개설", detail: "질문과 경고", bundles: ["판매"] },
  { name: "주문", detail: "그 시각의 호가", bundles: ["체결"] },
  { name: "손실 발생", detail: "자금 100 → 70", bundles: ["증거금"] },
  { name: "증거금 통지", detail: "필요 80 · 부족 10", bundles: ["증거금"] },
  { name: "청산 주문과 체결", detail: "강제청산 순서", bundles: ["체결", "증거금"] },
  { name: "고객 문의", detail: "고객 주장", bundles: ["민원"] },
  { name: "회사 답변", detail: "답변과 보상 여부", bundles: ["민원"] },
];

const ACCENT = "#2563eb";

const SCENES = [
  { label: "네 묶음에 흩어진 기록", summary: "판매 · 체결 · 증거금 · 민원", note: "2절의 네 묶음은 따로 쌓입니다. 묶음 안에서만 보면 손실 30 앞에 어떤 설명과 가격이 있었고, 그 뒤에 통지와 청산이 어떤 순서로 왔는지 알 수 없습니다." },
  { label: "사건 순서로 한 줄에 놓기", summary: "개설 → … → 답변", note: "일곱 사건을 일어난 순서대로 한 줄에 놓고, 각 시각이 어느 표준시간대이고 어느 시스템 원본에서 왔는지 함께 적습니다. 칸 간격은 순서만 보여 주며 실제 시간 비율이 아닙니다." },
  { label: "고객 캡처를 원본과 맞춰 보기", summary: "캡처 = 단서, 결론 아님", note: "고객 화면 캡처는 중요한 단서지만 서버 로그, 가격 원천, 전화·채팅 녹취와 맞춰 봅니다. 회사 내부 정책도 실제 약관과 고객에게 준 문서에 들어 있었는지 확인합니다." },
  { label: "통지와 청산, 어느 쪽이 먼저였나", summary: "같은 부족액 10, 다른 순서", note: "부족액 10은 두 경우 모두 같습니다. 3절은 고객 통지 전에 청산했는지도 보라고 합니다. 이 순서는 약관, 가격 원천, 급격한 가격 틈에서의 집행과 함께 판단할 사실 하나이며 그것만으로 결론을 내리지 않습니다." },
] as const;

function Tag({ label, strong = false }: { label: string; strong?: boolean }) {
  return (
    <span
      className="inline-block rounded border px-1.5 text-[11px] leading-5"
      style={{ borderColor: strong ? ACCENT : "#94a3b8", color: strong ? ACCENT : "#64748b" }}
    >
      {label}
    </span>
  );
}

function Scattered() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {BUNDLES.map((bundle) => (
        <div key={bundle} className="rounded-lg border border-border p-2">
          <p className="text-xs font-bold">{bundle} 기록</p>
          <ul className="mt-1 space-y-1">
            {EVENTS.filter((event) => event.bundles.includes(bundle)).map((event) => (
              <li key={event.name} className="text-xs leading-5 text-muted-foreground">{event.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Line() {
  return (
    <ol className="relative space-y-1.5 border-l border-[#94a3b8] pl-4">
      {EVENTS.map((event, index) => {
        return (
          <li key={event.name} className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border" style={{ borderColor: "#64748b", backgroundColor: "#ffffff" }} />
            <span className="min-w-0 text-xs leading-5 sm:text-sm">
              <span className="font-mono text-muted-foreground">{index + 1}. </span>
              <span className="font-semibold">{event.name}</span>
              <span className="text-muted-foreground"> · {event.detail}</span>
            </span>
            <span className="flex flex-wrap justify-end gap-1">
              {event.bundles.map((bundle) => <Tag key={bundle} label={bundle} />)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Ordered() {
  return (
    <div className="space-y-2">
      <Line />
      <p className="text-xs leading-5 text-muted-foreground">
        모든 시각에 함께 적는 것: <Tag label="표준시간대" strong /> <Tag label="시스템 원본" strong />
      </p>
    </div>
  );
}

function CrossCheck() {
  const sources = ["서버 로그", "가격 원천", "전화·채팅 녹취"];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-dashed p-3" style={{ borderColor: "#d97706" }}>
        <p className="text-xs font-bold" style={{ color: "#b45309" }}>고객 화면 캡처</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">고객이 본 가격과 알림 화면</p>
        <ul className="mt-2 space-y-1">
          {sources.map((source) => (
            <li key={source} className="flex items-center gap-2 text-xs leading-5">
              <span className="font-mono" style={{ color: ACCENT }}>↔</span>
              <span className="font-semibold">{source}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="text-xs font-bold">회사 내부 정책</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">회사가 따랐다고 말하는 처리 기준</p>
        <ul className="mt-2 space-y-1">
          {["실제 약관", "고객에게 제공된 문서"].map((doc) => (
            <li key={doc} className="flex items-center gap-2 text-xs leading-5">
              <span className="font-mono" style={{ color: ACCENT }}>↔</span>
              <span className="font-semibold">{doc}에 반영됐나</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Order({ title, steps }: { title: string; steps: readonly string[] }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs font-bold">{title}</p>
      <ol className="mt-2 flex flex-wrap items-center gap-1 text-xs leading-5">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-1">
            {index > 0 && <span className="text-muted-foreground">→</span>}
            <span
              className="rounded border px-1.5"
              style={{ borderColor: step === "통지" || step === "청산" ? ACCENT : "#cbd5e1", color: step === "통지" || step === "청산" ? ACCENT : undefined, fontWeight: step === "통지" || step === "청산" ? 700 : 400 }}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NoticeOrder() {
  return (
    <div className="space-y-2">
      <Order title="순서 가: 통지가 먼저" steps={["손실 · 자금 70", "통지", "청산"]} />
      <Order title="순서 나: 청산이 먼저" steps={["손실 · 자금 70", "청산", "통지"]} />
      <p className="text-xs leading-5 text-muted-foreground">어느 순서였는지는 증거금 기록의 통지 시각과 체결 기록의 청산 시각을 같은 시간대로 맞춰야 보입니다.</p>
    </div>
  );
}

export default function EvidenceTimelineViz() {
  return (
    <SceneShell
      eyebrow="사건 시간줄"
      title="네 묶음의 기록을 한 줄의 시간 순서로"
      description="1·3절의 사례(자금 100, 손실 30, 필요 증거금 80, 부족 10)를 2절의 네 기록 묶음과 이 절의 일곱 사건으로 다시 놓습니다. 각 사건의 실제 시각은 본문에 없어 순서만 표시합니다."
      ariaLabel="판매, 체결, 증거금, 민원 기록을 일곱 사건의 시간줄로 합치고 통지와 청산의 순서를 비교하는 장면"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) return <Scattered />;
        if (active === 1) return <Ordered />;
        if (active === 2) return <CrossCheck />;
        return <NoticeOrder />;
      }}
    />
  );
}
