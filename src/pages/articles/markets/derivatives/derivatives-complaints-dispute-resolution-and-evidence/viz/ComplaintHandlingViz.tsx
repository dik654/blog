import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 부족액 10 사건을 쟁점별 접수·보존 → 담당자 자료 → 독립 민원 담당자 비교
 * → 최종 답변 → 반복 원인 분기까지 따라간다. 쟁점 두 개는 1절의 고객 주장(가격 이상, 알림 미수신)이다.
 * 인정·거절과 보상액은 본문에 없으므로 결과를 정하지 않는다.
 */
const ACCENT = "#2563eb";
const ISSUES = ["가격이 이상했다", "알림을 못 받았다"] as const;
const OWNERS = ["판매", "가격", "증거금", "통지"] as const;

const SCENES = [
  { label: "쟁점별로 나눠 접수", summary: "주장 2개 · 원본 로그 보존", note: "1절의 고객 주장 두 가지를 하나의 불만으로 뭉치지 않고 쟁점별로 접수합니다. 조사가 끝나기 전에 원본 로그가 지워지거나 바뀌지 않도록 보존부터 걸어 둡니다." },
  { label: "담당자 자료 → 독립 담당자", summary: "자료 4곳 → 비교 1곳", note: "판매, 가격, 증거금, 통지 담당자가 각자 자료를 내고, 독립된 민원 담당자가 약관·법규와 실제 시간줄을 나란히 비교합니다." },
  { label: "최종 답변에 적는 것", summary: "근거 · 인정/거절 · 보상 · 외부 경로", note: "판단과 계산 근거(70 − 80 = −10), 쟁점별로 인정하거나 거절한 항목, 보상액, 외부 구제기관과 기한을 적습니다. 어느 쟁점이 인정될지는 조사 결과에 달려 있어 여기서는 정하지 않았습니다." },
  { label: "반복된 원인인가", summary: "예 → 같은 계좌·시스템까지", note: "같은 원인이 반복됐다면 고객 한 명의 보상에서 끝내지 않고 같은 원인에 걸린 계좌와 시스템을 찾아 고칩니다. 고객 답변과 내부 통제가 같은 조사 결과에서 나옵니다." },
] as const;

function Box({ title, children, on = false, dashed = false }: { title: string; children?: ReactNode; on?: boolean; dashed?: boolean }) {
  return (
    <div className={`rounded-lg border p-2.5 ${dashed ? "border-dashed" : ""}`} style={{ borderColor: on ? ACCENT : "#cbd5e1" }}>
      <p className="text-xs font-bold" style={{ color: on ? ACCENT : undefined }}>{title}</p>
      {children}
    </div>
  );
}

function Intake() {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
      <Box title="고객 민원 · 부족액 10 사건">
        <p className="mt-1 text-xs leading-5 text-muted-foreground">“가격도 이상했고 알림도 못 받았다”</p>
      </Box>
      <span className="text-center font-mono text-sm text-muted-foreground" aria-hidden>
        <span className="sm:hidden">↓</span>
        <span className="hidden sm:inline">→</span>
      </span>
      <div className="space-y-2">
        {ISSUES.map((issue, index) => (
          <Box key={issue} title={`쟁점 ${index + 1}`} on>
            <p className="mt-0.5 text-xs leading-5">{issue}</p>
          </Box>
        ))}
        <Box title="원본 로그 보존" dashed>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">조사 동안 지우거나 바꾸지 않음</p>
        </Box>
      </div>
    </div>
  );
}

function Review() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-1.5">
        {OWNERS.map((owner) => (
          <div key={owner} className="rounded-lg border border-[#cbd5e1] px-1 py-2 text-center text-xs leading-5">
            <span className="block font-semibold">{owner}</span>
            <span className="block text-muted-foreground">담당 자료</span>
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-sm text-muted-foreground" aria-hidden>↓ ↓ ↓ ↓</p>
      <Box title="독립된 민원 담당자" on>
        <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-xs leading-5">
          <span className="rounded border border-[#cbd5e1] px-2 py-1 text-center">약관 · 법규</span>
          <span className="font-mono" style={{ color: ACCENT }}>↔</span>
          <span className="rounded border border-[#cbd5e1] px-2 py-1 text-center">실제 시간줄</span>
        </div>
      </Box>
    </div>
  );
}

function Answer() {
  const rows = [
    { item: "판단과 계산 근거", value: "70 − 80 = −10" },
    { item: `쟁점 1 · ${ISSUES[0]}`, value: "인정 또는 거절" },
    { item: `쟁점 2 · ${ISSUES[1]}`, value: "인정 또는 거절" },
    { item: "보상액", value: "조사 결과에 따름" },
    { item: "외부 구제기관과 기한", value: "감독·조정 → 중재·법원" },
  ];
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: ACCENT }}>
      <p className="text-xs font-bold" style={{ color: ACCENT }}>최종 답변</p>
      <ul className="mt-2 divide-y divide-border">
        {rows.map((row) => (
          <li key={row.item} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 py-1.5 text-xs leading-5">
            <span className="font-semibold">{row.item}</span>
            <span className="text-right font-mono text-muted-foreground">{row.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">외부 경로의 관할과 기한은 국가·상품·계약 법인에 따라 달라집니다.</p>
    </div>
  );
}

function Branch() {
  return (
    <div className="space-y-2">
      <Box title="조사에서 찾은 원인이 반복된 것인가?" on />
      <div className="grid grid-cols-2 gap-2">
        <Box title="아니오">
          <p className="mt-1 text-xs leading-5 text-muted-foreground">이 고객 건의 최종 답변으로 마무리</p>
        </Box>
        <Box title="예" on>
          <p className="mt-1 text-xs leading-5">고객 한 명의 보상에서 끝내지 않음</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">같은 원인의 계좌와 시스템을 찾아 고침</p>
        </Box>
      </div>
    </div>
  );
}

export default function ComplaintHandlingViz() {
  return (
    <SceneShell
      eyebrow="민원 처리 경로"
      title="부족액 10 사건이 접수에서 재발 방지까지 가는 길"
      description="1·3절의 사례를 이 절의 순서대로 따라갑니다. 고객 주장 두 가지는 1절에서 가져왔고, 어느 쪽이 인정될지는 정하지 않았습니다."
      ariaLabel="쟁점별 접수와 보존, 담당자 자료와 독립 검토, 최종 답변 항목, 반복 원인 분기를 차례로 보이는 장면"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) return <Intake />;
        if (active === 1) return <Review />;
        if (active === 2) return <Answer />;
        return <Branch />;
      }}
    />
  );
}
