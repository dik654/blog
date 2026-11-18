import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 2절의 자료원(주문 관리 시스템, 메신저·전화·이메일, 계정·직원·고객 정보)을
 * 읽기 전용 사본·해시·추출 시각으로 고정하고 같은 기준 시각에 맞춰 사건표 한 장으로 합친 뒤,
 * 검토자가 종결·추가 조사·당국 보고 중 하나를 권한에 맞게 고른다. 시각은 1절의 가정이다.
 */
const ACCENT = "#2563eb";

const SOURCES = [
  { name: "주문 관리 시스템", items: ["입력 .100", "수정 .350", "취소 .600"], clock: "시스템 시계" },
  { name: "메신저·전화·이메일", items: ["09:59:50 대화"], clock: "통신 서버 시계" },
  { name: "계정·기기·직원 정보", items: ["계정 → 사람 연결"], clock: "계정 시스템 시계" },
] as const;

const ROWS = [
  { time: "09:59:50.000", what: "대화", from: "통신" },
  { time: "10:00:00.100", what: "주문 입력", from: "주문" },
  { time: "10:00:00.350", what: "수량 수정", from: "주문" },
  { time: "10:00:00.600", what: "주문 취소", from: "주문" },
  { time: "10:05:00.000", what: "내부 경보", from: "경보" },
] as const;

const SCENES = [
  { label: "흩어진 원본", summary: "주문 · 통신 · 신원 · 시계도 제각각", note: "주문 사건, 통신, 계정 연결은 서로 다른 시스템에 있고 시각을 재는 시계도 다를 수 있습니다. 시계가 같은 기준에 맞았는지 확인하기 전에는 대화와 주문 사이의 10.100초도 확정할 수 없습니다." },
  { label: "원본을 고정하고 시계를 맞추기", summary: "읽기 전용 사본 · 해시 · 추출 시각", note: "원시 주문 사건은 읽기 전용 사본으로 받고 원본 형식, 해시, 추출 시각을 적어 둡니다. 해시는 파일 내용에서 계산한 짧은 지문이라 사본이 한 글자라도 바뀌면 값이 달라집니다. 통신 자료와 계정 표는 같은 기준 시각으로 맞춥니다." },
  { label: "사건표 한 장", summary: "다섯 줄 · 같은 기준 시각", note: "같은 기준 시각 위에서 다섯 사건이 한 표로 정렬됩니다. 계정·기기·직원 정보는 주문 계정과 대화 참여자를 실제 사람에 이어 행위자를 찾게 합니다." },
  { label: "검토와 결정", summary: "종결 · 추가 조사 · 당국 보고", note: "분석가는 .100·.350·.600초의 변화를 재생하고 10초 전 대화를 옆에 놓습니다. 검토자는 반증과 누락 자료를 확인한 뒤 셋 중 하나를 자신의 권한에 맞게 결정합니다." },
] as const;

function SourceCards({ fixed }: { fixed: boolean }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {SOURCES.map((source, index) => (
        <div key={source.name} className="rounded-lg border p-2.5" style={{ borderColor: fixed ? ACCENT : "#cbd5e1" }}>
          <p className="text-xs font-bold">{source.name}</p>
          <ul className="mt-1 space-y-0.5">
            {source.items.map((item) => <li key={item} className="font-mono text-xs leading-5 text-muted-foreground">{item}</li>)}
          </ul>
          <p className="mt-2 text-[11px] leading-5" style={{ color: fixed ? ACCENT : "#64748b" }}>
            {fixed ? (index === 0 ? "읽기 전용 사본 · 원본 형식 · 해시 · 추출 시각" : "→ 같은 기준 시각으로 맞춤") : source.clock}
          </p>
        </div>
      ))}
    </div>
  );
}

function Table() {
  return (
    <div className="rounded-lg border p-2.5" style={{ borderColor: ACCENT }}>
      <p className="text-xs font-bold" style={{ color: ACCENT }}>시간순 사건표 (기준 시각)</p>
      <ol className="mt-1 divide-y divide-border">
        {ROWS.map((row) => (
          <li key={row.time} className="grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-center gap-2 py-1 text-xs leading-5">
            <span className="font-mono">{row.time}</span>
            <span className="font-semibold">{row.what}</span>
            <span className="rounded border border-[#cbd5e1] px-1.5 text-[11px] text-muted-foreground">{row.from}</span>
          </li>
        ))}
      </ol>
      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">행위자: 계정 표로 주문 계정과 대화 참여자를 사람에 연결</p>
    </div>
  );
}

function Decide() {
  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-[#cbd5e1] p-2.5">
          <p className="text-xs font-bold">분석가</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">.100 → .350 → .600 재생, 옆에 10초 전 대화</p>
        </div>
        <div className="rounded-lg border p-2.5" style={{ borderColor: ACCENT }}>
          <p className="text-xs font-bold" style={{ color: ACCENT }}>검토자</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">반증과 누락 자료 확인</p>
        </div>
      </div>
      <p className="text-center font-mono text-sm text-muted-foreground" aria-hidden>↓ 권한에 맞게 하나</p>
      <div className="grid grid-cols-3 gap-1.5">
        {["종결", "추가 조사", "당국 보고"].map((option) => (
          <div key={option} className="rounded-lg border border-[#cbd5e1] px-1 py-2 text-center text-xs font-semibold leading-5">{option}</div>
        ))}
      </div>
    </div>
  );
}

export default function EvidenceMergeViz() {
  return (
    <SceneShell
      eyebrow="조사 꾸러미"
      title="흩어진 원본이 한 장의 사건표가 되기까지"
      description="2절의 네 자료원 가운데 기록을 담은 세 곳(주문, 통신, 신원 연결)과 1절의 다섯 시각(가정)을 이 절의 순서대로 모읍니다. 네 번째인 보존 명령은 6절에서 따로 봅니다. 내부 경보는 세 곳과 별도의 분석 결과입니다."
      ariaLabel="주문, 통신, 계정 자료를 고정하고 같은 기준 시각으로 맞춰 사건표로 합친 뒤 검토자가 결정하는 과정"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) return <SourceCards fixed={false} />;
        if (active === 1) return <SourceCards fixed />;
        if (active === 2) return <Table />;
        return <Decide />;
      }}
    />
  );
}
